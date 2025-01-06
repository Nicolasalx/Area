import { ActionCronExpression } from '@common/interfaces/cron.interface';

export class CronUtils {
  static parseCronExpression(data: any): ActionCronExpression {
    if (!data?.expression) {
      throw new Error('Invalid cron data: missing expression');
    }
    let expression = '';
    switch (data.expression) {
      case '5 sec':
        expression = '*/5 * * * * *';
        break;
      case '1 min':
        expression = '*/1 * * * *';
        break;
      case '2 min':
        expression = '*/2 * * * *';
        break;
      case '3 min':
        expression = '*/3 * * * *';
        break;
      case '5 min':
        expression = '*/5 * * * *';
        break;
      case '15 min':
        expression = '*/15 * * * *';
        break;
      case '30 min':
        expression = '*/30 * * * *';
        break;
      case '1 hour':
        expression = '0 */1 * * *';
        break;
      case '1 day':
        expression = '0 0 * * *';
        break;
      default:
        throw new Error(
          `Invalid cron data: unrecognized expression "${data.expression}"`,
        );
    }
    return {
      patern: expression,
    };
  }
}
