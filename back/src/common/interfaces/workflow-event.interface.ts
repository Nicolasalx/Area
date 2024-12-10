import { ActiveAction, ActiveReaction } from '@prisma/client';

export interface WorkflowEventPayload {
  workflow: any;
  action: ActiveAction;
  reactions: ActiveReaction[];
}
