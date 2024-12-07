import { Action } from './action.interface';
import { Reaction } from './reaction.interface';

export interface WorkflowDto {
  name: string;
  sessionId: string;
  actions: Action[];
  reactions: Reaction[];
}
