"use client";
import { addTask } from "../actions";

export function Form() {
  return (
    <form action={addTask} className="rounded-xl border p-4 space-y-3">
      <input
        name="name"
        placeholder="e.g Task.."
        className="w-full rounded-lg border px-3 py-2"
      />
      <button className="rounded-lg border px-3 py-2 hover:bg-black hover:text-white active:bg-red-700 transition-colors">
        Add
      </button>
    </form>
  );
}
