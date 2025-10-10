/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

const { store } = vi.hoisted(() => ({
  store: {
    op: "ok" as
      | "ok"
      | "insert_error"
      | "update_error"
      | "delete_error",
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
import { addTask, completeTask, deleteTask, updateTask } from "../actions";

describe("todos/actions", () => {
  beforeEach(() => {
    store.op = "ok";
    store.last = { table: "", payload: null, eq: null };
    vi.clearAllMocks();
  });

  describe("addTask", () => {
    it("returns early when name is empty", async () => {
      const fd = new FormData();
      fd.set("name", "   ");
      await expect(addTask(fd)).resolves.toBeUndefined();
      expect((revalidatePath as any).mock.calls.length).toBe(0);
    });

    it("inserts task name and revalidates", async () => {
      const fd = new FormData();
      fd.set("name", "Build CI");
      await addTask(fd);
      expect(store.last.table).toBe("tasks");
      expect(store.last.payload).toEqual({ name: "Build CI", is_done: false });
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
    });

    it("propagates insert error", async () => {
      store.op = "insert_error";
      const fd = new FormData();
      fd.set("name", "X");
      await expect(addTask(fd)).rejects.toThrow("insert failed");
    });
  });

  describe("completeTask", () => {
    it("returns early when id is missing or 0", async () => {
      const fd = new FormData();
      await expect(completeTask(fd)).resolves.toBeUndefined();
      expect((revalidatePath as any).mock.calls.length).toBe(0);
    });

    it("updates is_done true for id and revalidates", async () => {
      const fd = new FormData();
      fd.set("id", "42");
      await completeTask(fd);
      expect(store.last.table).toBe("tasks");
      expect(store.last.payload).toEqual({ is_done: true });
      expect(store.last.eq).toEqual({ column: "id", value: 42 });
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
    });

    it("propagates update error", async () => {
      store.op = "update_error";
      const fd = new FormData();
      fd.set("id", "7");
      await expect(completeTask(fd)).rejects.toThrow("update failed");
    });
  });

  describe("deleteTask", () => {
    it("returns early when id is missing or 0", async () => {
      const fd = new FormData();
      await expect(deleteTask(fd)).resolves.toBeUndefined();
      expect((revalidatePath as any).mock.calls.length).toBe(0);
    });

    it("deletes row by id and revalidates", async () => {
      const fd = new FormData();
      fd.set("id", "9");
      await deleteTask(fd);
      expect(store.last.table).toBe("tasks");
      expect(store.last.eq).toEqual({ column: "id", value: 9 });
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
    });

    it("propagates delete error", async () => {
      store.op = "delete_error";
      const fd = new FormData();
      fd.set("id", "3");
      await expect(deleteTask(fd)).rejects.toThrow("delete failed");
    });
  });

  describe("updateTask", () => {
    it("returns early when id missing or name empty", async () => {
      const fd = new FormData();
      fd.set("id", "1");
      fd.set("name", "   ");
      await expect(updateTask(fd)).resolves.toBeUndefined();
      expect((revalidatePath as any).mock.calls.length).toBe(0);
    });

    it("updates name by id and revalidates", async () => {
      const fd = new FormData();
      fd.set("id", "12");
      fd.set("name", "Rename me");
      await updateTask(fd);
      expect(store.last.table).toBe("tasks");
      expect(store.last.payload).toEqual({ name: "Rename me" });
      expect(store.last.eq).toEqual({ column: "id", value: 12 });
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
    });

    it("propagates update error", async () => {
      store.op = "update_error";
      const fd = new FormData();
      fd.set("id", "5");
      fd.set("name", "X");
      await expect(updateTask(fd)).rejects.toThrow("update failed");
    });
  });
});
