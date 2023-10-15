import { Connection } from 'mongoose';
import { JobDetailsSchema } from './schemas/job.schema';

export const jobsProviders = [
  {
    provide: 'JOBS_MODEL',
    useFactory: (connection: Connection) => connection.model('JobDetails', JobDetailsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];