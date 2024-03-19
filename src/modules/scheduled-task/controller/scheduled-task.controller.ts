import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScheduledTaskService } from '../service/scheduled-task.service';
import { ScheduledTaskDTO } from '../model/vo/scheduled-task.vo';

@Controller('scheduled-task')
export class ScheduledTaskController {
  constructor(private scheduledTaskService: ScheduledTaskService) {}

  @Get('list')
  async list(): Promise<Array<ScheduledTaskDTO>> {
    return await this.scheduledTaskService.list();
  }

  @Post('switch')
  async switch(@Body('name') name: string): Promise<void> {
    await this.scheduledTaskService.switch(name);
  }
}
