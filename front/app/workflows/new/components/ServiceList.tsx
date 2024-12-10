"use client";

import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { getServiceIcon } from "../../utils";
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
}

interface Reaction {
  id: number;
  name: string;
  description: string;
  serviceId: number;
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
  const filteredServices = services.filter((service) => {
    if (forTrigger) {
      return actionsByService?.get(service.id)?.length ?? 0 > 0;
    } else {
      return reactionsByService?.get(service.id)?.length ?? 0 > 0;
    }
  });

  if (!filteredServices.length) {
    return (
      <div className="flex min-h-[300px]">
        <div className="text-center">
          <Text variant="h3" className="mb-2">
            No Services Available
          </Text>
          <Text color="gray">
            {forTrigger
              ? "No services with actions are currently available"
              : "No services with reactions are currently available"}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredServices.map((service) => {
        const isSelected = selectedService?.id === service.id;
        const availableCount = forTrigger
          ? actionsByService?.get(service.id)?.length || 0
          : reactionsByService?.get(service.id)?.length || 0;

        return (
          <Card
            key={service.id}
            onClick={() => onSelect(service)}
            className={`cursor-pointer transition-all duration-200 hover:border-black hover:shadow-md ${
              isSelected ? "border-black" : ""
            }`}
            shadow={isSelected ? "medium" : "small"}
          >
            <Card.Body className="p-6">
              <div className="relative">
                {isSelected && (
                  <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    {getServiceIcon(service.name)}
                  </div>
                  <div>
                    <Text className="font-medium">
                      {service.name.charAt(0).toUpperCase() +
                        service.name.slice(1)}
                    </Text>
                    <Text variant="caption" color="gray">
                      {availableCount}{" "}
                      {forTrigger
                        ? `action${availableCount !== 1 ? "s" : ""}`
                        : `reaction${availableCount !== 1 ? "s" : ""}`}{" "}
                      available
                    </Text>
                  </div>
                </div>
                <Text color="gray">{service.description}</Text>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
