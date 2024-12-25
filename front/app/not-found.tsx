"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { Home } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation("notFound");

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="text-center">
        <Text variant="h1" className="mb-2 text-9xl font-bold">
          404
        </Text>
        <Text variant="h2" className="mb-4">
          {t("page_not_found")}
        </Text>
        <Text color="gray" className="mb-8">
          {t("page_not_found_description")}
        </Text>
        <Button
          onClick={() => router.push("/")}
          leftIcon={<Home className="h-5 w-5" />}
        >
          {t("return_home")}
        </Button>
      </div>
    </div>
  );
}
