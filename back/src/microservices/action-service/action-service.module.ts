import { Module } from '@nestjs/common';
import { ActionService } from './action/action.service';
import { ActionController } from './action/action.controller';

@Module({
  providers: [ActionService],
  controllers: [ActionController],
})
export class ActionServiceModule {}
