import { Module } from '@nestjs/common';
import { TriggerService } from './trigger/trigger.service';
import { TriggerController } from './trigger/trigger.controller';

@Module({
  providers: [TriggerService],
  controllers: [TriggerController],
})
export class TriggerServiceModule {}
