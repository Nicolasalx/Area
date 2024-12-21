"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Text from "@/components/ui/Text";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import WorkflowsBody from "./components/WorkflowsBody";
import WorkflowsLoading from "./loading";
import api from "@/lib/api";
import { AxiosError } from "axios";

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

interface WorkflowResponse {
  message: string;
  data: Workflow[];
}

export default function WorkflowsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!user?.id) return;

      try {
        console.log("Fetching workflows for user:", user.id);
        console.log("API base URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

        const response = await api.get<WorkflowResponse>(
          `/workflow/${user.id}`,
        );
        console.log("Workflows response:", response);

        if (Array.isArray(response.data.data)) {
          setWorkflows(response.data.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setWorkflows([]);
        }
      } catch (err) {
        console.error("Fetch error:", {
          message: err instanceof Error ? err.message : "Unknown error",
          status: err instanceof AxiosError ? err.response?.status : undefined,
          data: err instanceof AxiosError ? err.response?.data : undefined,
          config:
            err instanceof AxiosError
              ? {
                  url: err.config?.url,
                  baseURL: err.config?.baseURL,
                  headers: err.config?.headers,
                }
              : undefined,
        });

        if (err instanceof AxiosError && err.response?.status === 404) {
          console.log("No workflows found, setting empty array");
          setWorkflows([]);
          return;
        }

        setError(
          err instanceof AxiosError
            ? err.response?.data?.message || err.message
            : err instanceof Error
              ? err.message
              : "Failed to fetch workflows",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchWorkflows();
    }
  }, [user, authLoading, router]);

  const handleDelete = (id: string) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.filter((workflow) => workflow.id !== id),
    );
  };

  const handleToggle = (id: string, isActive: boolean) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.map((workflow) =>
        workflow.id === id ? { ...workflow, isActive } : workflow,
      ),
    );
  };

  return (
    <div className=" mx-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Text variant="h2">My Areas</Text>
        <Button
          onClick={() => router.push("/workflows/new")}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Area
        </Button>
      </div>

      {loading ? (
        <WorkflowsLoading />
      ) : error ? (
        <div className="flex h-full min-h-[300px] items-center justify-center text-red-500">
          {error}
        </div>
      ) : (
        <WorkflowsBody
          workflows={workflows}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
}
