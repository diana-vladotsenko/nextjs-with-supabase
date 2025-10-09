"use client";

import { useState, useTransition } from "react";
import { updateTask } from "@/app/todos/actions";
import { useRouter } from "next/navigation";

export default function UpdateTaskForm({
  id,
  currentName,
}: {
  id: number;
  currentName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await updateTask(formData); 
      router.refresh();
      setIsOpen(false);
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Update Task</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={id} />
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Task name"
                className="rounded-lg border px-3 py-2 text-sm"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setName(currentName);
                  }}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || name.trim().length === 0}
                  className="rounded-full border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 bg-white hover:bg-blue-600 hover:text-white disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-700 hover:text-white shadow-sm"
      >
        Update
      </button>
    </>
  );
}
