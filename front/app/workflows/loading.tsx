export default function WorkflowsLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 rounded-lg border p-6">
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
