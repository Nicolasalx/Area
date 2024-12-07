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

  async getUserByServiceId(service: ConnectionType, token: string): Promise<Users> {
    return this.prisma.users.findFirst({
      where: {
        type: service,
        password: token,
      },
    });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    type: ConnectionType,
  ): Promise<Users> {
    const user = await this.prisma.users.create({
      data: {
        name,
        email,
        password,
        type,
      },
    });
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
    if (type != ConnectionType.CLASSIC) {
      await this.prisma.serviceTokens.create({
        data: {
          token: password,
          userId: user.id,
          serviceId: serviceId.id,
        }
      })
    }
    return user;
  }
}
