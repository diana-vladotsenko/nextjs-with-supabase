import { createClient } from "@/lib/supabase/server";
import { Form } from "./_components/Form";
import type { Task } from "@/types/task";
import { completeTask, deleteTask } from "./actions";

export const revalidate = 0;

export default async function Page() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("tasks").select();

    if (error) throw new Error(error.message);

    const tasks = (data ?? []) as Task[];
    const completed = tasks.filter((t) => t.is_done);
    const active = tasks.filter((t) => !t.is_done);

    return (
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Your Tasks</h1>
        <Form />

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 rounded-lg border border-line p-5">
          <ul className="space-y-2">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500 ">
              Completed ({completed.length})
            </h2>
            {completed.length === 0 && (
              <li className="rounded-lg border border-dashed p-4 text-sm text-neutral-500">
                No completed tasks yet.
              </li>
            )}
            {completed.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </section>

        <ul className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">
              All tasks ({active.length + tasks.length})
            </h2>
            <h5 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">
              Active ({active.length})
            </h5>
          </div>

          {active.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border p-4 flex items-center justify-between"
            >
              <span className="font-medium">{a.name}</span>
              <div className="flex items-center justify-between">
                <form action={completeTask}>
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    className="inline-flex items-center justify-center
                      rounded-full border border-green-300 
                      px-3 py-1.5 text-xs font-medium
                      text-green-600 bg-white
                      transition-colors
                      hover:bg-green-600 hover:text-white hover:border-green-600
                      active:bg-green-700
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-sm"
                  >
                    Complete
                  </button>
                </form>

                <form action={deleteTask}>
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    className="inline-flex items-center justify-center
                      rounded-full border border-red-300 
                      px-3 py-1.5 text-xs font-medium
                      text-red-600 bg-white
                      transition-colors
                      hover:bg-red-600 hover:text-white hover:border-green-600
                      active:bg-red-700
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-sm"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </main>
    );
  } catch (err) {
    throw err;
  }
}
