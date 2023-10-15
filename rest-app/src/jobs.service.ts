import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JobStatus, Queue } from 'bull';
import { newJobDTO } from './dto/new-job.dto';
import { jobStateResponseDTO } from './dto/job-state.response.dto';
import { CANCELED_MESSAGE } from './jobs.constant';
import { JobDetails } from './schemas/job.schema';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { JobBaseDetail } from './entities/jobDetails.entity';

@Injectable()
export class JobsService {
  logger;

  constructor(
    @InjectQueue('job-queue') private readonly jobsQueue: Queue,
    @Inject('JOBS_MODEL') private readonly jobModel: Model<JobDetails>,
  ) {
    this.logger = new Logger(JobsService.name);
  }

  async addToQueue(body: newJobDTO): Promise<{ jobId: string }> {
    const { Nth } = body;
    this.logger.log(`Add job to Queue - calculate prime at ${Nth}`);
    const job = await this.jobsQueue.add(
      'calculate-job',
      {
        Nth: Nth,
      },
      {
        jobId: this.generateJobIdWithUUID(),
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );
    await this.jobModel.create(
      new JobBaseDetail(job.id.toString(), 'waiting', Nth),
    );
    return { jobId: job.id.toString() };
  }

  async getJob(jobId: string) {
    return this.jobsQueue.getJob(jobId);
  }

  async getJobState(jobId: string): Promise<Partial<jobStateResponseDTO>> {
    const jobObj = await this.jobModel.findOne(
      { jobId: jobId },
      { jobStatus: 1, input: 1, result: 1 },
    );

    const statusObj = new jobStateResponseDTO(
      jobId,
      jobObj.jobStatus as JobStatus,
    );
    if (jobObj.jobStatus === 'completed') {
      statusObj.returnValue = {
        nth: jobObj.input,
        returnValue: jobObj.result,
      };
    }
    return statusObj;
  }

  async cancelJob(jobId: string): Promise<boolean> {
    const jobObj = await this.getJob(jobId);
    const jobStatus = await jobObj.getState();
    if (jobStatus === 'active' || jobStatus === 'waiting') {
      await jobObj.moveToFailed({ message: CANCELED_MESSAGE }, true);
      if (jobStatus === 'waiting') {
        await jobObj.remove();
      }
      return true;
    } else {
      return false;
    }
  }

  async getAllJobs() {
    const allJobs = await this.jobModel.find(
      {},
      { jobId: 1, jobStatus: 1, input: 1, result: 1 },
    );
    return allJobs;
  }

  private generateJobIdWithUUID(): string {
    return uuid();
  }
}
