export class ActiveReactions {
  id?: number;
  name: string;
  description: string;
  trigger: Record<string, any>;
  data: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  serviceId: number;

  constructor(
    name: string,
    description: string,
    trigger: Record<string, any>,
    data: Record<string, any>,
    serviceId: number,
    isActive: boolean = true,
    createdAt: Date = new Date(),
    id?: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.trigger = trigger;
    this.data = data;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.serviceId = serviceId;
  }
}
