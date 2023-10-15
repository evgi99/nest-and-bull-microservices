import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnGlobalQueueFailed,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { NPrimeService } from './calculation/n-prime.service';
import { JobDBService } from './dbManager/jobs-db.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Logger } from '@nestjs/common';
import { newJobDTO } from './dto/new-job.dto';

const CANCELED_MESSAGE = 'job canceled by user';
const NUMBER_OF_PROCESSORS = process.env.NUMBER_OF_PROCESSORS || '1';

@Processor('job-queue')
export class WorkerProcessor {
  logger;
  constructor(
    private readonly nPrimeService: NPrimeService,
    private jobDBService: JobDBService,
    @InjectQueue('job-queue') private readonly jobsQueue: Queue,
  ) {
    this.logger = new Logger(WorkerProcessor.name);
  }

  @Process({
    name: 'calculate-job',
    concurrency: parseInt(NUMBER_OF_PROCESSORS),
  })
  async handleJob(job: Job<newJobDTO>) {
    try {
      this.logger.log(
        `Starting handling job ${job.id} of calculate prime number at ${job.data['Nth']}`,
      );
      const result = this.nPrimeService.getNprime(job.data.Nth, job);
      return result;
    } catch (e) {
      this.logger.error(`error in handling job: ${e.message}`);
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`Complete handling job ${job.id} with result ${result}`);
    if (result != -1) {
      await this.jobDBService.updateFinishedJobResult(
        job.id.toString(),
        result,
      );
    }
  }

  @OnQueueFailed()
  async handlerFailedJob(job: string, err: string) {
    try {
      if (err === CANCELED_MESSAGE) {
        await this.jobDBService.updateJobStatusResult(job, 'cancelled');
      } else {
        await this.jobDBService.updateJobStatusResult(job, 'failed');
      }
      throw new Error(`Failed job ${job} of Error: ${err}`);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  @OnQueueError()
  handler(error: Error) {
    this.logger.log('Error in queue process: ' + error);
  }

  @OnGlobalQueueFailed()
  async onGlobalFailedhandler(job: string) {
    const runingJob = await this.jobsQueue.getJob(job);
    await runingJob.discard();
    this.handlerFailedJob(job, runingJob.failedReason);
  }

  @OnQueueActive()
  async onActive(job: Job<newJobDTO>) {
    this.logger.log(
      `Start processing id=${job.id}, jobData=${JSON.stringify(job.data)}`,
    );
    await this.jobDBService.updateJobStatusResult(job.id.toString(),'active');
  }
}
