import { JobStatus } from "bull";
import { IsNotEmpty, IsOptional } from "class-validator";

export class jobStateResponseDTO {
    @IsNotEmpty()
    jobId: string;

    @IsNotEmpty()
    jobStatus: MyJobStatus;
    
    @IsOptional()
    returnValue?: returnValueDto;

    constructor(jobId:string, jobStatus: MyJobStatus){
        this.jobId = jobId
        this.jobStatus = jobStatus;
    }
  }

export type MyJobStatus = JobStatus | 'cancelled';

export interface returnValueDto {
    nth: number;
    returnValue: number;
}