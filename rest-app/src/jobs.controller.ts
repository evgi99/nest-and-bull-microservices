import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { newJobDTO } from './dto/new-job.dto';
import { LogRequestInterceptor } from 'infra/logrequest.interceptor';
import { JobsService } from './jobs.service';
import {
  BAD_REQUEST_CANCELED_MESSAGE,
  NOTIFY_CANCELED_MESSAGE_SENT_TEMPLATE,
} from './jobs.constant';
import { jobIdbDTO } from './dto/job-id.dto';
import { AdminOnlyGuard } from './auth/admin-only.guard';

@Controller('/jobs')
@UseInterceptors(LogRequestInterceptor)
export class JobsController {
  constructor(private readonly appService: JobsService) {}

  @Post()
  async enQueue(@Body() body: newJobDTO): Promise<{ jobId: string }> {
    return this.appService.addToQueue(body);
  }

  @Get('/:jobId')
  async getJobInfo(@Param() { jobId }: jobIdbDTO) {
    const jobObj = await this.appService.getJob(jobId);
    if (jobObj) {
      return this.appService.getJobState(jobId);
    }

    return new NotFoundException(`job with id ${jobId} does not exist`);
  }

  @Delete('/:jobId')
  async cancelJob(@Param() { jobId }: jobIdbDTO) {
    console.log(jobId)
    const jobObj = await this.appService.getJob(jobId);
    if (jobObj) {
      const isSuccess = await this.appService.cancelJob(jobId)
      if (isSuccess) {
        return { messge: NOTIFY_CANCELED_MESSAGE_SENT_TEMPLATE(jobId) };
      } else {
        return new BadRequestException(BAD_REQUEST_CANCELED_MESSAGE);
      }
    }
    return new NotFoundException(`Job with id ${jobId} does not exist`);
  }

  @Get('')
  @UseGuards(AdminOnlyGuard)
  async getAllJobs() {
    // This route will only be accessible if the request includes a valid header
    return this.appService.getAllJobs();
  }
}
