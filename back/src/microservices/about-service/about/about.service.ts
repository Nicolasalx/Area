import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaService/prisma/prisma.service';

@Injectable()
export class AboutService {
  constructor(private readonly prisma: PrismaService) {}

  async getAboutMessage(clientIp: string): Promise<any> {
    const services = await this.prisma.services.findMany({
      where: { isActive: true },
    });

    const formattedServices = await Promise.all(
      services.map(async (service) => {
        const actions = await this.prisma.actions.findMany({
          where: { serviceId: service.id },
          select: {
            name: true,
            description: true,
          },
        });

        const reactions = await this.prisma.reactions.findMany({
          where: { serviceId: service.id },
          select: {
            name: true,
            description: true,
          },
        });

        return {
          name: service.name,
          actions,
          reactions,
        };
      }),
    );

    const response = {
      client: {
        host: clientIp,
      },
      server: {
        current_time: Math.floor(Date.now() / 1000),
        services: formattedServices,
      },
    };

    return response;
  }
}
