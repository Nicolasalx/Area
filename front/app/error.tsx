"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useToast } from "@/contexts/ToastContext";
import { RefreshCcw } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { showToast } = useToast();
  const { t } = useTranslation("error");

  useEffect(() => {
    console.error(error);

    showToast(t("unexpected_error"), "error");
  }, [error, showToast, t]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="text-center">
        <Text variant="h1" className="mb-2 text-6xl font-bold">
          {t("oops")}
        </Text>
        <Text variant="h2" className="mb-4">
          {t("something_wrong")}
        </Text>
        <Text color="gray" className="mb-8">
          {t("dont_worry")}
        </Text>
        <Button onClick={reset} leftIcon={<RefreshCcw className="h-5 w-5" />}>
          {t("try_again")}
        </Button>
      </div>
    </div>
  );
}
