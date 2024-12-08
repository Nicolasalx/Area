import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { ActionService } from '../action/action.service';

interface GithubActionData {
  repositoryOwner: string;
  repositoryName: string;
}

@Injectable()
export class GithubService {
  private lastCheckTimestamp: number = Date.now();

  constructor(private readonly actionService: ActionService) {}

  async handleGithubPush(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    const data = action.data as unknown as GithubActionData;

    const apiUrl = `https://api.github.com/repos/${data.repositoryOwner}/${data.repositoryName}/events`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN_API}`,
        },
      });

      const pushEvents = response.data.filter(
        (event: any) => event.type === 'PushEvent',
      );

      if (pushEvents.length > 0) {
        let eventDetected = false;

        for (const event of pushEvents) {
          const eventTimestamp = new Date(event.created_at).getTime();

          if (eventTimestamp > this.lastCheckTimestamp) {
            eventDetected = true;

            await this.actionService.executeReactions(reaction);
          }
        }

        if (eventDetected) {
          this.lastCheckTimestamp = Date.now();
        }
      }
    } catch (_) {
      console.error();
    }
  }
}
