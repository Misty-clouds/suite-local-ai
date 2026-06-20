import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

/**
 * On hosts without a writable key file (pxxl, Railway, Render…), supply the GCP
 * service-account JSON via the GOOGLE_CREDENTIALS_JSON env var. We materialise
 * it to a temp file and point GOOGLE_APPLICATION_CREDENTIALS at it so the
 * (optional, disclosed) BigQuery SDK picks it up automatically. AI inference
 * does not run here — it is on-device via the QVAC SDK in the desktop app.
 */
function ensureGoogleCreds(): void {
  const json = process.env.GOOGLE_CREDENTIALS_JSON;
  if (json && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const path = join(tmpdir(), 'gcp-key.json');
    writeFileSync(path, json, { mode: 0o600 });
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path;
  }
}

async function bootstrap() {
  ensureGoogleCreds();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Allow base64 document uploads (default JSON limit is 100kb).
  app.useBodyParser('json', { limit: '6mb' });
  app.useBodyParser('urlencoded', { limit: '6mb', extended: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Allowed origins: built-in defaults + any in CORS_ORIGINS (comma-separated)
  // + any *.vercel.app deployment (so Vercel preview/prod URLs just work).
  const allowList = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://suite.cloudstech.org',
    'https://app.suite.cloudstech.org',
    'https://cp.suite.cloudstech.org',
    ...(process.env.CORS_ORIGINS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? []),
  ];
  app.enableCors({
    origin: (origin, cb) => {
      // Non-browser clients (curl, server-to-server) send no Origin.
      if (!origin) return cb(null, true);
      let host = '';
      try {
        host = new URL(origin).hostname;
      } catch {
        return cb(new Error('Bad origin'));
      }
      if (allowList.includes(origin) || host.endsWith('.vercel.app')) {
        return cb(null, true);
      }
      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5050);
}
void bootstrap();
