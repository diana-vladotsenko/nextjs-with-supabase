"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Recipe } from "@/types/Recipe";
import { updateRecipe } from "../actions";

type RecipeForEdit = Pick<
  Recipe,
  "id" | "title" | "ingredients" | "instruction"
>;

export default function UpdateRecipeModal({
  recipe,
}: {
  recipe: RecipeForEdit;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function submit(fd: FormData) {
    startTransition(async () => {
      await updateRecipe(fd);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-blue-300 px-8 py-2 text-xs font-medium text-blue-600 bg-white transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        Update
      </button>

      {open && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <div className="w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-900">
                Update Recipe
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-neutral-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form action={submit} className="p-5 space-y-3">
              <input type="hidden" name="id" value={recipe.id} />

              <label className="block">
                <span className="block text-sm font-medium text-neutral-700">
                  Title
                </span>
                <input
                  ref={firstFieldRef}
                  name="title"
                  defaultValue={recipe.title}
                  className="mt-1 w-full border border-neutral-300 rounded-md p-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-neutral-700">
                  Ingredients
                </span>
                <input
                  name="ingredients"
                  defaultValue={recipe.ingredients ?? ""}
                  className="mt-1 w-full border border-neutral-300 rounded-md p-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-neutral-700">
                  Instructions
                </span>
                <textarea
                  name="instruction"
                  rows={5}
                  defaultValue={recipe.instruction ?? ""}
                  className="mt-1 w-full border border-neutral-300 rounded-md p-2.5 text-sm text-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                />
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {pending ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
