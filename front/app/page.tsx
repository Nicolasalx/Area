"use client";

import { useAuth } from "@/contexts/AuthContext";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { LogOut, LogIn } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function Page() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Text>{t("login.loading")}</Text>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Text variant="h2" className="text-center">
            {t("login.authentication_status")}
          </Text>
        </Card.Header>

        <Card.Body className="space-y-4">
          {user ? (
            <>
              <div className="space-y-2">
                <Text weight="medium">{t("login.welcome")}</Text>
                <Text>{t("login.logged_in_as")}</Text>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="space-y-1">
                    <Text>
                      <span className="font-medium">{t("login.email")}:</span>{" "}
                      {user.email}
                    </Text>
                    {user.name && (
                      <Text>
                        <span className="font-medium">{t("login.name")}:</span>{" "}
                        {user.name}
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
                {t("login.sign_out")}
              </Button>
            </>
          ) : (
            <>
              <Text>{t("login.not_logged_in")}</Text>
              <Button
                onClick={() => router.push("/auth")}
                className="w-full"
                leftIcon={<LogIn className="h-5 w-5" />}
              >
                {t("login.sign_in")}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
