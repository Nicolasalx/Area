import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '@userService/user/user.service';
import {
  UserOAuthResponse,
} from '../../../common/interfaces/user/user';
import { JwtService } from '@nestjs/jwt';
import { ConnectionType } from '@prisma/client';
import { IServideOauth } from './IServiceOauth';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async getServiceOAuthTokens(
      code: string,
      type: ConnectionType,
      service: IServideOauth,
  ) {
    try {
      return await service.requestOAuthToken(code);
    } catch (error) {
      console.error('ERROR get', type, 'OAuth tokens:', error);
      this.logger.error('Failed to get ', type, ' OAuth tokens: ', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Failed to get ${type} OAuth tokens`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getServiceUser(
      access_token: string,
      type: ConnectionType,
      service: IServideOauth,
    ) {
    try {
      const response = await service.requestUserInfo(access_token);
      let user = await this.userService.getUserByServiceId(
        type,
        response.email,
      );
      if (user == null) {
        user = await this.userService.createUser(
          response.name,
          response.email,
          access_token,
          type,
          response.picture,
        );
      }
      return {
        ...user,
      };
    } catch (error) {
      console.error('ERROR get', type, 'User:', error);
      this.logger.error('ERROR get', type, ' User: ', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Failed to get ${type} user`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getServiceOAuth(
      code: string,
      type: ConnectionType,
      service: IServideOauth,
  ) {
    try {
      const access_token = await this.getServiceOAuthTokens(code, type, service);
      const user = await this.getServiceUser(access_token, type, service);

      console.log('get User ', user);
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });

      const response = {
        user: user,
        token: token,
      };
      return response;
    } catch (error) {
      console.error('ERROR get', type, 'OAuth:', error);
      this.logger.error('ERROR get', type, 'OAuth:', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Failed to get ${type} OAuth`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
