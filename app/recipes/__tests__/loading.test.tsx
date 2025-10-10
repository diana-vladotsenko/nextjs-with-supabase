import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Loading from "../loading";

describe("recipes/loading", () => {
  
  it("renders", () => {
    const { container } = render(<Loading/>);
    expect(container).toBeTruthy();
  });

  it("renders root container with pulse", () => {
    const { container } = render(<Loading />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.className).toContain("animate-pulse");
  });

  it("renders the expected number of skeleton blocks", () => {
    const { container } = render(<Loading />);
    const blocks = container.querySelectorAll(".bg-neutral-200");
    expect(blocks.length).toBe(7);
  });

  it("renders header skeleton", () => {
    const { container } = render(<Loading />);
    expect(
      container.querySelector(".h-6.w-40.rounded.bg-neutral-200")
    ).toBeTruthy();
  });

  it("renders form skeletons", () => {
    const { container } = render(<Loading />);
    expect(
      container.querySelectorAll(".h-10.w-full.rounded.bg-neutral-200").length
    ).toBe(2);
    expect(
      container.querySelector(".h-20.w-full.rounded.bg-neutral-200")
    ).toBeTruthy();
    expect(
      container.querySelector(".h-8.w-24.rounded.bg-neutral-200")
    ).toBeTruthy();
  });

  it("renders list item skeletons", () => {
    const { container } = render(<Loading />);
    expect(
      container.querySelectorAll(".h-24.rounded-xl.bg-neutral-200").length
    ).toBe(2);
  });

  it("matches snapshot", () => {
    const { container } = render(<Loading />);
    expect(container.firstElementChild).toMatchSnapshot();
  });
});
