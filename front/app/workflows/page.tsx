"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/Card";
import CardHeader from "@/components/ui/Card";
import CardTitle from "@/components/ui/Card";

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
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }

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

        if (!response.ok) {
          throw new Error("Failed to fetch workflows");
        }
        const data = await response.json();
        setWorkflows(data.data);
      } catch (err) {
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

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading workflows...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">My Workflows</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>{workflow.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Actions:</h3>
                  <ul className="list-inside list-disc">
                    {workflow.actions.map((action) => (
                      <li key={action.id}>
                        {action.name} ({action.service.name})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Reactions:</h3>
                  <ul className="list-inside list-disc">
                    {workflow.reactions.map((reaction) => (
                      <li key={reaction.id}>
                        {reaction.name} ({reaction.service.name})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
