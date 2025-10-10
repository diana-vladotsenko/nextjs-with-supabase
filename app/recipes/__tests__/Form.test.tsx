import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("../actions", () => ({
  addRecipe: vi.fn().mockResolvedValue(undefined),
}));

import { addRecipe } from "../actions";
import { Form } from "../_components/Form";

describe("Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    const { container } = render(<Form />);
    expect(container).toBeTruthy();
  });

  it("renders UI", () => {
    render(<Form />);
    expect(screen.getByPlaceholderText("Recipe title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingredients (comma separated)")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Instructions...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Recipe" })
    ).toBeInTheDocument();
  });

  it("renders fields and submit button", () => {
    render(<Form />);
    expect(screen.getByPlaceholderText("Recipe title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingredients (comma separated)")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Instructions...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Recipe" })
    ).toBeInTheDocument();
  });

  it("shows validation error when any field is empty and does not call addRecipe", async () => {
    render(<Form />);

    fireEvent.change(screen.getByPlaceholderText("Recipe title"), {
      target: { value: "Bread" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Ingredients (comma separated)"),
      {
        target: { value: "" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Instructions..."), {
      target: { value: "Bake at 230C" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Recipe" }));

    expect(
      await screen.findByText("All fields are required.")
    ).toBeInTheDocument();
    expect(addRecipe).not.toHaveBeenCalled();
  });

  it("submits when all fields are filled and calls addRecipe with FormData", async () => {
    render(<Form />);

    fireEvent.change(screen.getByPlaceholderText("Recipe title"), {
      target: { value: "Bread" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Ingredients (comma separated)"),
      {
        target: { value: "flour, water, yeast, salt" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Instructions..."), {
      target: { value: "mix, proof, bake" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Recipe" }));

    await waitFor(() => expect(addRecipe).toHaveBeenCalledTimes(1));

    const fd = (addRecipe as unknown as vi.Mock).mock.calls[0][0] as FormData;
    expect(fd.get("title")).toBe("Bread");
    expect(fd.get("ingredients")).toBe("flour, water, yeast, salt");
    expect(fd.get("instruction")).toBe("mix, proof, bake");

    expect(screen.queryByText("All fields are required.")).toBeNull();
  });

  it("trims inputs before validation", async () => {
    render(<Form />);

    fireEvent.change(screen.getByPlaceholderText("Recipe title"), {
      target: { value: "   " },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Ingredients (comma separated)"),
      {
        target: { value: "flour" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Instructions..."), {
      target: { value: "mix" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Recipe" }));

    expect(
      await screen.findByText("All fields are required.")
    ).toBeInTheDocument();
    expect(addRecipe).not.toHaveBeenCalled();
  });
});
