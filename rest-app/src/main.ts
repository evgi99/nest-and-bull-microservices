import { NestFactory } from '@nestjs/core';
import { JobsModule } from './jobs.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(JobsModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT || 3008);
}
bootstrap();
