import { ActionDto } from '@common/dto/action.dto';
import { Injectable } from '@nestjs/common';
import { ActiveReaction } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ActionService {
  private jwtToken: string;

  constructor(private prisma: PrismaService) {}

  /**
   * Updates the JWT token using the provided secret key and payload.
   */
  private updateToken(): void {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    const payload = {
      sub: 'service-execution',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    this.jwtToken = jwt.sign(payload, secretKey, { algorithm: 'HS256' });
  }

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
    this.updateToken();

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
          const response = await axios.post(
            'http://localhost:8080/reactions',
            {
              service: service.name,
              reaction: reaction.name,
              data: reaction.data,
            },
            {
              headers: {
                Authorization: `Bearer ${this.jwtToken}`,
              },
            },
          );
          console.log('SERVICE NAME: ', service.name);
          console.log('Axios response :', response.data);
        } catch (error) {
          console.error(
            'Erreur lors de la requête Axios :',
            error.response?.data || error.message,
          );
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
