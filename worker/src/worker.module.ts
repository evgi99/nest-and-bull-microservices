import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WorkerProcessor } from './worker.processor';
import { NPrimeService } from './calculation/n-prime.service';
import { JobDBModule } from './dbManager/jobs-db.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URL || "mongodb://localhost:27017/jobs",
      }),
    }),
    BullModule.registerQueue({
      name: 'job-queue', // Name of my queue
      redis: {
        // My Redis server configuration
        host: process.env.REDIS_SERVER || 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      },
    }),
    JobDBModule,
  ],
  providers: [WorkerProcessor, NPrimeService],
})
export class WorkerModule {
}
