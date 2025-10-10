import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateRecipeModal from "../_components/UpdateRecipeModal";

vi.mock("../actions", () => ({
  updateRecipe: vi.fn().mockResolvedValue(undefined),
}));

import { updateRecipe } from "../actions";

const recipe = {
  id: 1,
  title: "Bread",
  ingredients: "flour, water, yeast",
  instruction: "mix and bake",
};

describe("UpdateRecipeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    const { container } = render(<UpdateRecipeModal recipe={recipe} />);
    expect(container).toBeTruthy();
  });

  it("renders Update button", () => {
    render(<UpdateRecipeModal recipe={recipe} />);
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("opens and closes modal", () => {
    render(<UpdateRecipeModal recipe={recipe} />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders form fields with default values", () => {
    render(<UpdateRecipeModal recipe={recipe} />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(screen.getByDisplayValue("Bread")).toBeInTheDocument();
    expect(screen.getByDisplayValue("flour, water, yeast")).toBeInTheDocument();
    expect(screen.getByDisplayValue("mix and bake")).toBeInTheDocument();
  });

  it("calls updateRecipe on form submit", async () => {
    render(<UpdateRecipeModal recipe={recipe} />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(updateRecipe).toHaveBeenCalledTimes(1));

    const fd = (updateRecipe as unknown as vi.Mock).mock
      .calls[0][0] as FormData;
    expect(fd.get("id")).toBe("1");
    expect(fd.get("title")).toBe("Bread");
    expect(fd.get("ingredients")).toBe("flour, water, yeast");
    expect(fd.get("instruction")).toBe("mix and bake");
  });

  it("closes modal after successful update", async () => {
    render(<UpdateRecipeModal recipe={recipe} />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(updateRecipe).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
