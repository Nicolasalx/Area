"use client";

import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/Card";
import CardHeader from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Mail, PlayCircle, Settings, ArrowRight, Ghost } from "lucide-react";
import Button from "@/components/ui/Button";

interface Workflow {
  id: number;
  name: string;
  userId: string;
  actions: Array<{
    id: number;
    name: string;
    service: {
      name: string;
    };
  }>;
  reactions: Array<{
    id: number;
    name: string;
    service: {
      name: string;
    };
  }>;
}

const getServiceIcon = (serviceName: string) => {
  switch (serviceName.toLowerCase()) {
    case "google":
      return <Mail className="h-4 w-4 text-gray-500" />;
    default:
      return <Settings className="h-4 w-4 text-gray-500" />;
  }
};

const getRandomGradient = () => {
  const colors = [
    "from-blue-50",
    "from-green-50",
    "from-purple-50",
    "from-pink-50",
    "from-yellow-50",
    "from-indigo-50",
    "from-red-50",
    "from-teal-50",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface WorkflowsBodyProps {
  workflows: Workflow[];
}

export default function WorkflowsBody({ workflows }: WorkflowsBodyProps) {
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <Text variant="h2">No workflows found</Text>
        <Text className="mb-4 text-gray-500">
          You haven&apos;t created any workflows yet.
        </Text>
        <Button leftIcon={<PlayCircle className="h-4 w-4" />}>
          Create your first workflow
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workflows.map((workflow) => (
        <Card key={workflow.id} shadow="small" hover="all">
          <CardHeader
            className={`bg-gradient-to-r ${getRandomGradient()} rounded-none border-0 to-white p-6`}
          >
            <Text variant="h3" className="text-gray-800">
              {workflow.name.length > 0
                ? workflow.name.charAt(0).toUpperCase() + workflow.name.slice(1)
                : "Untitled Area"}
            </Text>
          </CardHeader>
          <CardContent className="rounded-none p-6" border={false}>
            <div className="space-y-6">
              <div>
                <Text variant="h4" className="mb-3 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-gray-500" />
                  Triggers
                </Text>
                <ul className="ml-4 space-y-2 rounded-lg bg-gray-100 p-2">
                  {workflow.actions.length > 0 ? (
                    workflow.actions.map((action) => (
                      <li
                        key={action.id}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        {getServiceIcon(action.service.name)}
                        <Text>{action.name}</Text>
                        <Text variant="caption">({action.service.name})</Text>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-2 text-gray-700">
                      <Ghost className="h-4 w-4 text-gray-500" />
                      <Text
                        variant="caption"
                        color="red"
                        className="opacity-75"
                      >
                        No triggers have been added yet
                      </Text>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <Text variant="h4" className="mb-3 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-gray-500" />
                  Reactions
                </Text>
                <ul className="ml-4 space-y-2 rounded-lg bg-gray-100 p-2">
                  {workflow.reactions.length > 0 ? (
                    workflow.reactions.map((reaction) => (
                      <li
                        key={reaction.id}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        {getServiceIcon(reaction.service.name)}
                        <Text>{reaction.name}</Text>
                        <Text variant="caption">({reaction.service.name})</Text>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-2 text-gray-700">
                      <Ghost className="h-4 w-4 text-gray-500" />
                      <Text
                        variant="caption"
                        color="red"
                        className="opacity-75"
                      >
                        No reactions have been added yet
                      </Text>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
