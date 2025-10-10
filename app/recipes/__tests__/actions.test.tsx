/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

const { store } = vi.hoisted(() => ({
  store: {
    op: "ok" as "ok" | "insert_error" | "update_error" | "delete_error",
    last: {
      table: "" as string,
      payload: null as any,
      eq: null as { column: string; value: any } | null,
    },
  },
}));

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
  };
});

vi.mock("@/lib/supabase/server", () => {
  const fromSpy = vi.fn((table: string) => {
    store.last.table = table;

    const insert = vi.fn(async (payload: any) => {
      store.last.payload = payload;
      if (store.op === "insert_error") return { error: { message: "insert failed" } };
      return { error: null };
    });

    const update = vi.fn((_payload: any) => {
      store.last.payload = _payload;
      return {
        eq: vi.fn(async (column: string, value: any) => {
          store.last.eq = { column, value };
          if (store.op === "update_error") return { error: { message: "update failed" } };
          return { error: null };
        }),
      };
    });

    const _delete = vi.fn(() => {
      return {
        eq: vi.fn(async (column: string, value: any) => {
          store.last.eq = { column, value };
          if (store.op === "delete_error") return { error: { message: "delete failed" } };
          return { error: null };
        }),
      };
    });

    return { insert, update, delete: _delete };
  });

  const createClient = vi.fn(async () => ({
    from: fromSpy,
  }));

  return { createClient, __spies: { fromSpy } };
});

import { revalidatePath } from "next/cache";
import { addRecipe, deleteRecipe, updateRecipe } from "../actions";

describe("recipes/actions", () => {
  beforeEach(() => {
    store.op = "ok";
    store.last = { table: "", payload: null, eq: null };
    vi.clearAllMocks();
  });

  describe("addRecipe", () => {
    it("returns early when any required field is empty", async () => {
      const fd = new FormData();
      fd.set("title", "   ");
      fd.set("ingredients", "flour, water");
      fd.set("instruction", "mix and bake");
      await expect(addRecipe(fd)).resolves.toBeUndefined();
      expect((revalidatePath as any).mock.calls.length).toBe(0);
    });

    it("inserts title, ingredients, instruction and revalidates", async () => {
      const fd = new FormData();
      fd.set("title", "Bread");
      fd.set("ingredients", "flour, water, yeast, salt");
      fd.set("instruction", "mix, proof, bake");
      await addRecipe(fd);
      expect(store.last.table).toBe("recipe");
      expect(store.last.payload.title).toBe("Bread");
      expect(store.last.payload.ingredients).toBe("flour, water, yeast, salt");
      expect(store.last.payload.instruction).toBe("mix, proof, bake");
      expect(typeof store.last.payload.created_at).toBe("string");
      expect(revalidatePath).toHaveBeenCalledWith("/recipes");
    });

    it("propagates insert error", async () => {
      store.op = "insert_error";
      const fd = new FormData();
      fd.set("title", "X");
      fd.set("ingredients", "Y");
      fd.set("instruction", "Z");
      await expect(addRecipe(fd)).rejects.toThrow("insert failed");
    });
  });

  describe("deleteRecipe", () => {
    it("returns early when id is missing or 0", async () => {
      const fd = new FormData();
      await expect(deleteRecipe(fd)).resolves.toBeUndefined();
      expect((revalidatePath as any).mock.calls.length).toBe(0);
    });

    it("deletes row by id and revalidates", async () => {
      const fd = new FormData();
      fd.set("id", "9");
      await deleteRecipe(fd);
      expect(store.last.table).toBe("recipe");
      expect(store.last.eq).toEqual({ column: "id", value: 9 });
      expect(revalidatePath).toHaveBeenCalledWith("/recipes");
    });

    it("propagates delete error", async () => {
      store.op = "delete_error";
      const fd = new FormData();
      fd.set("id", "3");
      await expect(deleteRecipe(fd)).rejects.toThrow("delete failed");
    });
  });

  describe("updateRecipe", () => {
    it("returns early when id missing or any required field empty", async () => {
      const fd = new FormData();
      fd.set("id", "1");
      fd.set("title", "Bread");
      fd.set("ingredients", "   ");
      fd.set("instruction", "bake");
      await expect(updateRecipe(fd)).resolves.toBeUndefined();
      expect((revalidatePath as any).mock.calls.length).toBe(0);
    });

    it("updates title by id and revalidates", async () => {
      const fd = new FormData();
      fd.set("id", "12");
      fd.set("title", "Sourdough");
      fd.set("ingredients", "flour, water, starter, salt");
      fd.set("instruction", "mix, bulk, shape, proof, bake");
      await updateRecipe(fd);
      expect(store.last.table).toBe("recipe");
      expect(store.last.payload).toEqual({ title: "Sourdough" });
      expect(store.last.eq).toEqual({ column: "id", value: 12 });
      expect(revalidatePath).toHaveBeenCalledWith("/recipes");
    });

    it("propagates update error", async () => {
      store.op = "update_error";
      const fd = new FormData();
      fd.set("id", "5");
      fd.set("title", "X");
      fd.set("ingredients", "Y");
      fd.set("instruction", "Z");
      await expect(updateRecipe(fd)).rejects.toThrow("update failed");
    });
  });
});
