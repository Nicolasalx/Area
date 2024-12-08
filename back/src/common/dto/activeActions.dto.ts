export interface ActiveActionsDto {
  id?: number;
  name: string;
  description: string;
  data: Record<string, any>;
  isActive?: boolean;
  createdAt?: Date;
  serviceId: number;
}
