export class ScheduledTaskOutputDTO {
  name: string;
  cronTime: string;
  running: boolean;
  lastExecution?: Date;
  runOnce: boolean;
}
