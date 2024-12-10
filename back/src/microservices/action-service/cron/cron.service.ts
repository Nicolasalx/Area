import { Injectable } from '@nestjs/common';
import { ActionService } from '../action/action.service';
import { ActiveAction } from '@prisma/client';

interface DailyCronData {
  hour: string;
}

interface WeeklyCronData {
  hour: string;
  day: string;
}

interface DateData {
  date: string;
  hour: string;
}

@Injectable()
export class CronService {
  constructor(private readonly actionService: ActionService) {}
  // Cron day at X hour
  // Ex: Every day at 10 hour
  async handleDailyCronAction(action: ActiveAction): Promise<void> {
    const data = action.data as unknown as DailyCronData;

    console.log('------ DAILY CRON ------');
    console.log('HOUR: ', data.hour);

    // When the cron is triggered call this function:
    // await this.actionService.executeReactions(reaction);
  }

  // Cron every day of the week at X hour
  // Ex: Monday at 10h
  async handleWeeklyCronAction(action: ActiveAction): Promise<void> {
    const data = action.data as unknown as WeeklyCronData;

    console.log('------ WEEKLY CRON ------');
    console.log('HOUR: ', data.hour);
    console.log('DAY: ', data.day);

    // When the cron is triggered call this function:
    // await this.actionService.executeReactions(reaction);
  }

  // Timer at X hour
  // Ex: 10/12/2024 at 10 hour
  async handleTimerAction(action: ActiveAction): Promise<void> {
    const data = action.data as unknown as DateData;

    console.log('------ TIMER ACTION ------');
    console.log('HOUR: ', data.hour);
    console.log('DATE: ', data.date);

    // When the timer is triggered call this function:
    //await this.actionService.executeReactions(reaction);
  }
}
