"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { User, AtSign, Trash2 } from "lucide-react";
import Cookies from "js-cookie";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth?redirect=/profile");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      const token = Cookies.get("auth-token");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete account");
      }

      await logout();
      showToast("Your account has been successfully deleted", "success");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast("Failed to delete account. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="p-8">
        <div className="mb-8 text-center">
          <Text variant="h1" className="mb-2">
            Profile
          </Text>
          <Text variant="small" color="gray">
            Manage your account settings
          </Text>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <User className="h-6 w-6 text-gray-400" />
            <div>
              <Text variant="small" color="gray">
                Name
              </Text>
              <Text>{user.name}</Text>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <AtSign className="h-6 w-6 text-gray-400" />
            <div>
              <Text variant="small" color="gray">
                Email
              </Text>
              <Text>{user.email}</Text>
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            <div className="rounded-lg bg-red-50 p-4">
              <Text variant="h3" className="mb-2">
                Danger Zone
              </Text>
              <Text variant="small" color="gray" className="mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </Text>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                isLoading={isDeleting}
                className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <Text color="white">Delete Account</Text>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
