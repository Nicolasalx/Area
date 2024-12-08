import { Module } from '@nestjs/common';
import { TriggerService } from './trigger/trigger.service';
import { TriggerController } from './trigger/trigger.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { ReactionService } from '../reaction-service/reaction/reaction.service';
import { GithubService } from '../action-service/github/github.service';
import { GoogleService } from '../reaction-service/google/google.service';

@Module({
  imports: [PrismaServiceModule],
  providers: [TriggerService, GithubService, ReactionService, GoogleService],
  controllers: [TriggerController],
})
export class TriggerServiceModule {}
