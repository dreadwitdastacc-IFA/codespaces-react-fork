import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App integration", () => {
  test("renders header and featured video", () => {
    render(<App />);
    const brand = screen.getByText(/dreadwitdastacc-IFA/i);
    const featured = screen.getByRole("heading", { name: /featured/i });
    const videoTitle = screen.getByText(/Mining Performance Overview/i);

    expect(brand).toBeDefined();
    expect(featured).toBeDefined();
    expect(videoTitle).toBeDefined();
  });
});
