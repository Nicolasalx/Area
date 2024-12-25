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
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      router.push("/auth?redirect=/profile");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleDeleteAccount = async () => {
    if (!confirm(t("profile.deleteAccountConfirmation"))) {
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
        throw new Error(error.message || t("profile.deleteAccountFailed"));
      }

      await logout();
      showToast(t("profile.accountDeleted"), "success");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast(t("profile.deleteAccountFailed"), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="p-8">
        <div className="mb-8 text-center">
          <Text variant="h1" className="mb-2">
            {t("profile.profile")}
          </Text>
          <Text variant="small" color="gray">
            {t("profile.manageAccount")}
          </Text>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <User className="h-6 w-6 text-gray-400" />
            <div>
              <Text variant="small" color="gray">
                {t("profile.name")}
              </Text>
              <Text>{user.name}</Text>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <AtSign className="h-6 w-6 text-gray-400" />
            <div>
              <Text variant="small" color="gray">
                {t("profile.email")}
              </Text>
              <Text>{user.email}</Text>
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            <div className="rounded-lg bg-red-50 p-4">
              <Text variant="h3" className="mb-2">
                {t("profile.dangerZone")}
              </Text>
              <Text variant="small" color="gray" className="mb-4">
                {t("profile.deleteAccountWarning")}
              </Text>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                isLoading={isDeleting}
                className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <Text color="white">{t("profile.deleteAccount")}</Text>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
