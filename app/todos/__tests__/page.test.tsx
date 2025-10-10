/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";

const { store } = vi.hoisted(() => ({
  store: {
    data: [
      { id: 1, name: "Task A", is_done: false },
      { id: 2, name: "Task B", is_done: true },
    ] as Array<{ id: number; name: string; is_done: boolean }>,
    error: null as Error | null,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("../_components/UpdateModal", () => ({
  default: ({ id }: { id: number }) => <div data-testid={`update-${id}`} />,
}));

vi.mock("@/lib/supabase/server", () => {
  const fromSpy = vi.fn();
  const selectSpy = vi.fn();

  const createClient = vi.fn(async () => ({
    from: fromSpy.mockImplementation((_table: string) => ({
      select: selectSpy.mockImplementation(async () => {
        if (store.error) return { data: null, error: store.error };
        return { data: store.data, error: null };
      }),
    })),
  }));

  const __setTasks = (
    list: Array<{ id: number; name: string; is_done: boolean }>
  ) => {
    store.data = list;
    store.error = null;
  };
  const __setError = (err: Error | null) => {
    store.error = err;
  };

  return {
    createClient,
    __setTasks,
    __setError,
    __spies: { fromSpy, selectSpy },
  };
});

import Page from "../page";
import { __setTasks, __setError, __spies } from "@/lib/supabase/server";

describe("todos/page", () => {
  beforeEach(() => {
    __setTasks([
      { id: 1, name: "Task A", is_done: false },
      { id: 2, name: "Task B", is_done: true },
    ]);
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const ui = await Page();
    expect(ui).toBeTruthy();
    expect(() => render(ui)).not.toThrow();
  });

  it("renders page content (title, sections, counts)", async () => {
    __setTasks([
      { id: 1, name: "Active X", is_done: false },
      { id: 2, name: "Active Y", is_done: false },
      { id: 3, name: "Done Z", is_done: true },
    ]);

    const ui = await Page();
    render(ui);

    expect(
      screen.getByRole("heading", { name: /Your Tasks/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Completed \(1\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /All tasks \(3\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Active \(2\)/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Active X")).toBeInTheDocument();
    expect(screen.getByText("Active Y")).toBeInTheDocument();
    expect(screen.getByText("Done Z")).toBeInTheDocument();
  });

  it("renders empty 'Completed' state when no completed tasks", async () => {
    __setTasks([{ id: 5, name: "Only active", is_done: false }]);
    const ui = await Page();
    render(ui);

    expect(
      screen.getByRole("heading", { name: /Completed \(0\)/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/No completed tasks yet\./i)).toBeInTheDocument();
  });

  it("renders controls for active rows and hidden id inputs", async () => {
    __setTasks([
      { id: 10, name: "A", is_done: false },
      { id: 11, name: "B", is_done: false },
      { id: 12, name: "C", is_done: true },
    ]);

    const ui = await Page();
    render(ui);

    expect(screen.getAllByRole("button", { name: /Complete/i })).toHaveLength(
      2
    );
    expect(screen.getAllByRole("button", { name: /Delete/i })).toHaveLength(2);

    const rowA = screen.getByText("A").closest("li")!;
    const rowB = screen.getByText("B").closest("li")!;
    const hiddenAComplete = within(rowA)
      .getAllByDisplayValue("10")
      .find((el) => el.getAttribute("name") === "id")!;
    const hiddenBComplete = within(rowB)
      .getAllByDisplayValue("11")
      .find((el) => el.getAttribute("name") === "id")!;
    expect(hiddenAComplete).toHaveAttribute("type", "hidden");
    expect(hiddenBComplete).toHaveAttribute("type", "hidden");
  });

  it("calls Supabase pipeline: from('tasks').select()", async () => {
    await Page();
    expect(__spies.fromSpy).toHaveBeenCalledWith("tasks");
    expect(__spies.selectSpy).toHaveBeenCalledTimes(1);
  });

  it("rejects when Supabase returns an error", async () => {
    __setError(new Error("select failed"));
    await expect(Page()).rejects.toThrow("select failed");
  });

  it("renders only active list when there are no tasks", async () => {
    __setTasks([]);
    const ui = await Page();
    render(ui);
    expect(
      screen.getByRole("heading", { name: /All tasks \(0\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Active \(0\)/i })
    ).toBeInTheDocument();
  });
});
