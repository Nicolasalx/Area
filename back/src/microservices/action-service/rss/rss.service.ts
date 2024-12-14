import { Injectable, Logger } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { ActionService } from '../action/action.service';
import { RssUtils } from '@common/utils/rss.utils';
import * as RssParser from 'rss-parser'; // Changed import style

@Injectable()
export class RssService {
  private readonly logger = new Logger(RssService.name);
  private readonly parser: RssParser;
  private lastCheckTimestamp = Date.now();

  constructor(private readonly actionService: ActionService) {
    this.parser = new RssParser();
  }

  async handleRssFeed(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    const data = RssUtils.parseRssAction(action.data);

    try {
      const feed = await this.parser.parseURL(data.feedUrl);

      if (!feed.items?.length) {
        this.logger.debug('No items found in feed');
        return;
      }

      let newItemDetected = false;

      for (const item of feed.items) {
        const itemDate = new Date(item.pubDate || item.isoDate).getTime();

        if (itemDate > this.lastCheckTimestamp) {
          newItemDetected = true;
          this.logger.log(`New RSS item detected: ${item.title}`);
          await this.actionService.executeReactions(reaction);
          break;
        }
      }

      if (newItemDetected) {
        this.lastCheckTimestamp = Date.now();
      }
    } catch (error) {
      this.logger.error(
        `Error checking RSS feed for action ${action.id} with feed URL ${data.feedUrl}:`,
        error,
      );
    }
  }
}
