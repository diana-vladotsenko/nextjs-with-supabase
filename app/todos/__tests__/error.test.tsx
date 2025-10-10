import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TasksError from "../error";

describe("tasks/error", () => {

  it("renders", () => {
    const err = { name: "Error", message: "Boom" } as Error;
    const { container } = render(<TasksError error={err} reset={() => {}} />);
    expect(container).toBeTruthy();
  });

  it("renders error message", () => {
    const err = { name: "Error", message: "Error message" } as Error;
    render(<TasksError error={err} reset={() => {}} />);
    expect(screen.getByText(/Something went wrong:/i)).toBeInTheDocument();
    expect(screen.getByText(/Error message/)).toBeInTheDocument();
  });

  it("renders UI", () => {
    const err = { name: "Error", message: "X" } as Error;
    render(<TasksError error={err} reset={() => {}} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("renders correctly when clicking Try again", () => {
    const err = { name: "Error", message: "Y" } as Error;
    const reset = vi.fn();
    render(<TasksError error={err} reset={reset} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
