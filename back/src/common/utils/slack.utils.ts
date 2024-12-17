import { SlackActionData } from '@common/interfaces/slack.interface';

export class SlackUtils {
  public static parseSlackData(data: unknown): SlackActionData {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid Slack data: must be an object');
    }
    const payload = data as Record<string, unknown>;

    if (!payload.channelName && !payload.username) {
      throw new Error('Invalid Slack data: missing channelName or username');
    }

    if (payload.channelName && typeof payload.channelName !== 'string') {
      throw new Error('Invalid Slack data: channelName must be a string');
    }

    if (payload.username && typeof payload.username !== 'string') {
      throw new Error('Invalid Slack data: username must be a string');
    }
    return {
      channelName: payload.channelName as string,
      username: payload.username as string,
    };
  }
}
