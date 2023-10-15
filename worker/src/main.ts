import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_SERVER || 'localhost',
      port: process.env.REDIS_PORT,
    },
  });
  await app.listen()
  let logger = new Logger('Main')
  logger.log(`Microservice is listening`);
}
bootstrap();