import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { JobStatus } from 'bull';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class JobDetails extends Document {
  @Prop({
    unique: true,
  })
  jobId: string;

  @Prop()
  jobStatus: JobStatus;

  @Prop()
  input: number;

  @Prop()
  result: number;
}

export const JobDetailsSchema = SchemaFactory.createForClass(JobDetails);
