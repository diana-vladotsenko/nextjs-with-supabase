/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../page";

const { store } = vi.hoisted(() => ({
  store: {
    data: [
      {
        id: 1,
        title: "Pasta",
        ingredients: "noodles, sauce",
        instruction: "boil, mix",
        created_at: "2024-01-10T10:00:00.000Z",
      },
      {
        id: 2,
        title: "Salad",
        ingredients: "lettuce, tomato",
        instruction: "chop, toss",
        created_at: "2024-02-11T12:30:00.000Z",
      },
    ] as Array<{
      id: number;
      title: string;
      ingredients: string | null;
      instruction: string | null;
      created_at: string;
    }>,
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
  usePathname: () => "/recipes",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("../_components/UpdateRecipeModal", () => ({
  default: ({ recipe }: { recipe: { id: number } }) => (
    <button type="button" aria-label={`Update ${recipe.id}`}>Update</button>
  ),
}));

vi.mock("../_components/Form", () => ({
  Form: () => <div data-testid="add-form">FORM</div>,
}));

vi.mock("../actions", () => ({
  deleteRecipe: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => {
  const fromSpy = vi.fn();
  const selectSpy = vi.fn();
  const orderSpy = vi.fn();

  const createClient = vi.fn(async () => ({
    from: fromSpy.mockImplementation((_table: string) => ({
      select: selectSpy.mockImplementation(() => ({
        order: orderSpy.mockImplementation(async (_col: string, _opts: any) => {
          if (store.error) return { data: null, error: store.error };
          return { data: store.data, error: null };
        }),
      })),
    })),
  }));

  const __setRecipes = (
    list: Array<{
      id: number;
      title: string;
      ingredients: string | null;
      instruction: string | null;
      created_at: string;
    }>
  ) => {
    store.data = list;
    store.error = null;
  };

  const __setError = (err: Error | null) => {
    store.error = err;
  };

  return {
    createClient,
    __setRecipes,
    __setError,
    __spies: { fromSpy, selectSpy, orderSpy },
  };
});

import { __setRecipes, __setError, __spies } from "@/lib/supabase/server";

describe("recipes/page", () => {
  
  beforeEach(() => {
    __setRecipes([
      {
        id: 1,
        title: "Pasta",
        ingredients: "noodles, sauce",
        instruction: "boil, mix",
        created_at: "2024-01-10T10:00:00.000Z",
      },
      {
        id: 2,
        title: "Salad",
        ingredients: "lettuce, tomato",
        instruction: "chop, toss",
        created_at: "2024-02-11T12:30:00.000Z",
      },
    ]);
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const ui = await Page();
    expect(ui).toBeTruthy();
    expect(() => render(ui)).not.toThrow();
  });

  it("renders headings and count", async () => {
    __setRecipes([
      {
        id: 1,
        title: "R1",
        ingredients: "a",
        instruction: "b",
        created_at: "2024-01-10T10:00:00.000Z",
      },
    ]);
    const ui = await Page();
    render(ui);
    expect(screen.getByRole("heading", { level: 1, name: "Recipes" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /All recipes \(1\)/i })).toBeInTheDocument();
  });

  it("calls Supabase pipeline", async () => {
    await Page();
    expect(__spies.fromSpy).toHaveBeenCalledWith("recipe");
    expect(__spies.selectSpy).toHaveBeenCalledTimes(1);
    expect(__spies.orderSpy).toHaveBeenCalledWith("id", { ascending: true });
  });

  it("shows each recipe details", async () => {
    const ui = await Page();
    render(ui);
    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Salad")).toBeInTheDocument();
    expect(screen.getAllByText(/Ingredients:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Instructions:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Added on/i).length).toBeGreaterThanOrEqual(2);
  });

  it("shows action buttons", async () => {
    const ui = await Page();
    render(ui);
    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    expect(deleteButtons).toHaveLength(2);
    const updateButtons = screen.getAllByRole("button", { name: /Update/ });
    expect(updateButtons).toHaveLength(2);
  });

  it("renders add form", async () => {
    const ui = await Page();
    render(ui);
    expect(screen.getByTestId("add-form")).toBeInTheDocument();
  });

  it("propagates Supabase error", async () => {
    __setError(new Error("select failed"));
    await expect(Page()).rejects.toThrow("select failed");
  });

  it("handles empty state", async () => {
    __setRecipes([]);
    const ui = await Page();
    render(ui);
    expect(screen.getByRole("heading", { level: 2, name: /All recipes \(0\)/i })).toBeInTheDocument();
    expect(screen.getByText(/No recipes yet\./i)).toBeInTheDocument();
  });

  it("propagates generic db error", async () => {
    __setError(new Error("db down"));
    await expect(Page()).rejects.toThrow("db down");
  });
});
