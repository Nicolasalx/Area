"use client";

import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Check } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 gap-6 py-1 md:grid-cols-2 lg:grid-cols-3">
      {reactions.map((reaction) => (
        <Card
          key={reaction.id}
          className={`group cursor-pointer bg-white transition-all duration-200 hover:shadow-md ${
            selectedReaction?.id === reaction.id
              ? "ring-2 ring-black"
              : "hover:ring-1 hover:ring-gray-200"
          }`}
          onClick={() => onSelect(reaction)}
        >
          <Card.Header className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <Text variant="h4" className="text-lg font-medium">
                {reaction.name}
              </Text>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                  selectedReaction?.id === reaction.id
                    ? "bg-black"
                    : "bg-transparent"
                }`}
              >
                <Check
                  className={`h-4 w-4 ${
                    selectedReaction?.id === reaction.id
                      ? "text-white"
                      : "text-transparent"
                  }`}
                />
              </div>
            </div>
            {reaction.service && (
              <div className="flex items-center gap-2">
                <Text variant="caption" className="text-gray-500">
                  {reaction.service.name}
                </Text>
              </div>
            )}
          </Card.Header>
          <Card.Body className="border-t border-gray-100 p-6">
            <Text variant="body" className="text-gray-600">
              {reaction.description}
            </Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
