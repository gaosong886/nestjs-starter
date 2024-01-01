import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScheduledTaskService } from '../services/scheduled-task.service';
import { ScheduledTaskOutputDTO } from '../dtos/scheduled-task-output.dto';

@Controller('scheduled-task')
export class ScheduledTaskController {
  constructor(private scheduledTaskService: ScheduledTaskService) {}

  @Get('list')
  async list(): Promise<Array<ScheduledTaskOutputDTO>> {
    return await this.scheduledTaskService.list();
  }

  @Post('switch')
  async switch(@Body('name') name: string): Promise<void> {
    await this.scheduledTaskService.switch(name);
  }
}
