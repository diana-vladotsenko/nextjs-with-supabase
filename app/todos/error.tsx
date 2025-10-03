"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <p className="text-red-600">Something went wrong: {error.message}</p>
      <button onClick={reset} className="mt-3 rounded-lg border px-3 py-1">
        Try again
      </button>
    </div>
  );
}
