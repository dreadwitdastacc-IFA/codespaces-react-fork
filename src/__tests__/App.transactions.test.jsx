import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App integration", () => {
  test("renders header and featured video", () => {
    render(<App />);
    const brands = screen.getAllByText(/dreadwitdastacc-IFA/i);
    const featured = screen.getByRole("heading", { name: /featured/i });
    const videoTitle = screen.getByText(/Mini Short Live Performance Video/i);

    expect(brands).toHaveLength(2);
    expect(featured).toBeDefined();
    expect(videoTitle).toBeDefined();
  });
});
