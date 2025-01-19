import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { ActionService } from '../action/action.service';
import { SlackUtils } from '@common/utils/slack.utils';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';

@Injectable()
export class SlackActionService {
  private webClient: WebClient;
  private lastCheckTimestamp: number = Date.now();
  private isInit = false;

  constructor(private readonly actionService: ActionService) {
  }

  private async joinChannel(channelName: string): Promise<string | null> {
    try {
      const channelId = await this.getChannelIdByName(channelName);
      if (!channelId) {
        throw new Error(`Channel #${channelName} not found`);
      }

      const channelInfo = await this.webClient.conversations.info({
        channel: channelId,
      });

      if (!channelInfo.channel?.is_member) {
        await this.webClient.conversations.join({ channel: channelId });
      }

      return channelId;
    } catch (error) {
      console.error('Error joining channel:', error);
      return null;
    }
  }

  private async getUserIdFromUsername(
    username: string,
  ): Promise<string | null> {
    try {
      const result = await this.webClient.users.list({});
      const user = result.members?.find(
        (member) => member.name === username || member.real_name === username,
      );
      return user?.id || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  private async getChannelIdByName(
    channelName: string,
  ): Promise<string | null> {
    try {
      const result = await this.webClient.conversations.list({
        types: 'public_channel,private_channel',
      });

      const channel = result.channels?.find(
        (channel: any) => channel.name === channelName,
      );
      return channel?.id || null;
    } catch (error) {
      console.error('Error getting channel ID:', error);
      return null;
    }
  }

  async checkNewMessage(
    action: ActiveAction,
    reaction: ActiveReaction[],
    refreshToken: string,
  ): Promise<void> {
    try {
      if (!this.isInit) {
        this.webClient = new WebClient(refreshToken);
        this.isInit = true;
      }
      const { channelName } = SlackUtils.parseSlackData(action.data);
      if (!channelName) {
        throw new Error('Channel name is required');
      }

      const channelId = await this.joinChannel(channelName);
      if (!channelId) {
        throw new Error(`Failed to join channel #${channelName}`);
      }

      const result = await this.webClient.conversations.history({
        channel: channelId,
        oldest: (this.lastCheckTimestamp / 1000).toString(),
      });

      if (result?.messages?.length > 0) {
        console.log(`New Slack messages detected in channel #${channelName}`);
        const ingredients = [
          { field: 'trigger_date', value: getTriggerDate() },
        ];
        await this.actionService.executeReactions(ingredients, reaction);
        this.lastCheckTimestamp = Date.now();
      }
    } catch (error) {
      console.error('Error checking Slack messages:', error);
    }
  }

  async checkMentions(
    action: ActiveAction,
    reaction: ActiveReaction[],
    refreshToken: string,
  ): Promise<void> {
    try {
      if (!this.isInit) {
        this.webClient = new WebClient(refreshToken);
        this.isInit = true;
      }
      const { channelName, username } = SlackUtils.parseSlackData(action.data);
      if (!channelName || !username) {
        throw new Error('Channel name and username are required');
      }

      const channelId = await this.joinChannel(channelName);
      if (!channelId) {
        throw new Error(`Failed to join channel #${channelName}`);
      }

      const userId = await this.getUserIdFromUsername(username);
      if (!userId) {
        throw new Error(`User @${username} not found`);
      }

      const messages = await this.webClient.conversations.history({
        channel: channelId,
        oldest: (this.lastCheckTimestamp / 1000).toString(),
      });

      if (!messages?.messages) return;

      const mentions = messages.messages.filter(
        (msg) =>
          msg?.text?.includes(`<@${userId}>`) ||
          msg?.text?.toLowerCase().includes(`@${username.toLowerCase()}`),
      );

      if (mentions.length > 0) {
        console.log(
          `New mentions detected for @${username} in #${channelName}`,
        );
        const ingredients = [
          { field: 'trigger_date', value: getTriggerDate() },
        ];
        await this.actionService.executeReactions(ingredients, reaction);
        this.lastCheckTimestamp = Date.now();
      }
    } catch (error) {
      console.error('Error checking Slack mentions:', error);
    }
  }

  async checkReaction(
    action: ActiveAction,
    reaction: ActiveReaction[],
    refreshToken: string,
  ): Promise<void> {
    try {
      if (!this.isInit) {
        this.webClient = new WebClient(refreshToken);
        this.isInit = true;
      }
      const { channelName, reaction: emojiToCheck } = SlackUtils.parseSlackData(
        action.data,
      );
      if (!channelName || !emojiToCheck) {
        throw new Error('Channel name and reaction are required');
      }

      const channelId = await this.joinChannel(channelName);
      if (!channelId) {
        throw new Error(`Failed to join channel #${channelName}`);
      }

      const result = await this.webClient.conversations.history({
        channel: channelId,
        oldest: (this.lastCheckTimestamp / 1000).toString(),
      });

      if (!result?.messages) return;

      for (const message of result.messages) {
        if (message.reactions?.some((r) => r.name === emojiToCheck)) {
          console.log(`Detected ${emojiToCheck} reaction in #${channelName}`);
          const ingredients = [
            { field: 'trigger_date', value: getTriggerDate() },
          ];
          await this.actionService.executeReactions(ingredients, reaction);
          this.lastCheckTimestamp = Date.now();
          break;
        }
      }
    } catch (error) {
      console.error('Error checking reactions:', error);
    }
  }

  async checkFileShared(
    action: ActiveAction,
    reaction: ActiveReaction[],
    refreshToken: string,
  ): Promise<void> {
    try {
      if (!this.isInit) {
        this.webClient = new WebClient(refreshToken);
        this.isInit = true;
      }
      const { channelName } = SlackUtils.parseSlackData(action.data);
      if (!channelName) {
        throw new Error('Channel name is required');
      }

      const channelId = await this.joinChannel(channelName);
      if (!channelId) {
        throw new Error(`Failed to join channel #${channelName}`);
      }

      const result = await this.webClient.conversations.history({
        channel: channelId,
        oldest: (this.lastCheckTimestamp / 1000).toString(),
      });

      if (result?.messages?.some((msg) => msg.files?.length > 0)) {
        console.log(`New file shared in channel #${channelName}`);
        const ingredients = [
          { field: 'trigger_date', value: getTriggerDate() },
        ];
        await this.actionService.executeReactions(ingredients, reaction);
        this.lastCheckTimestamp = Date.now();
      }
    } catch (error) {
      console.error('Error checking file shares:', error);
    }
  }
}
