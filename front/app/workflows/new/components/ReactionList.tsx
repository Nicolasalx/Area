"use client";

import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Check } from "lucide-react";
import { formatActionReactionName, getServiceIcon } from "../../utils";

interface Service {
  id: number;
  name: string;
  description: string;
}

interface Reaction {
  id: number;
  name: string;
  description: string;
  serviceId: number;
  service?: Service;
}

interface ReactionListProps {
  reactions: Reaction[];
  selectedReaction: Reaction | null;
  onSelect: (reaction: Reaction) => void;
}

export default function ReactionList({
  reactions,
  selectedReaction,
  onSelect,
}: ReactionListProps) {
  if (!reactions.length) {
    return (
      <div className="flex min-h-[300px]">
        <div className="text-center">
          <Text variant="h3" className="mb-2">
            No Reactions Available
          </Text>
          <Text color="gray">No reactions are currently available</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reactions.map((reaction) => {
        const isSelected = selectedReaction?.id === reaction.id;

        return (
          <Card
            key={reaction.id}
            onClick={() => onSelect(reaction)}
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
                    {getServiceIcon(reaction.service?.name, "h-8 w-8")}
                  </div>
                  <div className="flex flex-col">
                    <Text variant="h5">
                      {formatActionReactionName(reaction.name)}
                    </Text>
                    {reaction.service && (
                      <Text variant="caption" color="gray">
                        {formatActionReactionName(reaction.service.name)}
                      </Text>
                    )}
                  </div>
                </div>
                <Text variant="small" color="gray">
                  {reaction.description}
                </Text>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
