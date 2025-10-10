import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Loading from "../../todos/loading";

describe("todos/loading", () => {
  it("renders skeleton layout", () => {
    const { container } = render(<Loading />);

    const wrapper = container.querySelector(".animate-pulse.space-y-4");
    expect(wrapper).toBeTruthy();

    const title = container.querySelectorAll(
      ".h-6.w-40.rounded.bg-neutral-200"
    );
    expect(title.length).toBe(1);

    const cards = container.querySelectorAll(".h-32.rounded-xl.bg-neutral-200");
    expect(cards.length).toBe(2);
  });
});
