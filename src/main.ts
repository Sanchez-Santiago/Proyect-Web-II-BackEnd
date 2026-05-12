import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import 'reflect-metadata';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ZodValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port http://localhost:${port}`);
}

bootstrap();
