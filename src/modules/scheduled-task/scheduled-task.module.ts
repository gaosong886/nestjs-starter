import { Module } from '@nestjs/common';
import { ScheduledTaskController } from './controllers/scheduled-task.controller';
import { ScheduledTaskService } from './services/scheduled-task.service';

@Module({
  controllers: [ScheduledTaskController],
  providers: [ScheduledTaskService],
})
export class ScheduledTaskModule {}
