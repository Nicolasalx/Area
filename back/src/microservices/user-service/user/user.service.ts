import { Injectable } from '@nestjs/common';
import { Users, ConnectionType } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';

@Injectable()
export class UserService {
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
    return this.prisma.users.create({
      data: {
        name,
        email,
        password,
        type: ConnectionType.CLASSIC,
      },
    });
  }
}
