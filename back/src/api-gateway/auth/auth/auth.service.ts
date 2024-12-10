import {
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserService } from '@userService/user/user.service';
import { EmailGithubResponse, UserGithubResponse, UserGoogleResponse } from '../../../common/interfaces/user/user';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConnectionType } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
        type: ConnectionType.CLASSIC,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.password && !user.password.startsWith('$2')) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await this.prisma.users.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      user.password = hashedPassword;
    }

    if (!user.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.users.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      user.password = hashedPassword;
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
    } catch {
      throw new UnauthorizedException('Password verification failed');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        tx.workflows.deleteMany({
          where: { userId: userId },
        });

        tx.serviceTokens.deleteMany({
          where: { userId: userId },
        });

        tx.users.delete({
          where: { id: userId },
        });
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting user:', error);
      if (error.code === 'P2003') {
        throw new Error(
          'Cannot delete user due to existing references. Error: ' +
            error.message,
        );
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async getGoogleOAuthTokens(code: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    };
    try {
      const response = await this.httpService.axiosRef.post(url, values);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get Google OAuth tokens: ', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Failed to get Google OAuth tokens',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getGoogleUser(access_token: string) {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    try {
      const response =
        await this.httpService.axiosRef.request<UserGoogleResponse>({
          url: url,
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
      let user = await this.userService.getUserByServiceId(
        'GOOGLE',
        response.data.email,
      );
      if (user == null) {
        user = await this.userService.createUser(
          response.data.name,
          response.data.email,
          access_token,
          'GOOGLE',
          response.data.picture,
        );
      }
      return {
        ...user,
      };
    } catch (error) {
      this.logger.error('ERROR getGoogleUser: ', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Failed to get Google user',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getGoogleOAuth(code: string) {
    try {
      // Get tokens from Google
      const { access_token } = await this.getGoogleOAuthTokens(code);

      // Get user with tokens
      const googleUser = await this.getGoogleUser(access_token);

      const token = this.jwtService.sign({
        sub: googleUser.id,
        email: googleUser.email,
      });

      // Return JSON data to the opener window
      const response = {
        googleUser: googleUser,
        token: token,
      };
      console.log('Response: ', response);
      return response;
    } catch (error) {
      this.logger.log('ERROR getGoogleOAuth: ', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Failed to get Google OAuth',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getGithubOAuthTokens(code: string) {
    const url = 'https://github.com/login/oauth/access_token';
    const values = {
      code: code,
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
    };
    const config = {
      headers : {
        Accept: 'application/json',
      }
    }
    try {
      console.log("values: ", values, config);
      const response = await this.httpService.axiosRef.post(url, values, config);
      console.log("access_token: ", response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get Github OAuth tokens: ', error);
      this.logger.error('Failed to get Github OAuth tokens', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Failed to get Github OAuth tokens',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getGithubUser(access_token: string) {
    const url = 'https://api.github.com/user';
    try {
      const response = await this.httpService.axiosRef.request<UserGithubResponse>({
          url: url,
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
      console.log("Response user Github: ", response.data);
      if (response.data.email == null) {
        const emailResponse = await this.httpService.axiosRef.request<[EmailGithubResponse]>({
          url: 'https://api.github.com/user/emails',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const getPrimaryEmailGithub = (data: [EmailGithubResponse]) : string => {
          for (let {email, primary} of data) {
            if (primary == true) {
              return email;
            }
          }
        }
        response.data.email = getPrimaryEmailGithub(emailResponse.data);
      }
      let user = await this.userService.getUserByServiceId(
        'GITHUB',
        response.data.email,
      );
      if (user == null) {
        user = await this.userService.createUser(
          response.data.login,
          response.data.email,
          access_token,
          'GITHUB',
          response.data.avatar_url,
        );
      }
      console.log("User with Github: ", user);
      return {
        ...user,
      };
    } catch (error) {
      console.error('ERROR getGithubUser: ', error);
      this.logger.error('ERROR getGithubUser', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Failed to get Github user',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getGithubOAuth(code: string) {
    try {
      // Get tokens from Github
      const responseTokens = await this.getGithubOAuthTokens(code);

      console.log("1 ", responseTokens);
      console.log("2 ", responseTokens.access_token);
      // Get user with tokens
      const githubUser = await this.getGithubUser(responseTokens.access_token);

      const token = this.jwtService.sign({
        sub: githubUser.id,
        email: githubUser.email,
      });

      // Return JSON data to the opener window
      const response = {
        githubUser: githubUser,
        token: token,
      };
      console.log('Response: ', response);
      return response;
    } catch (error) {
      // console.error('ERROR getGithubOAuth: ', error);
      this.logger.error('ERROR getGithubOAuth', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Failed to get Github OAuth',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
