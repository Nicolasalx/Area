import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { TimerActionService } from '@action-service/timer/timer.service';
import { CronActionService } from '@action-service/cron/cron.service';
import { IActionHandler } from '@trigger-service/handler/base.handler';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TimerUtils } from '@common/utils/timer.utils';
import { CronUtils } from '@common/utils/cron.utils';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerActionHandler implements IActionHandler {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly timerService: TimerActionService,
    private readonly cronService: CronActionService,
  ) {}

  canHandle(action: string): boolean {
    return ['timer_action', 'cron_action'].includes(action);
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    switch (action.name) {
      case 'timer_action':
        await this.registerTimerAction(action, reactions);
        break;
      case 'cron_action':
        await this.registerCronAction(action, reactions);
        break;
    }
  }

  private async registerTimerAction(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ) {
    if (!action.data) {
      console.error('Invalid action data:', action);
      return;
    }

    const actionDate = TimerUtils.parseActionDate(action.data);
    const targetDate = TimerUtils.createTargetDate(actionDate);
    const jobId = `timer_${action.id}`;

    const executeReaction = async () => {
      try {
        await this.timerService.handleTimerAction(action, reactions);
      } finally {
        try {
          if (this.schedulerRegistry.doesExist('timeout', jobId)) {
            this.schedulerRegistry.deleteTimeout(jobId);
          }
        } catch (error) {
          console.warn(`Failed to delete timeout ${jobId}: ${error.message}`);
        }
      }
    };

    const timeout = targetDate.getTime() - new Date().getTime();
    if (timeout > 0) {
      const timeoutRef = setTimeout(executeReaction, timeout);
      try {
        this.schedulerRegistry.addTimeout(jobId, timeoutRef);
        console.log(`Scheduled timer ${jobId} for ${targetDate}`);
      } catch (error) {
        clearTimeout(timeoutRef);
        console.error(`Failed to schedule timer ${jobId}: ${error.message}`);
      }
    } else {
      console.error(`Invalid date ${jobId}: target date is in the past`);
    }
  }
  private async registerCronAction(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ) {
    if (!action.data) {
      console.error('Invalid cron action data:', action);
      return;
    }

    const cronData = CronUtils.parseCronExpression(action.data);
    const jobId = `cron_${action.id}`;

    this.cleanupJob(action.id);

    try {
      const job = new CronJob(
        cronData.patern,
        async () => {
          try {
            await this.cronService.handleCronAction(reactions);
          } catch (error) {
            console.error(`Error executing cron action ${jobId}: ${error}`);
          }
        },
        null,
        true,
      );

      this.schedulerRegistry.addCronJob(jobId, job);
      console.log(
        `Scheduled cron job ${jobId} with pattern ${cronData.patern}`,
      );
    } catch (error) {
      console.error(`Failed to schedule cron job ${jobId}: ${error.message}`);
      if (this.schedulerRegistry.doesExist('cron', jobId)) {
        this.schedulerRegistry.deleteCronJob(jobId);
      }
    }
  }

  public cleanupJob(actionId: string) {
    const cronJobId = `cron_${actionId}`;
    const timerJobId = `timer_${actionId}`;

    try {
      if (this.schedulerRegistry.doesExist('cron', cronJobId)) {
        const job = this.schedulerRegistry.getCronJob(cronJobId);
        job.stop();
        this.schedulerRegistry.deleteCronJob(cronJobId);
        console.log(`Cleaned up cron job ${cronJobId}`);
      }
    } catch (error) {
      console.warn(`Failed to cleanup cron job ${cronJobId}: ${error.message}`);
    }

    try {
      if (this.schedulerRegistry.doesExist('timeout', timerJobId)) {
        this.schedulerRegistry.deleteTimeout(timerJobId);
        console.log(`Cleaned up timer job ${timerJobId}`);
      }
    } catch (error) {
      console.warn(
        `Failed to cleanup timer job ${timerJobId}: ${error.message}`,
      );
    }
  }
}
