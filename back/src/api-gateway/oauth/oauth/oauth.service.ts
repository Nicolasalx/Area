import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '@userService/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConnectionType } from '@prisma/client';
import { IServideOauth } from './IServiceOauth';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { ServiceOauthResponse } from '@common/interfaces/oauth/oauth';
import { GoogleService } from '../google/google.service';
import { GithubService } from '../github/github.service';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private readonly googleService: GoogleService,
    private readonly githubService: GithubService,
    private readonly discordSercice: DiscordService,
  ) {}

  private readonly serviceOAuthList: {
    name: string;
    service: IServideOauth;
  }[] = [
    { name: 'google', service: this.googleService },
    { name: 'github', service: this.githubService },
    { name: 'discord', service: this.discordSercice },
  ];

  async deleteAllServiceToken(userId: string): Promise<any> {
    const serviceOauth = await this.prisma.serviceTokens.findMany({
      where: {
        userId: userId,
        services: {
          oauthNeed: true,
        },
      },
      select: {
        token: true,
        services: true,
      },
    });
    try {
      for (const serviceOauthUser of serviceOauth) {
        for (const serviceOauthElem of this.serviceOAuthList) {
          if (
            serviceOauthUser.services.name.localeCompare(
              serviceOauthElem.name,
            ) == 0
          ) {
            serviceOauthElem.service.revokeAccessToken(serviceOauthUser.token);
          }
        }
      }
    } catch (err) {
      console.log('deleteAllServiceToken: Revoke Oauth failed, ' + err);
    }
    return this.prisma.serviceTokens.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async deleteServiceToken(userId: string, serviceId: number): Promise<any> {
    const serviceOauth = await this.prisma.serviceTokens.findMany({
      where: {
        userId: userId,
        serviceId: serviceId,
        services: {
          oauthNeed: true,
        },
      },
      select: {
        token: true,
        services: true,
      },
    });
    try {
      for (const serviceOauthUser of serviceOauth) {
        for (const serviceOauthElem of this.serviceOAuthList) {
          if (
            serviceOauthUser.services.name.localeCompare(serviceOauthElem.name)
          ) {
            serviceOauthElem.service.revokeAccessToken(serviceOauthUser.token);
          }
        }
      }
    } catch (err) {
      console.log('deleteServiceToken: Revoke Oauth failed, ' + err);
    }
    return this.prisma.serviceTokens.deleteMany({
      where: {
        userId: userId,
        serviceId: serviceId,
      },
    });
  }

  async getServiceOAuthList(userId: string): Promise<ServiceOauthResponse[]> {
    const service_list = await this.prisma.services.findMany({
      where: {
        oauthNeed: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        serviceTokens: true,
      },
    });
    const new_service = service_list.map((o) => {
      return {
        id: o.id,
        name: o.name,
        description: o.description,
        isSet:
          o.serviceTokens.filter((elem) => elem.userId == userId).length != 0,
      };
    });
    return new_service;
  }

  async getServiceOAuthTokens(
    code: string,
    redirect_uri: string,
    type: ConnectionType,
    service: IServideOauth,
  ) {
    try {
      return await service.requestOAuthToken(code, redirect_uri);
    } catch (error) {
      console.error('ERROR get', type, 'OAuth tokens:', error);
      this.logger.error(
        'Failed to get ' +
          type +
          ' OAuth tokens: ' +
          error.response.data.error +
          ' (' +
          error.response.data.error_description +
          ')',
      );
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Failed to get ${type} OAuth tokens: ` + error,
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
      this.logger.error(
        'ERROR get' +
          type +
          ' User: ' +
          error.response.data.error +
          ' (' +
          error.response.data.error_description +
          ')',
      );
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
    redirect_uri: string,
    type: ConnectionType,
    service: IServideOauth,
  ) {
    const access_token = await this.getServiceOAuthTokens(
      code,
      redirect_uri,
      type,
      service,
    );
    const user = await this.getServiceUser(access_token, type, service);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const response = {
      user: user,
      token: token,
    };
    return response;
  }
}
