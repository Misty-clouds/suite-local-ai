import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://suite.cloudstech.org',
      'https://app.suite.cloudstech.org',
      'https://cp.suite.cloudstech.org',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
