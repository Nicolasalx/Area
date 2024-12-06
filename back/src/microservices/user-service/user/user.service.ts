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

  async createUser(
    name: string,
    email: string,
    password: string,
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

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with hashed password
      const user = await this.prisma.users.create({
        data: {
          name,
          email,
          password: hashedPassword,
          type: ConnectionType.CLASSIC,
        },
      });

      this.logger.debug(`User created successfully with ID: ${user.id}`);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as Users;
    } catch (error) {
      this.logger.error('Error creating user:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violations
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
