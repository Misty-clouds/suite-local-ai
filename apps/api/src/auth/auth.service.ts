import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomInt, randomUUID, timingSafeEqual } from 'crypto';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './types/jwt-payload';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: Record<string, unknown>;
}

const SALT_ROUNDS = 12;
const RESET_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESET_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      email: dto.email,
      password,
      name: dto.name,
    });

    return this.issueSession(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueSession(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findByIdWithRefreshToken(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Session is no longer valid');
    }

    if (!this.refreshTokenMatches(refreshToken, user.refreshTokenHash)) {
      throw new UnauthorizedException('Session is no longer valid');
    }

    // Rotate: issue fresh tokens and replace the stored hash.
    const tokens = await this.signTokens(user);
    await this.persistRefreshToken(user.id as string, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setRefreshTokenHash(userId, null);
  }

  async getProfile(userId: string): Promise<Record<string, unknown>> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return user.toJSON();
  }

  async updateProfile(
    userId: string,
    patch: { name?: string; avatarUrl?: string },
  ): Promise<Record<string, unknown>> {
    const user = await this.usersService.updateProfile(userId, patch);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return user.toJSON();
  }

  // ─── Password reset (OTP) ─────────────────────────────────────────────────────

  /** Emails a 6-digit reset code. Always succeeds so it can't reveal whether an
   *  account exists for the given email. */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;

    const code = this.generateResetCode();
    const hash = await bcrypt.hash(code, SALT_ROUNDS);
    await this.usersService.setResetCode(
      user.id as string,
      hash,
      new Date(Date.now() + RESET_CODE_TTL_MS),
    );
    await this.mailService.sendPasswordResetCode(user.email, code);
  }

  /** Checks a code without consuming it (lets the UI advance to the new-password
   *  step). Throws on an invalid/expired code. */
  async verifyResetCode(email: string, code: string): Promise<void> {
    await this.validateResetCode(email, code);
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.validateResetCode(email, code);
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.usersService.updatePasswordAndClearReset(
      user.id as string,
      passwordHash,
    );
  }

  // ─── Internals ──────────────────────────────────────────────────────────────

  private async issueSession(user: UserDocument): Promise<AuthResult> {
    const tokens = await this.signTokens(user);
    await this.persistRefreshToken(user.id as string, tokens.refreshToken);
    return { user: user.toJSON(), ...tokens };
  }

  private async signTokens(user: UserDocument): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id as string,
      email: user.email,
      role: user.role,
    };

    const accessOptions = {
      secret:
        this.config.get<string>('JWT_ACCESS_SECRET') ?? 'dev-access-secret',
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
    } as JwtSignOptions;

    const refreshOptions = {
      secret: this.refreshSecret(),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
      // Unique id per refresh token so each is distinct (and rotation always
      // invalidates the previous one) even when issued within the same second.
      jwtid: randomUUID(),
    } as JwtSignOptions;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessOptions),
      this.jwtService.signAsync(payload, refreshOptions),
    ]);

    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.usersService.setRefreshTokenHash(
      userId,
      this.hashRefreshToken(refreshToken),
    );
  }

  // Refresh tokens are long, high-entropy JWTs, so a fast SHA-256 digest is
  // appropriate (and avoids bcrypt's 72-byte input truncation, which would
  // make two tokens for the same user collide).
  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private refreshTokenMatches(
    refreshToken: string,
    storedHash: string,
  ): boolean {
    const incoming = Buffer.from(this.hashRefreshToken(refreshToken));
    const stored = Buffer.from(storedHash);
    return (
      incoming.length === stored.length && timingSafeEqual(incoming, stored)
    );
  }

  private refreshSecret(): string {
    return (
      this.config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret'
    );
  }

  private generateResetCode(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, '0');
  }

  /** Loads the user and validates the supplied reset code (expiry, attempt
   *  limit, match). Uses a single generic error so it can't be used to probe
   *  which emails exist. */
  private async validateResetCode(
    email: string,
    code: string,
  ): Promise<UserDocument> {
    const invalid = new BadRequestException('Invalid or expired code');

    const user = await this.usersService.findByEmailWithResetCode(email);
    if (!user || !user.resetCodeHash || !user.resetCodeExpires) {
      throw invalid;
    }

    if (user.resetCodeExpires.getTime() < Date.now()) {
      await this.usersService.clearResetCode(user.id as string);
      throw invalid;
    }

    if (user.resetCodeAttempts >= RESET_MAX_ATTEMPTS) {
      await this.usersService.clearResetCode(user.id as string);
      throw new BadRequestException(
        'Too many attempts. Please request a new code.',
      );
    }

    const matches = await bcrypt.compare(code, user.resetCodeHash);
    if (!matches) {
      await this.usersService.incrementResetAttempts(user.id as string);
      throw invalid;
    }

    return user;
  }
}
