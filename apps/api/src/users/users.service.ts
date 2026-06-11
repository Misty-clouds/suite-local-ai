import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(input: CreateUserInput): Promise<UserDocument> {
    return this.userModel.create(input);
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  updateProfile(
    id: string,
    patch: { name?: string; avatarUrl?: string },
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, patch, { new: true }).exec();
  }

  /** Includes the normally-hidden `password` field for credential checks. */
  findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();
  }

  /** Includes the normally-hidden `refreshTokenHash` for refresh-token checks. */
  findByIdWithRefreshToken(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+refreshTokenHash').exec();
  }

  async setRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { refreshTokenHash: hash })
      .exec();
  }

  // ─── Password reset (OTP) ─────────────────────────────────────────────────────

  /** Includes the normally-hidden reset-code fields. */
  findByEmailWithResetCode(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+resetCodeHash +resetCodeExpires +resetCodeAttempts')
      .exec();
  }

  async setResetCode(id: string, hash: string, expires: Date): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, {
        resetCodeHash: hash,
        resetCodeExpires: expires,
        resetCodeAttempts: 0,
      })
      .exec();
  }

  async clearResetCode(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, {
        resetCodeHash: null,
        resetCodeExpires: null,
        resetCodeAttempts: 0,
      })
      .exec();
  }

  async incrementResetAttempts(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { $inc: { resetCodeAttempts: 1 } })
      .exec();
  }

  /** Sets a new password, clears the reset code, and revokes existing sessions. */
  async updatePasswordAndClearReset(
    id: string,
    passwordHash: string,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, {
        password: passwordHash,
        resetCodeHash: null,
        resetCodeExpires: null,
        resetCodeAttempts: 0,
        refreshTokenHash: null,
      })
      .exec();
  }
}
