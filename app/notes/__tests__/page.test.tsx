/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";

const { store } = vi.hoisted(() => ({
  store: {
    data: [
      { id: 1, title: "First" },
      { id: 2, title: "Second" },
    ] as Array<{ id: number; title: string }>,
    error: null as Error | null,
  },
}));

vi.mock("@/lib/supabase/server", () => {
  const fromSpy = vi.fn();
  const selectSpy = vi.fn();
  const orderSpy = vi.fn();

  const createClient = vi.fn(async () => {
    return {
      from: fromSpy.mockImplementation((_table: string) => ({
        select: selectSpy.mockReturnValue({
          order: orderSpy.mockImplementation(async (_col: string) => {
            if (store.error) return { data: null, error: store.error };
            return { data: store.data, error: null };
          }),
        }),
      })),
    };
  });

  const __setNotes = (list: Array<{ id: number; title: string }>) => {
    store.data = list;
    store.error = null;
  };
  const __setError = (err: Error | null) => {
    store.error = err;
  };

  return {
    createClient,
    __setNotes,
    __setError,
    __spies: { fromSpy, selectSpy, orderSpy },
  };
});

import Page from "../page";
import { __setNotes, __setError, __spies } from "@/lib/supabase/server";

describe("notes/page", () => {
  beforeEach(() => {
    __setNotes([
      { id: 1, title: "First" },
      { id: 2, title: "Second" },
    ]);
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const ui = await Page();
    expect(ui).toBeTruthy();
    expect(() => render(ui)).not.toThrow();
  });

  it("renders page content (title, input, add button)", async () => {
    const ui = await Page();
    render(ui);

    expect(
      screen.getByRole("heading", { name: /notes/i, level: 1 })
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/note description\.\./i);
    expect(input).toHaveAttribute("name", "title");

    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("renders notes list with delete forms", async () => {
    __setNotes([
      { id: 10, title: "FirstN" },
      { id: 11, title: "SecondN" },
      { id: 12, title: "ThirdN" },
    ]);

    const ui = await Page();
    render(ui);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);

    const first = items[0];
    const second = items[1];
    const third = items[2];

    expect(within(first).getByText("FirstN")).toBeInTheDocument();
    expect(within(second).getByText("SecondN")).toBeInTheDocument();
    expect(within(third).getByText("ThirdN")).toBeInTheDocument();

    expect(
      within(first).getByRole("button", { name: /delete/i })
    ).toBeInTheDocument();
    expect(
      within(second).getByRole("button", { name: /delete/i })
    ).toBeInTheDocument();
    expect(
      within(third).getByRole("button", { name: /delete/i })
    ).toBeInTheDocument();

    const hiddenIdFirst = within(first).getByDisplayValue("10");
    const hiddenIdSecond = within(second).getByDisplayValue("11");
    const hiddenIdThird = within(third).getByDisplayValue("12");
    
    expect(hiddenIdFirst).toHaveAttribute("type", "hidden")
    expect(hiddenIdFirst).toHaveAttribute("name", "id");
    
    expect(hiddenIdSecond).toHaveAttribute("type", "hidden")
    expect(hiddenIdSecond).toHaveAttribute("name", "id");
    
    expect(hiddenIdThird).toHaveAttribute("type", "hidden")
    expect(hiddenIdThird).toHaveAttribute("name", "id");
  });

  it("calls Supabase pipeline: from('notes').select().order('id')", async () => {
    await Page();
    expect(__spies.fromSpy).toHaveBeenCalledWith("notes");
    expect(__spies.selectSpy).toHaveBeenCalledTimes(1);
    expect(__spies.orderSpy).toHaveBeenCalledWith("id");
  });

  it("rejects when Supabase returns an error", async () => {
    __setError(new Error("select failed"));
    await expect(Page()).rejects.toThrow("select failed");
  });

  it("renders empty state when there are no notes", async () => {
    __setNotes([]);
    const ui = await Page();
    render(ui);
    const list = screen.getByRole("list");
    expect(within(list).queryAllByRole("listitem")).toHaveLength(0);
  });
});
