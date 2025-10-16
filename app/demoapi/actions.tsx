"use server";

import { Cat } from "@/types/Cat";

export async function fetchCats() {
  const res = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=10",
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch cats");
  const data: Cat[] = await res.json();
  return data;
}
