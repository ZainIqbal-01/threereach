import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NextBestAction } from "./NextBestAction";

const renderWith = (props: Parameters<typeof NextBestAction>[0]) =>
  render(
    <MemoryRouter>
      <NextBestAction {...props} />
    </MemoryRouter>
  );

describe("NextBestAction", () => {
  it("surfaces score recommendation when score is low", () => {
    renderWith({ score: 42, footprintProgress: 40, distributionLive: 18, distributionTotal: 60 });
    expect(screen.getByText(/below industry average/i)).toBeInTheDocument();
    expect(screen.getByText("Run Full Scan")).toBeInTheDocument();
  });

  it("surfaces footprint recommendation when build is incomplete", () => {
    renderWith({ score: 80, footprintProgress: 30, distributionLive: 60, distributionTotal: 60 });
    expect(screen.getByText(/Complete your AI footprint/i)).toBeInTheDocument();
  });

  it("caps insights at 3 items", () => {
    renderWith({ score: 10, footprintProgress: 10, distributionLive: 1, distributionTotal: 60 });
    // 3 actions chip
    expect(screen.getByText(/3 actions/i)).toBeInTheDocument();
  });

  it("always shows the competitor benchmarking insight when slots remain", () => {
    renderWith({ score: 90, footprintProgress: 100, distributionLive: 60, distributionTotal: 60 });
    expect(screen.getByText(/Benchmark against competitors/i)).toBeInTheDocument();
  });
});
