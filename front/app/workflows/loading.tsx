"use client";

export default function WorkflowsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-gray-200 bg-white"
        >
          <div className="space-y-4 p-6">
            <div className="flex items-start justify-between">
              <div className="h-8 w-48 rounded-lg bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="h-8 w-8 rounded-full bg-gray-200" />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-gray-200" />
                  <div className="h-5 w-20 rounded bg-gray-200" />
                </div>
                <div className="ml-4 space-y-2 rounded-lg bg-gray-100 p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gray-200" />
                    <div className="h-4 w-32 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-gray-200" />
                  <div className="h-5 w-20 rounded bg-gray-200" />
                </div>
                <div className="ml-4 space-y-2 rounded-lg bg-gray-100 p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gray-200" />
                    <div className="h-4 w-32 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
