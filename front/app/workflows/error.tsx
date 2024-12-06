"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function WorkflowsError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold text-red-500">
        Something went wrong!
      </h2>
      <p className="mb-4 text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
