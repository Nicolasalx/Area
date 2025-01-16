import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '@userService/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConnectionType } from '@prisma/client';
import { IServiceOauth } from './IServiceOauth';
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
    private readonly discordService: DiscordService,
  ) {}

  private readonly serviceOAuthList: {
    name: string;
    service: IServiceOauth;
  }[] = [
    { name: 'google', service: this.googleService },
    { name: 'github', service: this.githubService },
    { name: 'discord', service: this.discordService },
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
      select: {
        id: true,
        name: true,
        description: true,
        serviceTokens: true,
        oauthNeed: true,
      },
    });
    const new_service = service_list.map((o) => {
      return {
        id: o.id,
        name: o.name,
        description: o.description,
        oauthNeed: o.oauthNeed,
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
    service: IServiceOauth,
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
    service: IServiceOauth,
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
    service: IServiceOauth,
    state?: string,
  ) {
    const access_token = await this.getServiceOAuthTokens(
      code,
      redirect_uri,
      type,
      service,
    );

    if (
      state &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        state,
      )
    ) {
      const existingUser = await this.prisma.users.findUnique({
        where: { id: state },
      });

      if (existingUser) {
        const serviceId = await this.prisma.services.findFirst({
          where: {
            name: {
              equals: type.toLowerCase(),
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
          },
        });

        if (serviceId) {
          await this.prisma.serviceTokens.upsert({
            where: {
              userId_serviceId: {
                userId: existingUser.id,
                serviceId: serviceId.id,
              },
            },
            create: {
              userId: existingUser.id,
              serviceId: serviceId.id,
              token: access_token,
            },
            update: {
              token: access_token,
            },
          });
        }

        return {
          user: existingUser,
          token: this.jwtService.sign({
            sub: existingUser.id,
            email: existingUser.email,
          }),
        };
      }
    }

    const userInfo = await service.requestUserInfo(access_token);

    let user = await this.userService.getUserByServiceId(type, userInfo.email);

    if (!user) {
      user = await this.userService.createUser(
        userInfo.name,
        userInfo.email,
        access_token,
        type,
        userInfo.picture,
      );
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user,
      token,
    };
  }

  async addServiceApiKey(
    userId: string,
    serviceId: number,
    apiKey: string,
  ): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const service = await this.prisma.services.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Service not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (service.oauthNeed) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'This service requires OAuth authentication',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.serviceTokens.upsert({
      where: {
        userId_serviceId: {
          userId: userId,
          serviceId: serviceId,
        },
      },
      create: {
        userId: userId,
        serviceId: serviceId,
        token: apiKey,
      },
      update: {
        token: apiKey,
      },
    });
  }
}
