export interface Reaction {
  id: number;
  name: string;
  description: string;
  trigger: { reaction: string };
  isActive: boolean;
  createdAt: Date;
  serviceId: number;
  service?: {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
  };
  body?: Array<{
    name: string;
    description: string;
    required?: boolean;
    type?: string;
  }>;
}
