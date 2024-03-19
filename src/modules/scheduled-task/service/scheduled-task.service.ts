import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { ScheduledTaskDTO as ScheduledTaskVO } from '../model/vo/scheduled-task.vo';

@Injectable()
export class ScheduledTaskService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  /**
   *  列表查询
   *
   */
  async list(): Promise<Array<ScheduledTaskVO>> {
    const jobs = this.schedulerRegistry.getCronJobs();
    const result: ScheduledTaskVO[] = [];
    jobs.forEach((value, key) => {
      const vo = new ScheduledTaskVO();
      vo.name = key;
      vo.cronTime = value.cronTime.toString();
      vo.lastExecution = value.lastExecution ? value.lastExecution : undefined;
      vo.runOnce = value.runOnce;
      vo.running = value.running;
      result.push(vo);
    });
    return result;
  }

  /**
   *  开启/暂停
   *
   */
  async switch(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    if (job.running) job.stop();
    else job.start();
  }

  /**
   *  定时任务 Demo
   *
   */
  @Cron('0 * * * * *', {
    name: 'Demo',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
  async demo() {}
}
