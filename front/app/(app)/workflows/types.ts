export type InputType =
  | "text"
  | "url"
  | "date"
  | "time"
  | "number"
  | "select"
  | "temperature"
  | "channel"
  | "emoji";

export interface InputValidation {
  pattern?: string;
  min?: number;
  max?: number;
}

export interface InputField {
  name: string;
  field: string;
  description: string;
  required?: boolean;
  type?: InputType;
  options?: string[];
  validation?: InputValidation;
}

export interface Service {
  id: number;
  name: string;
  description: string;
}

export interface BaseAction {
  id: number;
  name: string;
  description: string;
  serviceId: number;
}

export interface Action extends BaseAction {
  service?: Service;
  body?: InputField[];
}

export interface Reaction extends BaseAction {
  service?: Service;
  body?: InputField[];
}

export type WorkflowStep =
  | "trigger-service"
  | "trigger-action"
  | "trigger-data"
  | "reaction-service"
  | "reaction-action"
  | "reaction-data"
  | "name";

export interface WorkflowData {
  name: string;
  sessionId: string;
  actions: {
    name: string;
    serviceId: number;
    data: Record<string, string>;
    isActive: boolean;
  }[];
  reactions: {
    name: string;
    serviceId: number;
    data: Record<string, string>;
    isActive: boolean;
    trigger: { reaction: string };
  }[];
}
