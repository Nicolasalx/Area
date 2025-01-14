import {
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConnectionType } from '@prisma/client';
import { OAuthService } from '../../oauth/oauth/oauth.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private oauthService: OAuthService,
    private jwtService: JwtService,
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

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

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
      await this.oauthService.deleteAllServiceToken(userId);
      await this.prisma.$transaction(async (tx) => {
        await tx.activeAction.deleteMany({
          where: {
            workflow: {
              userId: userId,
            },
          },
        });

        await tx.activeReaction.deleteMany({
          where: {
            workflow: {
              userId: userId,
            },
          },
        });

        await tx.workflows.deleteMany({
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
}
