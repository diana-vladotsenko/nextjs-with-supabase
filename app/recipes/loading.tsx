import React from "react";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 animate-pulse">
      <div className="h-6 w-40 rounded bg-neutral-200" />

      <div className="space-y-2">
        <div className="h-10 w-full rounded bg-neutral-200" />
        <div className="h-10 w-full rounded bg-neutral-200" />
        <div className="h-20 w-full rounded bg-neutral-200" />
        <div className="h-8 w-24 rounded bg-neutral-200" />
      </div>

      <div className="space-y-3 pt-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-neutral-200" />
        ))}
      </div>
    </div>
  );
}
