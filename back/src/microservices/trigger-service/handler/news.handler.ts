import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { IActionHandler } from './base.handler';
import { NewsActionService } from '@action-service/news/news.service';

@Injectable()
export class NewsActionHandler implements IActionHandler {
  constructor(private readonly newsService: NewsActionService) {}

  canHandle(actionName: string): boolean {
    return ['check_headline'].includes(actionName);
  }

  async handle(action: ActiveAction, reactions: ActiveReaction[]) {
    await this.newsService.monitorBreakingNews(action, reactions);
  }
}
