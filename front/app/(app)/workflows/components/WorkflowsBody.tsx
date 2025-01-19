"use client";

import React, { memo } from "react";
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/Card";
import CardHeader from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { PlayCircle, ArrowRight, Ghost, Trash2, Power } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import api from "@/lib/api";
import { AxiosError } from "axios";

import {
  getServiceIcon,
  formatActionReactionName,
  getServiceGradient,
} from "../utils";

interface Workflow {
  id: string;
  name: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  activeActions: Array<{
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    serviceId: number;
    service: {
      id: number;
      name: string;
      description: string;
      isActive: boolean;
      createdAt: string;
    };
  }>;
  activeReactions: Array<{
    id: number;
    name: string;
    description: string;
    trigger: { reaction: string };
    isActive: boolean;
    createdAt: string;
    serviceId: number;
    service: {
      id: number;
      name: string;
      description: string;
      isActive: boolean;
      createdAt: string;
    };
  }>;
}

interface WorkflowsBodyProps {
  workflows: Workflow[];
  onDelete?: (id: string) => void;
  onToggle?: (id: string, isActive: boolean) => void;
}

const WorkflowCard = memo(
  ({
    workflow,
    onDelete,
    onToggle,
  }: {
    workflow: Workflow;
    onDelete?: (id: string) => void;
    onToggle?: (id: string, isActive: boolean) => void;
  }) => {
    const { showToast } = useToast();

    const handleDelete = async (id: string) => {
      try {
        await api.delete(`/workflow/${id}`);
        showToast("Area deleted successfully", "success");
        onDelete?.(id);
      } catch (err) {
        if (err instanceof AxiosError) {
          showToast(
            err.response?.data?.message || "Failed to delete area",
            "error",
          );
        } else {
          showToast("Failed to delete area", "error");
        }
      }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
      try {
        await api.patch(`/workflow/${id}/toggle`, {
          isActive: !currentStatus,
        });
        showToast(
          `Area ${!currentStatus ? "activated" : "deactivated"} successfully`,
          "success",
        );
        onToggle?.(id, !currentStatus);
      } catch (err) {
        if (err instanceof AxiosError) {
          showToast(
            err.response?.data?.message || "Failed to update workflow status",
            "error",
          );
        } else {
          showToast("Failed to update workflow status", "error");
        }
      }
    };

    return (
      <Card shadow="small" hover="all">
        <CardHeader
          className={`bg-gradient-to-r ${getServiceGradient(
            workflow.activeActions[0].service.name,
            "from",
          )} ${getServiceGradient(workflow.activeReactions[0].service.name, "to")} rounded-none border-0 p-6`}
        >
          <div className="flex items-start justify-between">
            <Text variant="h3" className="text-gray-800">
              {workflow.name.length > 0
                ? workflow.name.charAt(0).toUpperCase() + workflow.name.slice(1)
                : "Untitled Area"}
            </Text>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleToggle(workflow.id, workflow.isActive)}
                className={`rounded-full border-b-0 border-black p-2 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                  workflow.isActive
                    ? "text-green-500 hover:text-green-600 focus-visible:text-green-600"
                    : "text-gray-700 hover:text-gray-800 focus-visible:text-gray-800"
                }`}
                title={workflow.isActive ? "Deactivate area" : "Activate area"}
              >
                <Power className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(workflow.id)}
                className="rounded-full border-b-0 border-black p-2 text-gray-800 duration-200 hover:text-red-500 focus-visible:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
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
                <PlayCircle className="h-5 w-5 text-gray-800" />
                Actions
              </Text>
              <ul className="ml-4 space-y-2 rounded-lg bg-gray-100 p-2">
                {workflow.activeActions && workflow.activeActions.length > 0 ? (
                  workflow.activeActions.map((action) => (
                    <li
                      key={action.id}
                      className="flex items-center gap-2 text-gray-800"
                    >
                      {getServiceIcon(action.service.name)}
                      <Text>{formatActionReactionName(action.name)}</Text>
                      <Text variant="caption">({action.service.name})</Text>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2 text-gray-800">
                    <Ghost className="h-4 w-4 text-gray-800" />
                    <Text variant="caption" color="red" className="opacity-75">
                      No actions have been added yet
                    </Text>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <Text variant="h4" className="mb-3 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-gray-800" />
                Reactions
              </Text>
              <ul className="ml-4 space-y-2 rounded-lg bg-gray-100 p-2">
                {workflow.activeReactions &&
                workflow.activeReactions.length > 0 ? (
                  workflow.activeReactions.map((reaction) => (
                    <li
                      key={reaction.id}
                      className="flex items-center gap-2 text-gray-800"
                    >
                      {getServiceIcon(reaction.service.name)}
                      <Text>{formatActionReactionName(reaction.name)}</Text>
                      <Text variant="caption">({reaction.service.name})</Text>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2 text-gray-800">
                    <Ghost className="h-4 w-4 text-gray-800" />
                    <Text variant="caption" color="red" className="opacity-75">
                      No reactions have been added yet
                    </Text>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

WorkflowCard.displayName = "WorkflowCard";

export default function WorkflowsBody({
  workflows,
  onDelete,
  onToggle,
}: WorkflowsBodyProps) {
  if (!workflows.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-gray-200 bg-white">
        <div className="text-center">
          <Ghost className="mx-auto mb-4 h-12 w-12 text-gray-700" />
          <Text variant="h3" className="mb-2">
            No Areas Found
          </Text>
          <Text color="gray">Create your first area to get started</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
