import { ActionDto } from '@common/dto/action.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaService/prisma/prisma.service';

@Injectable()
export class ActionService {
  constructor(private prisma: PrismaService) {}

  async getActions(): Promise<ActionDto[]> {
    const actions = await this.prisma.actions.findMany();

    return actions.map((action) => ({
      id: action.id,
      name: action.name,
      description: action.description,
      isActive: action.isActive,
      createdAt: action.createdAt,
    }));
  }
}
