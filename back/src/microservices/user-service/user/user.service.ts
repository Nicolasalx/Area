import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionType, Users, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async getUserById(id: string): Promise<Users> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async getUserByServiceId(service: ConnectionType, email: string): Promise<Users> {
    return this.prisma.users.findFirst({
      where: {
        type: service,
        email: email,
      },
    });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    type: ConnectionType,
  ): Promise<Users> {
    try {
      this.logger.debug(`Creating user with email: ${email}`);

      // Check if user already exists
      const existingUser = await this.prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        this.logger.warn(`User with email ${email} already exists`);
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.users.create({
        data: {
          name,
          email,
          password: hashedPassword,
          type: type,
        },
      });
      if (type != ConnectionType.CLASSIC) {
        const serviceId = await this.prisma.services.findFirst({
          where : {
            name : {
              equals: type,
              mode: 'insensitive'
            }
          },
          select : {
            id : true,
          }
        })
        await this.prisma.serviceTokens.create({
          data: {
            token: password,
            userId: user.id,
            serviceId: serviceId.id,
          }
        })
      }

      this.logger.debug(`User created successfully with ID: ${user.id}`);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as Users;
    } catch (error) {
      this.logger.error('Error creating user:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User with this email already exists');
        }
      }

      throw new InternalServerErrorException('Could not create user');
    }
  }

  async deleteUser(email: string): Promise<{ message: string }> {
    try {
      this.logger.debug(`Attempting to delete user with email: ${email}`);

      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      await this.prisma.users.delete({
        where: { email },
      });

      this.logger.debug(`User with email ${email} successfully deleted`);
      return { message: 'User successfully deleted' };
    } catch (error) {
      this.logger.error(`Error deleting user with email ${email}:`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Could not delete user');
    }
  }
}
