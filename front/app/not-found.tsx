"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="text-center">
        <Text variant="h1" className="mb-2 text-9xl font-bold">
          404
        </Text>
        <Text variant="h2" className="mb-4">
          Page Not Found
        </Text>
        <Text color="gray" className="mb-8">
          We couldn&apos;t find the page you&apos;re looking for.
        </Text>
        <Button
          onClick={() => router.push("/workflows")}
          leftIcon={<Home className="h-5 w-5" />}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
