import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ActiveReaction } from '@prisma/client';
import { ActionService } from '../action/action.service';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';

@Injectable()
export class GithubActionService {
  private lastCheckTimestamp: number = Date.now();
  private knownBranches: string[] = [];
  private knownPullRequests: string[] = [];

  constructor(private readonly actionService: ActionService) {}

  async getAllPullRequests(
    repositoryOwner: string,
    repositoryName: string,
    token: string,
  ): Promise<any[]> {
    const url = `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/pulls`;
    const pullRequests: any[] = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            per_page: 100,
            page,
            state: 'open',
          },
        });

        pullRequests.push(...response.data);

        if (response.data.length < 100) {
          hasMore = false;
        } else {
          page += 1;
        }
      }
    } catch (error) {
      console.error('Error fetching pull requests from GitHub:', error.message);
    }

    return pullRequests;
  }

  async handleNewPullRequest(
    action: any,
    reaction: ActiveReaction[],
  ): Promise<void> {
    const repositoryOwner = action.data?.repositoryOwner;
    const repositoryName = action.data?.repositoryName;

    const token = process.env.GITHUB_TOKEN_API;
    const newPullRequests: string[] = [];

    try {
      const pullRequests = await this.getAllPullRequests(
        repositoryOwner,
        repositoryName,
        token,
      );

      if (this.knownPullRequests.length === 0) {
        this.knownPullRequests = pullRequests.map((pr) => pr.id.toString());
      }

      for (const pr of pullRequests) {
        if (!this.knownPullRequests.includes(pr.id.toString())) {
          newPullRequests.push(pr.title);
          this.knownPullRequests.push(pr.id.toString());
        }
      }

      if (newPullRequests.length > 0) {
        const ingredients = [
          { field: 'repository_owner', value: repositoryOwner || 'No owner' },
          { field: 'repository_name', value: repositoryName || 'No name' },
          { field: 'trigger_date', value: getTriggerDate() },
        ];
        await this.actionService.executeReactions(ingredients, reaction);
      }
    } catch (error) {
      console.error('Error fetching pull requests from GitHub:', error.message);
    }
  }

  // -------------------------------------------------------------------------------- //

  async handleNewBranch(
    action: any,
    reaction: ActiveReaction[],
  ): Promise<void> {
    const repositoryOwner = action.data?.repositoryOwner;
    const repositoryName = action.data?.repositoryName;

    const url = `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/branches`;
    let page = 1;
    let hasMore = true;
    const token = process.env.GITHUB_TOKEN_API;
    const newBranches: string[] = [];

    try {
      while (hasMore) {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            per_page: 100,
            page,
          },
        });

        if (this.knownBranches.length === 0) {
          this.knownBranches = response.data.map((branch: any) => branch.name);
        } else {
          for (const branch of response.data) {
            if (!this.knownBranches.includes(branch.name)) {
              newBranches.push(branch.name);
            }
          }
        }

        if (response.data.length < 100) {
          hasMore = false;
        } else {
          page += 1;
        }
      }

      if (newBranches.length > 0) {
        this.knownBranches.push(...newBranches);

        const ingredients = [
          { field: 'repository_owner', value: repositoryOwner || 'No owner' },
          { field: 'repository_name', value: repositoryName || 'No name' },
          { field: 'trigger_date', value: getTriggerDate() },
        ];
        await this.actionService.executeReactions(ingredients, reaction);
      }
    } catch (error) {
      console.error('Error fetching branches from GitHub:', error.message);
    }
  }

  // -------------------------------------------------------------------------------- //

  async getAllCommits(
    repositoryOwner: string,
    repositoryName: string,
    token: string,
  ): Promise<any[]> {
    const url = `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/commits`;
    const commits: any[] = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            per_page: 100,
            page,
          },
        });

        commits.push(...response.data);

        if (response.data.length < 100) {
          hasMore = false;
        } else {
          page += 1;
        }
      }
    } catch (error) {
      console.error('Error fetching commits from GitHub:', error.message);
    }

    return commits;
  }

  async handleGithubPush(
    action: any,
    reaction: ActiveReaction[],
  ): Promise<void> {
    const repositoryOwner = action.data?.repositoryOwner;
    const repositoryName = action.data?.repositoryName;

    const token = process.env.GITHUB_TOKEN_API;

    try {
      const commits = await this.getAllCommits(
        repositoryOwner,
        repositoryName,
        token,
      );
      const newCommits = commits.filter((commit: any) => {
        const commitTimestamp = new Date(commit.commit.author.date).getTime();
        return commitTimestamp > this.lastCheckTimestamp;
      });

      if (newCommits.length > 0) {
        this.lastCheckTimestamp = Date.now();

        const ingredients = [
          { field: 'repository_owner', value: repositoryOwner || 'No owner' },
          { field: 'repository_name', value: repositoryName || 'No name' },
          { field: 'trigger_date', value: getTriggerDate() },
        ];

        await this.actionService.executeReactions(ingredients, reaction);
      }
    } catch (error) {
      console.error('Error fetching commits from GitHub:', error.message);
    }
  }
}
