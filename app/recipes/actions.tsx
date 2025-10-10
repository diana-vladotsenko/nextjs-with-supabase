"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addRecipe(fd: FormData) {
  try {
    const title = String(fd.get("title") || "").trim();
    const ingredients = String(fd.get("ingredients") || "").trim();
    const instruction = String(fd.get("instruction") || "").trim();

    if (!title || !ingredients || !instruction) return;

    const supabase = await createClient();
    const { error } = await supabase.from("recipe").insert({
      title: title,
      ingredients: ingredients,
      instruction: instruction,
      created_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);
    revalidatePath("/recipes");
  } catch (err) {
    throw err;
  }
}

export async function deleteRecipe(fd: FormData) {
  try {
    const id = Number(fd.get("id") ?? "");

    if (!id) return;

    const supabase = await createClient();
    const { error } = await supabase.from("recipe").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/recipes");
  } catch (err) {
    throw err;
  }
}

export async function updateRecipe(fd: FormData) {
  try {
    const id = Number(fd.get("id"));
    const title = String(fd.get("title") || "").trim();
    const ingredients = String(fd.get("ingredients") || "").trim();
    const instruction = String(fd.get("instruction") || "").trim();

    if (!id || !title || !ingredients || !instruction) return;

    const supabase = await createClient();
    const { error } = await supabase
      .from("recipe")
      .update({ title })
      .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/recipes");
  } catch (err) {
    throw err;
  }
}
