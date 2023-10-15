import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobDetails } from 'src/dbManager/schemas/job.schema';

@Injectable()
export class JobDBService {
  constructor(
    @InjectModel(JobDetails.name) private jobDetailsModel: Model<JobDetails>,
  ) {}

  async updateFinishedJobResult(jobid: string, result: number) {
    const job = await this.jobDetailsModel.updateOne(
      { jobId: jobid },
      { jobStatus: 'completed', result: result },
    );
    return job;
  }

  async updateJobStatusResult(jobid: string, jobStatus: string) {
    const job = await this.jobDetailsModel.updateOne(
      { jobId: jobid },
      { jobStatus: jobStatus },
      { upsert: true }
    );
    return job;
  }

  async getMaxPrimeBelowNthResult(
    nth: number,
  ): Promise<{ input: number; result: number }> {
    const job = await this.jobDetailsModel
      .findOne(
        { jobStatus: 'completed', input: { $lte: nth } },
        { input: 1, result: 1 },
      )
      .sort({ input: -1 })
      .limit(1);
    if (job) {
      return { input: job.input, result: job.result };
    }
    return;
  }
}
