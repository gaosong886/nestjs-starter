import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { ScheduledTaskOutputDTO } from '../dtos/scheduled-task-output.dto';

@Injectable()
export class ScheduledTaskService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  async list(): Promise<Array<ScheduledTaskOutputDTO>> {
    const jobs = this.schedulerRegistry.getCronJobs();
    const result: ScheduledTaskOutputDTO[] = [];
    jobs.forEach((value, key) => {
      const dto = new ScheduledTaskOutputDTO();
      dto.name = key;
      dto.cronTime = value.cronTime.toString();
      dto.lastExecution = value.lastExecution ? value.lastExecution : undefined;
      dto.runOnce = value.runOnce;
      dto.running = value.running;
      result.push(dto);
    });
    return result;
  }

  async switch(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    if (job.running) job.stop();
    else job.start();
  }

  @Cron('0 * * * * *', {
    name: 'Demo',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
  async demo() {}
}
