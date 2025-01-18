"use client";

import React, { memo } from "react";
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

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  availableCount: number;
  forTrigger: boolean;
  onSelect: (service: Service) => void;
}

const ServiceCard = memo(
  ({
    service,
    isSelected,
    availableCount,
    forTrigger,
    onSelect,
  }: ServiceCardProps) => (
    <Card
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              {getServiceIcon(service.name, "h-8 w-8")}
            </div>
            <div className="flex flex-col">
              <Text variant="h5">
                {service.name.charAt(0).toUpperCase() + service.name.slice(1)}
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
          <Text variant="small" color="gray">
            {service.description}
          </Text>
        </div>
      </Card.Body>
    </Card>
  ),
);

ServiceCard.displayName = "ServiceCard";

const ServiceSkeleton = () => (
  <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
    <div className="relative">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-gray-200" />
        <div className="flex flex-col gap-2">
          <div className="h-6 w-32 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
      </div>
      <div className="h-4 w-full rounded bg-gray-200" />
    </div>
  </div>
);

interface ServiceListProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
  forTrigger: boolean;
  actionsByService?: Map<number, Action[]>;
  reactionsByService?: Map<number, Reaction[]>;
  loading?: boolean;
}

export default function ServiceList({
  services,
  selectedService,
  onSelect,
  forTrigger,
  actionsByService,
  reactionsByService,
  loading = false,
}: ServiceListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ServiceSkeleton key={i} />
        ))}
      </div>
    );
  }
  const filteredServices = services.filter((service) => {
    if (forTrigger) {
      return actionsByService?.get(service.id)?.length ?? 0 > 0;
    } else {
      return reactionsByService?.get(service.id)?.length ?? 0 > 0;
    }
  });

  if (!filteredServices.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
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
        const availableCount = forTrigger
          ? actionsByService?.get(service.id)?.length || 0
          : reactionsByService?.get(service.id)?.length || 0;

        return (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selectedService?.id === service.id}
            availableCount={availableCount}
            forTrigger={forTrigger}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}
