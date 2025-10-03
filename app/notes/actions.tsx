"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required");

  const { error } = await supabase.from("notes").insert({ title });
  if (error) throw error;

  revalidatePath("/notes");
}

export async function deleteNote(formData: FormData) {
  const supabase = await createClient();
  const idStr = String(formData.get("id") || "");
  const id = Number(idStr);
  if (!Number.isFinite(id)) throw new Error("Invalid id");

  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/notes");
}
