import { ActionCronExpression } from '@common/interfaces/cron.interface';

export class CronUtils {
  static parseCronExpression(data: any): ActionCronExpression {
    if (!data?.expression) {
      throw new Error('Invalid cron data: missing expression');
    }
    return {
      patern: data.expression,
    };
  }
}
