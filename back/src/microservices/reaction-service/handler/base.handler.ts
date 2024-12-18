export interface IReactionHandler {
  canHandle(reaction: string): boolean;
  handle(reaction: string, data: any): Promise<string>;
}
