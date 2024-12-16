import { Injectable, Logger } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { RssActionService } from '@action-service/rss/rss.service';
import { IActionHandler } from './base.handler';

@Injectable()
export class RssActionHandler implements IActionHandler {
  private readonly logger = new Logger(RssActionHandler.name);

  constructor(private readonly rssService: RssActionService) {}

  canHandle(action: string): boolean {
    return ['rss_feed'].includes(action);
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    try {
      await this.rssService.handleRssFeed(action, reactions);
    } catch (error) {
      this.logger.error(`Failed to handle RSS action: ${error.message}`);
    }
  }
}
