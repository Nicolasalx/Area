import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  UserGoogleResponse,
  UserOAuthResponse,
} from '@common/interfaces/user/user';
import { IServiceOauth } from '../oauth/IServiceOauth';

@Injectable()
export class GoogleService implements IServiceOauth {
  constructor(private readonly httpService: HttpService) {}

  async requestOAuthToken(code: string, redirect_uri: string): Promise<string> {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
    };
    const response = await this.httpService.axiosRef.post(url, values);
    return response.data.access_token;
  }

  async requestUserInfo(access_token: string): Promise<UserOAuthResponse> {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const response =
      await this.httpService.axiosRef.request<UserGoogleResponse>({
        url: url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    return {
      ...response.data,
    };
  }

  async revokeAccessToken(access_token: string): Promise<any> {
    const url = 'https://oauth2.googleapis.com/revoke';
    const values = {
      token: access_token,
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
    };
    const config = {
      headers: {},
    };
    const response = await this.httpService.axiosRef.post(url, values, config);
    return response;
  }
}
