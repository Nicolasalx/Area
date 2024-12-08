"use client";

import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Input from "@/components/ui/Input";
import { ArrowRight, PlayCircle } from "lucide-react";
import { getServiceIcon } from "../../utils";

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

interface NameFormProps {
  name: string;
  onNameChange: (name: string) => void;
  selectedAction: Action | null;
  selectedReaction: Reaction | null;
}

export default function NameForm({
  name,
  onNameChange,
  selectedAction,
  selectedReaction,
}: NameFormProps) {
  return (
    <Card className="bg-white">
      <div className="max-w-xl p-6">
        <Text variant="h4" className="mb-3 font-medium">
          Name
        </Text>
        <Input
          type="text"
          placeholder="Enter a descriptive name for your area"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        {selectedAction && selectedReaction && (
          <div className="mt-6 space-y-4">
            <div>
              <Text variant="h4" className="mb-3 flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-gray-500" />
                Action
              </Text>
              <ul className="ml-4 space-y-2 rounded-lg bg-gray-100 p-2">
                <li className="flex items-center gap-2 text-gray-700">
                  {selectedAction.service &&
                    getServiceIcon(selectedAction.service.name)}
                  <Text>{selectedAction.name}</Text>
                  <Text variant="caption">
                    ({selectedAction.service?.name})
                  </Text>
                </li>
              </ul>
            </div>

            <div>
              <Text variant="h4" className="mb-3 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-gray-500" />
                Reaction
              </Text>
              <ul className="ml-4 space-y-2 rounded-lg bg-gray-100 p-2">
                <li className="flex items-center gap-2 text-gray-700">
                  {selectedReaction.service &&
                    getServiceIcon(selectedReaction.service.name)}
                  <Text>{selectedReaction.name}</Text>
                  <Text variant="caption">
                    ({selectedReaction.service?.name})
                  </Text>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
