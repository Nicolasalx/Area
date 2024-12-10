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
import { UserGoogleResponse } from '../../../common/interfaces/user/user';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    const user = await this.prisma.users.findUnique({
      where: { email },
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

    const payload = {
      sub: user.id,
      email: user.email,
    };

    this.logger.debug(
      `Generating token with payload: ${JSON.stringify(payload)}`,
    );
    this.logger.debug(
      `Using JWT secret: ${process.env.JWT_SECRET || 'your-secret-key'}`,
    );

    const token = this.jwtService.sign(payload);
    this.logger.debug(`Generated token: ${token.substring(0, 20)}...`);

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
        await tx.workflows.deleteMany({
          where: { userId: userId },
        });

        await tx.serviceTokens.deleteMany({
          where: { userId: userId },
        });

        await tx.users.delete({
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
        picture: response.data.picture,
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
}
