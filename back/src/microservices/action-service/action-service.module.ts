import { Module } from '@nestjs/common';
import { ActionService } from './action/action.service';
import { ActionController } from './action/action.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { GithubService } from './github/github.service';
import { ReactionService } from '../reaction-service/reaction/reaction.service';
import { GoogleService } from '../reaction-service/google/google.service';

@Module({
  imports: [PrismaServiceModule],
  providers: [ActionService, GithubService, ReactionService, GoogleService],
  controllers: [ActionController],
})
export class ActionServiceModule {}
