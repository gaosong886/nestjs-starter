import { Module } from '@nestjs/common';
import { ScheduledTaskController } from './controller/scheduled-task.controller';
import { ScheduledTaskService } from './service/scheduled-task.service';

@Module({
  controllers: [ScheduledTaskController],
  providers: [ScheduledTaskService],
})
export class ScheduledTaskModule {}
