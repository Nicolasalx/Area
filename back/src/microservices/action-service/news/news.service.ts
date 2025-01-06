import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { ActionService } from '../action/action.service';
import axios from 'axios';

@Injectable()
export class NewsActionService {
  private readonly apiKey = process.env.NEWS_API_TOKEN;
  private seenHeadlines = new Set<string>();

  constructor(private readonly actionService: ActionService) {}

  async monitorBreakingNews(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${this.apiKey}`,
      );

      const headlines = response.data.articles;

      for (const article of headlines) {
        if (this.seenHeadlines.has(article.title)) continue;

        const ingredients = [
          { field: 'headline', value: article.title },
          { field: 'source', value: article.source.name },
          { field: 'news_url', value: article.url },
          { field: 'news_description', value: article.description || '' },
        ];

        await this.actionService.executeReactions(ingredients, reactions);
        this.seenHeadlines.add(article.title);
      }

      setTimeout(
        () => {
          this.seenHeadlines.clear();
        },
        24 * 60 * 60 * 1000,
      );
    } catch (error) {
      console.error('Error monitoring breaking news:', error);
    }
  }
}
