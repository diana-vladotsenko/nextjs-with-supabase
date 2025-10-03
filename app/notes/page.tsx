import { createClient } from "@/lib/supabase/server";
import { deleteNote, createNote } from "./actions";

type Note = {
  id: number;
  title: string;
};

async function getNotes(): Promise<Note[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("notes").select().order("id");
  if (error) throw error;
  return (data ?? []) as Note[];
}

export default async function Page() {
  const notes = await getNotes();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Notes</h1>

      <form action={createNote} className="rounded-xl border p-4 space-y-3">
        <input
          name="title"
          placeholder="Note description.."
          className="w-full rounded-lg border px-3 py-2"
        />
        <button className="rounded-lg border px-3 py-2 hover:bg-black hover:text-white active:bg-red-700">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {notes.map((n) => (
          <li
            key={n.id}
            className="rounded-xl border p-4 flex items-center justify-between"
          >
            <span className="font-medium">{n.title}</span>
            <form action={deleteNote}>
              <input type="hidden" name="id" value={n.id} />
              <button className="rounded-lg border px-3 py-1 text-sm border-red-200 text-red-600 hover:border-transparent hover:bg-red-600 hover:text-white active:bg-red-700 ...">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
