export const CANCELED_MESSAGE = 'job canceled by user';
export const BAD_REQUEST_CANCELED_MESSAGE =
  'Job cancelation is possible only when the job is ACTIVE or in a WAITING state';
export const NOTIFY_CANCELED_MESSAGE_SENT_TEMPLATE = (value) =>
  `Request to cancel job with id ${value} been sent succesfuly`;
export const NOTIFY_NOT_FOUND_JOB_TEMPLATE = (value) =>
`job with id ${value} does not exist`;
