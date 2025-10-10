/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { __mock } from "@/lib/supabase/server";
import { createNote, deleteNote } from "../actions";
import { revalidatePath } from "next/cache";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { store } = vi.hoisted(() => ({
  store: {
    insertError: null as any,
    deleteError: null as any,
    calls: {
      inserts: [] as Array<{ table: string; payload: any }>,
      deletes: [] as Array<{ table: string; where: Record<string, any> }>,
    },
    reset() {
      this.insertError = null;
      this.deleteError = null;
      this.calls.inserts = [];
      this.calls.deletes = [];
    },
  },
}));

vi.mock("@/lib/supabase/server", () => {
  const createClient = vi.fn(async () => {
    return {
      from: vi.fn((table: string) => ({
        insert: vi.fn(async (payload: any) => {
          store.calls.inserts.push({ table, payload });
          return { error: store.insertError };
        }),
        delete: vi.fn(() => ({
          eq: vi.fn(async (col: string, val: any) => {
            store.calls.deletes.push({ table, where: { [col]: val } });
            return { error: store.deleteError };
          }),
        })),
      })),
    };
  });

  const __mock = {
    setInsertError(e: any) {
      store.insertError = e;
    },
    setDeleteError(e: any) {
      store.deleteError = e;
    },
    getCalls() {
      return store.calls;
    },
    reset() {
      store.reset();
    },
  };

  return { createClient, __mock };
});


describe("notes/actions", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    __mock.reset();
  });

  describe("createNote", () => {
    it("throws when title is empty", async () => {
      const fd = new FormData();
      fd.set("title", "   ");
      await expect(createNote(fd)).rejects.toThrow("Title is required");
      expect(__mock.getCalls().inserts).toHaveLength(0);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("inserts note and revalidates /notes", async () => {
      const fd = new FormData();
      fd.set("title", "My note");
      await expect(createNote(fd)).resolves.toBeUndefined();

      const calls = __mock.getCalls().inserts;
      expect(calls).toHaveLength(1);
      expect(calls[0]).toEqual({ table: "notes", payload: { title: "My note" } });

      expect(revalidatePath).toHaveBeenCalledWith("/notes");
    });

    it("propagates supabase error", async () => {
      __mock.setInsertError(new Error("insert failed"));
      const fd = new FormData();
      fd.set("title", "X");
      await expect(createNote(fd)).rejects.toThrow("insert failed");
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("deleteNote", () => {
    it("throws when id is not a number", async () => {
      const fd = new FormData();
      fd.set("id", "abc");
      await expect(deleteNote(fd)).rejects.toThrow("Invalid id");
      expect(__mock.getCalls().deletes).toHaveLength(0);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("deletes note by id and revalidates", async () => {
      const fd = new FormData();
      fd.set("id", "42");
      await expect(deleteNote(fd)).resolves.toBeUndefined();

      const calls = __mock.getCalls().deletes;
      expect(calls).toHaveLength(1);
      expect(calls[0]).toEqual({ table: "notes", where: { id: 42 } });

      expect(revalidatePath).toHaveBeenCalledWith("/notes");
    });

    it("propagates supabase error on delete", async () => {
      __mock.setDeleteError(new Error("delete failed"));
      const fd = new FormData();
      fd.set("id", "1");
      await expect(deleteNote(fd)).rejects.toThrow("delete failed");
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});
