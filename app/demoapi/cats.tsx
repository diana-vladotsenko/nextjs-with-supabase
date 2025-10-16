"use client";
/* eslint-disable @next/next/no-img-element */
import { fetchCats } from "./actions";
import type { Cat } from "../../types/Cat";
import { useEffect, useState } from "react";

export default function Cats() {
  const [cats, setCats] = useState<Cat[] | null>(null);

  const handleFetch = async () => {
    const data = await fetchCats();
    setCats(data);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center">
      api result:
      <button
        className="rounded-lg border px-3 py-2 hover:bg-black hover:text-white active:bg-green-700"
        onClick={handleFetch}
      >
        Fetch Cats
      </button>
      {cats && (
        <>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cats.map((c) => (
              <li key={c.id} className="border rounded-lg p-2">
                <img
                  src={c.url}
                  alt={`cat ${c.id}`}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="text-xs mt-1 opacity-70">
                  {c.width}×{c.height}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
