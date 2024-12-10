"use client";

import { useAuth } from "@/contexts/AuthContext";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { LogOut, LogIn } from "lucide-react";

export default function Page() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Text>Loading...</Text>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Text variant="h2" className="text-center">
            Authentication Status
          </Text>
        </Card.Header>

        <Card.Body className="space-y-4">
          {user ? (
            <>
              <div className="space-y-2">
                <Text weight="medium">Welcome!</Text>
                <Text>You are logged in as:</Text>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="space-y-1">
                    <Text>
                      <span className="font-medium">Email:</span> {user.email}
                    </Text>
                    {user.name && (
                      <Text>
                        <span className="font-medium">Name:</span> {user.name}
                      </Text>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => logout()}
                className="w-full"
                leftIcon={<LogOut className="h-5 w-5" />}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Text>You are not logged in.</Text>
              <Button
                onClick={() => router.push("/auth")}
                className="w-full"
                leftIcon={<LogIn className="h-5 w-5" />}
              >
                Sign In
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
