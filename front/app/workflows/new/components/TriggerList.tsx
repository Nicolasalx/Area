"use client";

import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Check } from "lucide-react";
import { formatActionReactionName, getServiceIcon } from "../../utils";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("triggerList");

  if (!triggers.length) {
    return (
      <div className="flex min-h-[300px]">
        <div className="text-center">
          <Text variant="h3" className="mb-2">
            {t("noTriggersAvailable")}
          </Text>
          <Text color="gray">{t("noTriggersCurrentlyAvailable")}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {triggers.map((trigger) => {
        const isSelected = selectedTrigger?.id === trigger.id;

        return (
          <Card
            key={trigger.id}
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
                    <Text variant="h5">
                      {formatActionReactionName(trigger.name)}
                    </Text>
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
        );
      })}
    </div>
  );
}
