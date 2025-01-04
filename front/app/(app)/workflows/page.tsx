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
  const { user } = useAuth();
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheData = (key: string, data: unknown) => {
    sessionStorage.setItem(key, JSON.stringify(data));
  };

  const getCachedData = <T,>(key: string): T | null => {
    const data = sessionStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  };

  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!user?.id) return;

      try {
        const cachedWorkflows = getCachedData<Workflow[]>(
          `workflows-${user.id}`,
        );
        if (cachedWorkflows) {
          setWorkflows(cachedWorkflows);
          setLoading(false);
        }

        const response = await api.get<WorkflowResponse>(
          `/workflow/${user.id}`,
        );

        if (Array.isArray(response.data.data)) {
          setWorkflows(response.data.data);
          cacheData(`workflows-${user.id}`, response.data.data);
        } else {
          setWorkflows([]);
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
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
  }, [user?.id]);

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
    <div className="mx-4 py-8">
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
