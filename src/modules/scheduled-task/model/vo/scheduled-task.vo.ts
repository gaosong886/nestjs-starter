import { Expose } from 'class-transformer';

export class ScheduledTaskDTO {
  @Expose()
  name: string;

  @Expose()
  cronTime: string;

  @Expose()
  running: boolean;

  @Expose()
  lastExecution?: Date;

  @Expose()
  runOnce: boolean;
}
