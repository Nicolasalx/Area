"use client";

import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { ArrowRight } from "lucide-react";
import { formatActionReactionName, getServiceIcon } from "../../utils";
import ValidatedInput from "@/components/ui/ValidatedInput";

interface NameFormProps {
  value: string;
  onChange: (value: string) => void;
  selectedAction?: {
    name: string;
    service?: {
      name: string;
    };
  } | null;
  selectedReaction?: {
    name: string;
    service?: {
      name: string;
    };
  } | null;
}

export default function NameForm({
  value: name,
  onChange: onNameChange,
  selectedAction,
  selectedReaction,
}: NameFormProps) {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <Card.Header className="p-6">
        <Text variant="h3" className="text-xl font-medium">
          Name Your Area
        </Text>
      </Card.Header>
      <Card.Body className="p-6">
        <ValidatedInput
          type="text"
          className=""
          placeholder="Enter a name for your area"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        {selectedAction && selectedReaction && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                {getServiceIcon(selectedAction.service?.name ?? "")}
              </div>
              <div className="flex-1">
                <Text className="font-medium">
                  {formatActionReactionName(selectedAction.name)}
                </Text>
                <Text variant="caption" className="text-gray-500">
                  {selectedAction.service?.name}
                </Text>
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                {getServiceIcon(selectedReaction.service?.name ?? "")}
              </div>
              <div className="flex-1">
                <Text className="font-medium">
                  {formatActionReactionName(selectedReaction.name)}
                </Text>
                <Text variant="caption" className="text-gray-500">
                  {selectedReaction.service?.name}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
