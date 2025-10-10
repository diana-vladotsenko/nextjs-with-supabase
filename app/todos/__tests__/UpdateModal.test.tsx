/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const { refreshMock, updateTaskMock } = vi.hoisted(() => ({
  refreshMock: vi.fn(),
  updateTaskMock: vi.fn(async (_fd: FormData) => {}),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));
vi.mock("@/app/todos/actions", () => ({
  updateTask: updateTaskMock,
}));

import UpdateModal from "../_components/UpdateModal";

describe("todos/UpdateModal", () => {
  beforeEach(() => {
    refreshMock.mockClear();
    updateTaskMock.mockClear();
  });

  it("renders", () => {
    const { container } = render(<UpdateModal id={1} currentName="Alpha" />);
    expect(container).toBeTruthy();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("renders modal and its UI", () => {
    render(<UpdateModal id={2} currentName="Bravo" />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(
      screen.getByRole("heading", { name: "Update Task" })
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Task name") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Bravo");
  });

  it("renders Cancel and Save buttons", () => {
    render(<UpdateModal id={2} currentName="Bravo" />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("disables Save button when input is empty", () => {
    render(<UpdateModal id={2} currentName="Bravo" />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    const input = screen.getByPlaceholderText("Task name") as HTMLInputElement;
    const saveBtn = screen.getByRole("button", { name: "Save" });

    fireEvent.change(input, { target: { value: "" } });
    expect(saveBtn).toBeDisabled();
  });

  it("submits and closes", async () => {
    render(<UpdateModal id={3} currentName="Charlie" />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    const input = screen.getByPlaceholderText("Task name") as HTMLInputElement;
    const saveBtn = screen.getByRole("button", { name: "Save" });

    fireEvent.change(input, { target: { value: "New name" } });
    expect(saveBtn).not.toBeDisabled();

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledTimes(1);
      expect(refreshMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("heading", { name: "Update Task" })).toBeNull();
    });

    const fd = updateTaskMock.mock.calls[0][0] as FormData;
    expect(fd.get("id")).toBe("3");
    expect(fd.get("name")).toBe("New name");
  });
});
