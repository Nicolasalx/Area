import { ActiveAction, ActiveReaction } from '@prisma/client';

export interface IActionHandler {
  canHandle(action: string): boolean;
  handle(action: ActiveAction, reactions: ActiveReaction[]): Promise<void>;
}
