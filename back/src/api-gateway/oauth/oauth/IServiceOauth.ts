import { UserOAuthResponse } from '@common/interfaces/user/user';

export abstract class IServideOauth {
  abstract requestOAuthToken(code: string): Promise<string>;
  abstract requestUserInfo(access_token: string): Promise<UserOAuthResponse>;
}
