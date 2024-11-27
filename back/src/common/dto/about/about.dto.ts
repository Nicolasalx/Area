export interface ClientInfoDto {
  host: string;
}

export interface ActionDto {
  name: string;
  description: string;
}

export interface ReactionDto {
  name: string;
  description: string;
}

export interface ServiceDto {
  name: string;
  actions: ActionDto[];
  reactions: ReactionDto[];
}

export interface AboutResponseDto {
  client: ClientInfoDto;
  server: {
    current_time: number;
    services: ServiceDto[];
  };
}
