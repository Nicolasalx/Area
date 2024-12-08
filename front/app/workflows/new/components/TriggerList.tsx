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

interface TriggerListProps {
  triggers: Action[];
  selectedTrigger: Action | null;
  onSelect: (trigger: Action) => void;
}

export default function TriggerList({
  triggers,
  selectedTrigger,
  onSelect,
}: TriggerListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 py-1 md:grid-cols-2 lg:grid-cols-3">
      {triggers.map((trigger) => (
        <Card
          key={trigger.id}
          hover={true}
          className={`group cursor-pointer bg-white ${
            selectedTrigger?.id === trigger.id
              ? "ring-2 ring-black"
              : "hover:ring-1 hover:ring-gray-200"
          }`}
          onClick={() => onSelect(trigger)}
        >
          <Card.Header className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <Text variant="h4" className="text-lg font-medium">
                {trigger.name}
              </Text>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                  selectedTrigger?.id === trigger.id
                    ? "bg-black"
                    : "bg-transparent"
                }`}
              >
                <Check
                  className={`h-4 w-4 ${
                    selectedTrigger?.id === trigger.id
                      ? "text-white"
                      : "text-transparent"
                  }`}
                />
              </div>
            </div>
            {trigger.service && (
              <div className="flex items-center gap-2">
                <Text variant="caption" className="text-gray-500">
                  {trigger.service.name}
                </Text>
              </div>
            )}
          </Card.Header>
          <Card.Body className="border-t border-gray-100 p-6">
            <Text variant="body" className="text-gray-600">
              {trigger.description}
            </Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
