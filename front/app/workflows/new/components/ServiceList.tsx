"use client";

import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Check } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
}

interface Action {
  id: number;
  name: string;
  description: string;
  serviceId: number;
  service?: Service;
}

interface Reaction {
  id: number;
  name: string;
  description: string;
  serviceId: number;
  service?: Service;
}

interface ServiceListProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
  forTrigger: boolean;
  actionsByService?: Map<number, Action[]>;
  reactionsByService?: Map<number, Reaction[]>;
}

export default function ServiceList({
  services,
  selectedService,
  onSelect,
  forTrigger,
  actionsByService,
  reactionsByService,
}: ServiceListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 py-1 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card
          key={service.id}
          className={`group cursor-pointer bg-white transition-all duration-200 hover:shadow-md ${
            selectedService?.id === service.id
              ? "ring-2 ring-black"
              : "hover:ring-1 hover:ring-gray-200"
          }`}
          onClick={() => onSelect(service)}
        >
          <Card.Header className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <Text variant="h4" className="text-lg font-medium capitalize">
                {service.name}
              </Text>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                  selectedService?.id === service.id
                    ? "bg-black"
                    : "bg-transparent"
                }`}
              >
                <Check
                  className={`h-4 w-4 ${
                    selectedService?.id === service.id
                      ? "text-white"
                      : "text-transparent"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Text variant="caption" className="text-gray-500">
                {forTrigger
                  ? `${actionsByService?.get(service.id)?.length || 0} triggers available`
                  : `${reactionsByService?.get(service.id)?.length || 0} reactions available`}
              </Text>
            </div>
          </Card.Header>
          <Card.Body className="border-t border-gray-100 p-6">
            <Text variant="body" className="text-gray-600">
              {service.description}
            </Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
