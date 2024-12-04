"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useToast } from "@/contexts/ToastContext";
import { RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { showToast } = useToast();

  useEffect(() => {
    console.error(error);

    showToast("An unexpected error occurred. Please try again.", "error");
  }, [error, showToast]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="text-center">
        <Text variant="h1" className="mb-2 text-6xl font-bold">
          Oops!
        </Text>
        <Text variant="h2" className="mb-4">
          Something went wrong
        </Text>
        <Text color="gray" className="mb-8">
          Don&apos;t worry, we&apos;re on it. Please try again.
        </Text>
        <Button onClick={reset} leftIcon={<RefreshCcw className="h-5 w-5" />}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
