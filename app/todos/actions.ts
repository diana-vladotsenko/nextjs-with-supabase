"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTask(formData: FormData) {
  try {
    const name = String(formData.get("name") ?? "").trim();
    
    if (!name) return;

    const supabase = await createClient();
    const { error } = await supabase.from("tasks").insert({ name: name , is_done: false});

    if (error) throw new Error(error.message);

    revalidatePath("/todos");
  } catch (err) {
    throw err;
  }
}

export async function completeTask(formData: FormData) {
  try {
    const id = Number(formData.get("id") ?? "");

    if (!id) return;

    const supabase = await createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ is_done: true })
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/todos");
  } catch (err) {
    throw err;
  }
}

export async function deleteTask(formData: FormData) {
  try {
    const id = Number(formData.get("id") ?? "");
    if (!id) return;
    
    const supabase = await createClient();
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/todos");
  } catch (err) {
    throw err;
  }
}

export async function updateTask(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();

  if (!id || !name) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ name })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/todos");
}