import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Overview from "./Overview";

// Stub heavy / canvas-based chart children so jsdom doesn't choke on Recharts.
vi.mock("@/components/dashboard/VisibilityTrendChart", () => ({
  VisibilityTrendChart: () => <div data-testid="chart-visibility" />,
}));
vi.mock("@/components/dashboard/EngineBreakdownChart", () => ({
  EngineBreakdownChart: () => <div data-testid="chart-engine" />,
}));
vi.mock("@/components/dashboard/ContentActivityChart", () => ({
  ContentActivityChart: () => <div data-testid="chart-activity" />,
}));
vi.mock("@/components/agents/AgentHub", () => ({
  AgentHub: () => <div data-testid="agent-hub" />,
}));

// Toast is a side-effect only; capture calls.
const toastSpy = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  toast: (args: unknown) => toastSpy(args),
  useToast: () => ({ toast: toastSpy }),
}));

const renderOverview = () =>
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/dashboard/scan" element={<div>SCAN PAGE</div>} />
        <Route path="/dashboard/proof" element={<div>PROOF PAGE</div>} />
        <Route path="/dashboard/footprint" element={<div>FOOTPRINT PAGE</div>} />
        <Route path="/dashboard/distribution" element={<div>DISTRIBUTION PAGE</div>} />
        <Route path="/dashboard/brand-intelligence" element={<div>INTEL PAGE</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("Overview page (smoke)", () => {
  beforeEach(() => {
    toastSpy.mockClear();
    localStorage.clear();
    // jsdom lacks URL.createObjectURL
    if (!URL.createObjectURL) {
      (URL as unknown as { createObjectURL: () => string }).createObjectURL = vi.fn(() => "blob:mock");
      (URL as unknown as { revokeObjectURL: () => void }).revokeObjectURL = vi.fn();
    }
  });

  it("renders the hero, score, recommendations, and analytics sections", () => {
    renderOverview();
    expect(screen.getByText(/Your AI visibility snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Smart Recommendations/i)).toBeInTheDocument();
    expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
    expect(screen.getByTestId("chart-visibility")).toBeInTheDocument();
    expect(screen.getByTestId("chart-engine")).toBeInTheDocument();
    expect(screen.getByTestId("chart-activity")).toBeInTheDocument();
    expect(screen.getByTestId("agent-hub")).toBeInTheDocument();
    expect(screen.getByText(/AI Engine Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
  });

  it("opens the Boost Visibility modal and navigates to Distribution", async () => {
    const user = userEvent.setup();
    renderOverview();

    await user.click(screen.getByRole("button", { name: /Boost Visibility/i }));
    expect(screen.getByText(/Quick Boost Actions/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Distribute Content/i }));
    expect(screen.getByText("DISTRIBUTION PAGE")).toBeInTheDocument();
  });

  it("Export action triggers a download and toast", async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    renderOverview();

    await user.click(screen.getByRole("button", { name: /Export/i }));

    expect(clickSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringMatching(/exported/i) })
    );
    clickSpy.mockRestore();
  });

  it("NextBestAction 'Run Full Scan' link navigates to /dashboard/scan", async () => {
    const user = userEvent.setup();
    renderOverview();

    const recoSection = screen.getByText(/Smart Recommendations/i).closest("div")!.parentElement!.parentElement!;
    const scanLink = within(recoSection).getByText("Run Full Scan");
    await user.click(scanLink);
    expect(screen.getByText("SCAN PAGE")).toBeInTheDocument();
  });

  it("AI Engine Status 'Run Full Scan' link navigates to /dashboard/scan", () => {
    renderOverview();
    const links = screen.getAllByText(/Run Full Scan/i);
    // The header link is an <a>; click via fireEvent on the closest anchor.
    const anchor = links.map((l) => l.closest("a")).find(Boolean) as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
    fireEvent.click(anchor);
    expect(screen.getByText("SCAN PAGE")).toBeInTheDocument();
  });

  it("Recent Activity 'View all' navigates to Proof & Tracking (download proof entry point)", async () => {
    const user = userEvent.setup();
    renderOverview();
    await user.click(screen.getByRole("link", { name: /View all/i }));
    expect(screen.getByText("PROOF PAGE")).toBeInTheDocument();
  });

  it("Quick Stat 'Proof & Tracking' card navigates to proof page", async () => {
    const user = userEvent.setup();
    renderOverview();
    await user.click(screen.getByRole("link", { name: /Proof & Tracking/i }));
    expect(screen.getByText("PROOF PAGE")).toBeInTheDocument();
  });
});
