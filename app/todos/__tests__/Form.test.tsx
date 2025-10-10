import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Form } from "../_components/Form";

describe("todos/Form", () => {
  it("renders", () => {
    const { container } = render(<Form />);
    expect(container).toBeTruthy();
  });

  it("renders UI", () => {
    render(<Form />);
    expect(screen.getByPlaceholderText("e.g Task..")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
});
