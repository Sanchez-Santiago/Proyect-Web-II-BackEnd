import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import 'reflect-metadata';
import { AppModule } from './app.module';
import 'dotenv/config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '25mb' }));
  app.use(urlencoded({ extended: true, limit: '25mb' }));
  app.useGlobalPipes(new ZodValidationPipe());

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:8000', 'http://127.0.0.1:8000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port http://localhost:${port}`);
}

bootstrap();
