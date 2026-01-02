import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoCard } from "../VideoCard";

describe("VideoCard", () => {
  const sample = {
    title: "Test Video",
    description: "Fun test video",
    url: "#",
    thumbnail: "https://via.placeholder.com/320x180",
    liked: false,
  };

  test("renders title and description", () => {
    render(<VideoCard video={sample} />);
    const titleEl = screen.getByText(sample.title);
    const descEl = screen.getByText(sample.description);
    expect(titleEl).toBeTruthy();
    expect(descEl).toBeTruthy();
  });

  test("like button toggles aria-pressed", () => {
    render(<VideoCard video={sample} />);
    const btn = screen.getByRole("button", { name: /like test video/i });
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });
});
