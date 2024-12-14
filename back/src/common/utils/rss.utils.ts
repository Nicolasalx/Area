import { RssAction } from '@common/interfaces/rss.interface';

export class RssUtils {
  static parseRssAction(data: any): RssAction {
    if (!data?.feedUrl) {
      throw new Error('Invalid rss data: missing feedUrl');
    }
    return {
      feedUrl: data.feedUrl,
    };
  }
}
