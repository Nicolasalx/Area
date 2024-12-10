// import { Injectable } from '@nestjs/common';
// import { ActionService } from '../action/action.service';
// import { ActiveAction, ActiveReaction } from '@prisma/client';

// interface DailyCronData {
//   hour: string;
// }

// interface WeeklyCronData {
//   hour: string;
//   day: string;
// }

// interface DateData {
//   date: string;
//   hour: string;
//   isScheduled?: boolean;
// }

// @Injectable()
// export class CronService {
//   constructor(private readonly actionService: ActionService) { }
//   // Cron day at X hour
//   // Ex: Every day at 10 hour
//   async handleDailyCronAction(
//     action: ActiveAction,
//     reaction: ActiveReaction[],
//   ): Promise<void> {
//     const data = action.data as unknown as DailyCronData;

//     console.log('------ DAILY CRON ------');
//     console.log('HOUR: ', data.hour);

//     // When the cron is triggered call this function:
//     // await this.actionService.executeReactions(reaction);
//   }

//   // Cron every day of the week at X hour
//   // Ex: Monday at 10h
//   async handleWeeklyCronAction(
//     action: ActiveAction,
//     reaction: ActiveReaction[],
//   ): Promise<void> {
//     const data = action.data as unknown as WeeklyCronData;

//     console.log('------ WEEKLY CRON ------');
//     console.log('HOUR: ', data.hour);
//     console.log('DAY: ', data.day);

//     // When the cron is triggered call this function:
//     // await this.actionService.executeReactions(reaction);
//   }

//   // Timer at X hour
//   // Ex: 10/12/2024 at 10 hour
//   async handleTimerAction(
//     action: ActiveAction,
//     reaction: ActiveReaction[],
//   ): Promise<void> {
//     const data = action.data as unknown as DateData;
//     const now = new Date();
//     const targetDate = new Date(`${data.date}T${data.hour}:00`);

//     if (now.getTime() >= targetDate.getTime()) {
//       console.log('Timer triggered - executing reactions');
//       await this.actionService.executeReactions(reaction);

//       try {
//         await this.actionService.prisma.activeAction.update({
//           where: { id: action.id },
//           data: { isActive: false }
//         });
//       } catch (error) {
//         console.error('Failed to deactivate timer action:', error);
//       }
//     } else {
//       console.log('Timer not yet triggered - waiting for target date/time');
//     }
//   }
// }
