import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  UserGoogleResponse,
  UserOAuthResponse,
} from '../../../common/interfaces/user/user';
import { IServideOauth } from '../oauth/IServiceOauth';

@Injectable()
export class GoogleService implements IServideOauth {
  constructor(private readonly httpService: HttpService) {}

  async requestOAuthToken(code: string): Promise<string> {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID_AUTH!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET_AUTH!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI_AUTH!,
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
}
