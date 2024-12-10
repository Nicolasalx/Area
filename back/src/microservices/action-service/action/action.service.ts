import { ActionDto } from '@common/dto/action.dto';
import { Injectable } from '@nestjs/common';
import { ActiveReaction } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class ActionService {
  constructor(public prisma: PrismaService) {}

  async getActions(): Promise<ActionDto[]> {
    const actions = await this.prisma.actions.findMany({
      include: {
        service: true,
      },
    });

    return actions.map((action) => ({
      id: action.id,
      name: action.name,
      description: action.description,
      isActive: action.isActive,
      createdAt: action.createdAt,
      serviceId: action.serviceId,
      service: action.service,
      body: action.body,
    }));
  }

  async executeReactions(reactions: ActiveReaction[]): Promise<void> {
    for (const reaction of reactions) {
      try {
        const service = await this.prisma.services.findUnique({
          where: { id: reaction.serviceId },
        });

        if (!service) {
          console.log(`Service not found for ID: ${reaction.serviceId}`);
          continue;
        }

        try {
          // Change to use service maybe instead of post
          const response = await axios.post('http://localhost:8080/reactions', {
            service: service.name,
            reaction: reaction.name,
            data: reaction.data,
          });
          console.log('Réponse Axios :', response.data);
        } catch (error) {
          console.error('Erreur lors de la requête Axios :', error);
        }
      } catch (error) {
        console.error(
          `Error fetching service for ID: ${reaction.serviceId}`,
          error,
        );
      }
    }
  }
}
