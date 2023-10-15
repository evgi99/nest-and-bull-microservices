import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { DatabaseModule } from './mongo-db/database.module';
import { jobsProviders } from './jobs.providers';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'job-queue',
      redis: {
        host: process.env.REDIS_SERVER || 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      },
    }),
  ],

  controllers: [JobsController],
  providers: [JobsService, ...jobsProviders],
})
export class JobsModule {}
