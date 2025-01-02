"use client";

import React, { memo } from "react";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Check } from "lucide-react";
import { formatActionReactionName, getServiceIcon } from "../../utils";

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

interface TriggerCardProps {
  trigger: Action;
  isSelected: boolean;
  onSelect: (trigger: Action) => void;
}

const TriggerCard = memo(
  ({ trigger, isSelected, onSelect }: TriggerCardProps) => (
    <Card
      onClick={() => onSelect(trigger)}
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
              {getServiceIcon(trigger.service?.name, "h-8 w-8")}
            </div>
            <div className="flex flex-col">
              <Text variant="h5">{formatActionReactionName(trigger.name)}</Text>
              {trigger.service && (
                <Text variant="caption" color="gray">
                  {formatActionReactionName(trigger.service.name)}
                </Text>
              )}
            </div>
          </div>
          <Text variant="small" color="gray">
            {trigger.description}
          </Text>
        </div>
      </Card.Body>
    </Card>
  ),
);

TriggerCard.displayName = "TriggerCard";

const TriggerSkeleton = () => (
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

interface TriggerListProps {
  triggers: Action[];
  selectedTrigger: Action | null;
  onSelect: (trigger: Action) => void;
  loading?: boolean;
}

export default function TriggerList({
  triggers,
  selectedTrigger,
  onSelect,
  loading = false,
}: TriggerListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <TriggerSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!triggers || triggers.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <Text variant="h3" className="mb-2">
            Loading Actions...
          </Text>
          <Text color="gray">Please wait while we load available actions</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {triggers.map((trigger) => (
        <TriggerCard
          key={trigger.id}
          trigger={trigger}
          isSelected={selectedTrigger?.id === trigger.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
