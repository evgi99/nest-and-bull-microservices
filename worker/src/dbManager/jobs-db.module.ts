import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobDetailsSchema } from './schemas/job.schema';
import { JobDBService } from './jobs-db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'JobDetails', schema: JobDetailsSchema },
    ]),
  ],
  providers: [JobDBService],
  exports: [JobDBService],
})
export class JobDBModule {}
