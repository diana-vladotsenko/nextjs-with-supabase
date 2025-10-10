import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Recipe } from "@/types/Recipe";

export default async function Page() {
  const supabase = await createClient();
  const { data: recipes, error } = await supabase
    .from("recipe")
    .select()
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  const list = (recipes ?? []) as Recipe[];

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">Recipes</h1>
        <p className="text-neutral-500">A collection of your favorite meals</p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-2">Add new</h2>
        <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-neutral-400 text-sm text-center"></div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          All recipes <span className="text-neutral-500">({list.length})</span>
        </h2>

        {list.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">No recipes yet.</p>
        ) : (
          <ul className="space-y-4">
            {list.map((r) => (
              <li
                key={r.id}
                className="border border-neutral-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-neutral-900">
                      {r.title}
                    </h3>

                    <div className="text-xs text-neutral-400">
                      Added on{": "}
                      {new Date(r.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {r.ingredients && (
                      <p className="text-sm text-neutral-700">
                        <span className="font-medium text-neutral-800">
                          Ingredients:
                        </span>{" "}
                        {r.ingredients}
                      </p>
                    )}

                    {r.instruction && (
                      <p className="text-sm text-neutral-700">
                        <span className="font-medium text-neutral-800">
                          Instructions:
                        </span>{" "}
                        {r.instruction}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <form>
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center
                      rounded-full border border-red-300 
                      px-8 py-2 text-xs font-medium
                      text-red-600 bg-white
                      transition-colors
                      hover:bg-red-600 hover:text-white hover:border-red-600
                      active:bg-red-700
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-sm"
                      >
                        Delete
                      </button>
                    </form>
                    <form>
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center
                      rounded-full border border-blue-300 
                      px-8 py-2 text-xs font-medium
                      text-blue-600 bg-white
                      transition-colors
                      hover:bg-blue-600 hover:text-white hover:border-blue-600
                      active:bg-blue-700
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-sm"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
