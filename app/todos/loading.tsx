// app/(todos)/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-40 rounded bg-neutral-200" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-32 rounded-xl bg-neutral-200" />
        <div className="h-32 rounded-xl bg-neutral-200" />
      </div>
    </div>
  );
}
