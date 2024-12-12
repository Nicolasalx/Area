import {
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  EmailGithubResponse,
  UserGithubResponse,
  UserOAuthResponse,
} from '../../../common/interfaces/user/user';
import { IServideOauth } from '../oauth/IServiceOauth';

@Injectable()
export class GithubService implements IServideOauth {

  constructor(
    private readonly httpService: HttpService,
  ) {}

  async requestOAuthToken(code: string) : Promise<string> {
    const url = 'https://github.com/login/oauth/access_token';
    const values = {
      code: code,
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
    };
    const config = {
      headers: {
        Accept: 'application/json',
      },
    };
    const response = await this.httpService.axiosRef.post(
      url,
      values,
      config,
    );
    return response.data.access_token;
  }

  async requestUserInfo(access_token: string) : Promise<UserOAuthResponse> {
    const url = 'https://api.github.com/user';
    const response = await this.httpService.axiosRef.request<UserGithubResponse>({
      url: url,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response.data.email == null) {
      const emailResponse = await this.httpService.axiosRef.request<[EmailGithubResponse]>({
        url: 'https://api.github.com/user/emails',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const getPrimaryEmailGithub = (data: [EmailGithubResponse]): string => {
        for (const { email, primary } of data) {
          if (primary == true) {
            return email;
          }
        }
      };
      response.data.email = getPrimaryEmailGithub(emailResponse.data);
    }
    return {
      name: response.data.login,
      email: response.data.email,
      picture: response.data.avatar_url,
    }
  }
}
