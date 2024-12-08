"use client";

import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/Card";
import CardHeader from "@/components/ui/Card";

const WorkflowSkeleton = () => (
  <Card className="group overflow-hidden rounded-xl border border-gray-200 bg-white">
    <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-6">
      <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <WorkflowSkeleton key={index} />
      ))}
    </div>
  );
}
