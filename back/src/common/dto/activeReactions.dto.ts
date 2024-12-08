export interface ActiveReactionsDto {
  id?: number;
  name: string;
  description: string;
  trigger: Record<string, any>;
  data: Record<string, any>;
  isActive?: boolean;
  createdAt?: Date;
  serviceId: number;
}
