import { JobStatus } from 'bull';

export class JobBaseDetail {
  jobId: string;
  jobStatus: JobStatus;
  input: number;

  constructor(jobId: string, status: JobStatus, input: number) {
    this.jobId = jobId;
    this.jobStatus = status;
    this.input = input;
  }
}
