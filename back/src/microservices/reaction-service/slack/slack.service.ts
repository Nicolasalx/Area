import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackReactionService {
  private webClient: WebClient;
  private isInit = false;

  constructor() {}

  async manageReactionSlack(
    refreshToken: string,
    reaction: string,
    data: any,
  ): Promise<string> {
    if (!this.isInit) {
      this.webClient = new WebClient(refreshToken);
      this.isInit = true;
    }
    switch (reaction.toLowerCase()) {
      case 'send_slack_message':
        return this.sendMessage(data);
      case 'add_slack_reaction':
        return this.addReaction(data);
      case 'pin_message':
        return this.pinMessage(data);
      case 'upload_file':
        return this.uploadFile(data);
      default:
        return 'Reaction not recognized for Slack';
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

  private async sendMessage(data: {
    channelName: string;
    message: string;
  }): Promise<string> {
    try {
      const channelId = await this.getChannelIdByName(data.channelName);
      if (!channelId) {
        throw new Error(`Channel ${data.channelName} not found`);
      }

      await this.webClient.chat.postMessage({
        channel: channelId,
        text: data.message,
      });

      return `Message sent successfully to #${data.channelName}`;
    } catch (error) {
      throw new Error(`Failed to send Slack message: ${error.message}`);
    }
  }

  private async addReaction(data: {
    channelName: string;
    reaction: string;
  }): Promise<string> {
    try {
      const channelId = await this.getChannelIdByName(data.channelName);
      if (!channelId) {
        throw new Error(`Channel ${data.channelName} not found`);
      }

      const history = await this.webClient.conversations.history({
        channel: channelId,
        limit: 1,
      });

      if (!history?.messages?.[0]?.ts) {
        throw new Error('No recent messages found');
      }

      await this.webClient.reactions.add({
        channel: channelId,
        timestamp: history.messages[0].ts,
        name: data.reaction,
      });

      return `Reaction ${data.reaction} added successfully in #${data.channelName}`;
    } catch (error) {
      throw new Error(`Failed to add reaction: ${error.message}`);
    }
  }

  private async pinMessage(data: { channelName: string }): Promise<string> {
    try {
      const channelId = await this.getChannelIdByName(data.channelName);
      if (!channelId) {
        throw new Error(`Channel ${data.channelName} not found`);
      }

      const history = await this.webClient.conversations.history({
        channel: channelId,
        limit: 1,
      });

      if (!history?.messages?.[0]?.ts) {
        throw new Error('No recent messages found');
      }

      await this.webClient.pins.add({
        channel: channelId,
        timestamp: history.messages[0].ts,
      });

      return `Message pinned successfully in #${data.channelName}`;
    } catch (error) {
      throw new Error(`Failed to pin message: ${error.message}`);
    }
  }

  private async uploadFile(data: {
    channelName: string;
    fileContent: string;
    filename: string;
  }): Promise<string> {
    try {
      const channelId = await this.getChannelIdByName(data.channelName);
      if (!channelId) {
        throw new Error(`Channel ${data.channelName} not found`);
      }

      await this.webClient.files.uploadV2({
        channels: channelId,
        content: data.fileContent,
        filename: data.filename,
      });

      return `File uploaded successfully to #${data.channelName}`;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}
