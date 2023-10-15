import { IsUUID } from 'class-validator';

export class jobIdbDTO {
  @IsUUID(4)
  jobId: string;
}