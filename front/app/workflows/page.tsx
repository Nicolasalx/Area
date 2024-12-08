"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Text from "@/components/ui/Text";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import WorkflowsBody from "./components/WorkflowsBody";
import WorkflowsLoading from "./loading";

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

export default function WorkflowsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!user?.id || !token) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/workflow/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 404) {
          setWorkflows([]);
          return;
        }

        if (!response.ok) {
          const errorData = await response.text();
          console.error("API Error:", {
            status: response.status,
            statusText: response.statusText,
            data: errorData,
          });
          throw new Error(
            `Failed to fetch workflows: ${response.status} ${response.statusText}`,
          );
        }
        const data = await response.json();
        console.log("Workflows fetched:", data);
        setWorkflows(data.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch workflows",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) {
      fetchWorkflows();
    }
  }, [user, token, authLoading, router]);

  const handleDelete = (id: number) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.filter((workflow) => workflow.id !== id),
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
        <div className="flex min-h-screen items-center justify-center text-red-500">
          {error}
        </div>
      ) : (
        <WorkflowsBody workflows={workflows} onDelete={handleDelete} />
      )}
    </div>
  );
}
