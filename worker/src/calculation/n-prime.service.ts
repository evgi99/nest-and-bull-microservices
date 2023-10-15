import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { JobDBService } from 'src/dbManager/jobs-db.service';

@Injectable()
export class NPrimeService {
  constructor(private jobDBService: JobDBService) {}

  async getNprime(nth: number, job: Job<unknown>): Promise<number> {
    const referenceJob = await this.jobDBService.getMaxPrimeBelowNthResult(nth);
    const iterationStartingPoint = { startIndex: 2, primeAtStartIndex: 3 };
    if (referenceJob) {
      iterationStartingPoint.startIndex = referenceJob.input;
      iterationStartingPoint.primeAtStartIndex = referenceJob.result;
    }
    return this.getTheNthPrimeNumber(job, nth, iterationStartingPoint);
  }

  private async getTheNthPrimeNumber(
    job: Job<unknown>,
    Nth: number,
    iterationStartingPoint: { startIndex: number; primeAtStartIndex: number },
  ): Promise<number> {
    if (Nth === 1) {
      return 2;
    } else {
      const { startIndex, primeAtStartIndex } = iterationStartingPoint;
      let current_num = primeAtStartIndex;
      for (let i = startIndex; i <= Nth; i++) {
        const isFailed = await job.isFailed();
        if (isFailed) {
          return -1;
        }
        while (!this.isPrime(current_num)) {
          current_num += 2;
        }
        current_num += 2;
      }
      return current_num - 2;
    }
  }

  private isPrime(n: number): boolean {
    const sqrt = Math.sqrt(n);
    for (let i = 2; i <= sqrt; i++) {
      if (n % i == 0) {
        return false;
      }
    }
    return true;
  }
}
