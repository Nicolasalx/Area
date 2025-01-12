import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  UserDiscordResponse,
  UserOAuthResponse,
} from '@common/interfaces/user/user';
import { IServideOauth } from '../oauth/IServiceOauth';

@Injectable()
export class DiscordService implements IServideOauth {
  constructor(private readonly httpService: HttpService) {}

  async requestOAuthToken(code: string, _redirect_uri: string): Promise<string> {
    const url = 'https://discord.com/api/oauth2/token';
    const body = new URLSearchParams({
      code: code,
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      grant_type: 'authorization_code',
      scope: ['identify', 'email'].join(' '),
    }).toString();
    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    };
    const response = await this.httpService.axiosRef.post(url, body, header);
    return response.data.access_token;
  }

  async requestUserInfo(access_token: string): Promise<UserOAuthResponse> {
    const url = 'https://discordapp.com/api/users/@me';
    const response =
      await this.httpService.axiosRef.request<UserDiscordResponse>({
        url: url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    return {
      name: response.data.username,
      email: response.data.email,
      picture:
        'https://cdn.discordapp.com/avatars/' +
        response.data.id +
        '/' +
        response.data.avatar,
    };
  }
}
