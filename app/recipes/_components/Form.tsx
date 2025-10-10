"use client";
import { useState } from "react";
import { addRecipe } from "../actions";

export function Form() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const ingredients = String(formData.get("ingredients") || "").trim();
    const instruction = String(formData.get("instruction") || "").trim();

    if (!title || !ingredients || !instruction) {
      setError("All fields are required.");
      return;
    }
    setError("");
    await addRecipe(formData);
  }

  return (
    <section className="w-full space-y-4">
      <h2 className="text-lg font-semibold text-neutral-800">Add Recipe</h2>
      <form action={handleSubmit} className="bg-white border border-neutral-200 rounded-lg shadow-sm p-5 space-y-3 max-w-xl mx-auto">
        <input
          name="title"
          placeholder="Recipe title"
          className="w-full border border-neutral-300 rounded-md p-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
        />

        <input
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          className="w-full border border-neutral-300 rounded-md p-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
        />

        <textarea
          name="instruction"
          placeholder="Instructions..."
          rows={3}
          className="w-full border border-neutral-300 rounded-md p-2.5 text-sm text-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
        />

        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-md transition-colors shadow-sm"
        >
          Add Recipe
        </button>
      </form>
    </section>
  );
}
