/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  UserOAuthResponse,
} from '@common/interfaces/user/user';
import { IServiceOauth } from '../oauth/IServiceOauth';

@Injectable()
export class SpotifyService implements IServiceOauth {
  constructor(private readonly httpService: HttpService) {}

  async requestOAuthToken(code: string, redirect_uri: string): Promise<string> {
    const url = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
      code,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
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
    return {
      name: "spotify_user",
      email: "spotify_email",
      picture: "spotify_picture",
    };
  }

  async revokeAccessToken(access_token: string): Promise<any> {
  }
}
