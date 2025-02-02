import { UserOAuthResponse } from '@common/interfaces/user/user';

export abstract class IServiceOauth {
  abstract requestOAuthToken(
    code: string,
    redirect_uri: string,
  ): Promise<string>;
  abstract requestUserInfo(access_token: string): Promise<UserOAuthResponse>;
  abstract revokeAccessToken(access_token: string): Promise<any>;
}
