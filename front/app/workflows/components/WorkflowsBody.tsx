"use client";

import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/Card";
import CardHeader from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import {
  Mail,
  PlayCircle,
  Settings,
  ArrowRight,
  Ghost,
  Trash2,
  Power,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface Workflow {
  id: number;
  name: string;
  userId: string;
  isActive: boolean;
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
  onDelete?: (id: number) => void;
  onToggle?: (id: number, isActive: boolean) => void;
}

export default function WorkflowsBody({
  workflows,
  onDelete,
  onToggle,
}: WorkflowsBodyProps) {
  const { token } = useAuth();
  const { showToast } = useToast();

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/workflow/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete area");
      }

      showToast("Area deleted successfully", "success");
      onDelete?.(id);
    } catch (error) {
      console.error("Delete error:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to delete area",
        "error",
      );
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/workflow/${id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update workflow status");
      }

      showToast(
        `Area ${!currentStatus ? "activated" : "deactivated"} successfully`,
        "success",
      );
      onToggle?.(id, !currentStatus);
    } catch (error) {
      console.error("Toggle error:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to update workflow status",
        "error",
      );
    }
  };

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <Text variant="h2">No workflows found</Text>
        <Text className="mb-4 text-gray-500">
          You haven&apos;t created any workflows yet.
        </Text>
        <Button leftIcon={<PlayCircle className="h-4 w-4" />}>
          Create your first area
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
            <div className="flex items-start justify-between">
              <Text variant="h3" className="text-gray-800">
                {workflow.name.length > 0
                  ? workflow.name.charAt(0).toUpperCase() +
                    workflow.name.slice(1)
                  : "Untitled Area"}
              </Text>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggle(workflow.id, workflow.isActive)}
                  className={`transition-colors ${
                    workflow.isActive
                      ? "rounded-full border-b-0 border-black p-2 text-green-500 duration-200 hover:text-green-600 focus-visible:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                      : "rounded-full border-b-0 border-black p-2 text-gray-400 duration-200 hover:text-gray-500 focus-visible:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  }`}
                  title={
                    workflow.isActive ? "Deactivate area" : "Activate area"
                  }
                >
                  <Power className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(workflow.id)}
                  className="rounded-full border-b-0 border-black p-2 text-gray-500 duration-200 hover:text-red-500 focus-visible:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  title="Delete area"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="rounded-none p-6" border={false}>
            <div className="space-y-6">
              <div>
                <Text variant="h4" className="mb-3 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-gray-500" />
                  Actions
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
                        No actions have been added yet
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
