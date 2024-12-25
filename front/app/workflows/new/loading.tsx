"use client";

import Card from "@/components/ui/Card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTranslation } from "next-i18next";

export default function Loading() {
  const { t } = useTranslation("loading");

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-gray-50">
      {/* Fixed Header */}
      <div className="container mx-auto flex-none p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-1 w-16 animate-pulse rounded-full bg-gray-200" />
                </div>
                {step < 3 && <div className="w-1" />}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 h-6 w-64 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <Card className="mx-auto w-full max-w-2xl">
            <Card.Header className="p-6">
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            </Card.Header>
            <Card.Body className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="space-y-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4">
                <Button
                  disabled
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("back")}
                </Button>
                <Button
                  disabled
                  className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-200"
                >
                  {t("next")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-none border-t border-gray-100 bg-white p-4">
        <div className="container mx-auto flex items-center justify-between px-8">
          <Button
            disabled
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back")}
          </Button>
          <Button
            disabled
            className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-200"
          >
            {t("next")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
