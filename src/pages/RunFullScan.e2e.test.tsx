/**
 * E2E-style smoke tests: every "Run Full Scan" entry point in the app must
 * land on the AI Visibility Scan page with its core controls rendered, AND
 * triggering the scan from there must invoke the ai-scan edge function.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Overview from "./Overview";
import AIScan from "./AIScan";

// ── Mocks ───────────────────────────────────────────────────────────────────
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

const toastSpy = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  toast: (a: unknown) => toastSpy(a),
  useToast: () => ({ toast: toastSpy }),
}));

const invokeSpy = vi.fn(async () => ({
  data: {
    results: [
      { engine: "ChatGPT", status: "mentioned", position: 2, context: "ctx" },
      { engine: "Gemini", status: "weak", position: 7, context: "ctx" },
      { engine: "Perplexity", status: "not_found", position: null, context: null },
    ],
  },
  error: null,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: (...a: unknown[]) => invokeSpy(...a) } },
}));

// ── Harness ─────────────────────────────────────────────────────────────────
const renderApp = () =>
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/dashboard/scan" element={<AIScan />} />
        <Route path="/dashboard/proof" element={<div>PROOF PAGE</div>} />
        <Route path="/dashboard/footprint" element={<div>FOOTPRINT PAGE</div>} />
        <Route path="/dashboard/distribution" element={<div>DISTRIBUTION PAGE</div>} />
        <Route path="/dashboard/brand-intelligence" element={<div>INTEL PAGE</div>} />
      </Routes>
    </MemoryRouter>
  );

const expectScanPageReady = () => {
  // Heading
  expect(screen.getByRole("heading", { name: /AI Visibility Scan/i })).toBeInTheDocument();
  // Primary CTA on the scan page
  expect(screen.getByRole("button", { name: /Run New Scan/i })).toBeInTheDocument();
  // Query Simulation prompt + input
  expect(screen.getByText(/Query Simulation/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter a query to test/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Simulate/i })).toBeInTheDocument();
  // History panel
  expect(screen.getByText(/Scan History/i)).toBeInTheDocument();
};

beforeEach(() => {
  toastSpy.mockClear();
  invokeSpy.mockClear();
  localStorage.clear();
});

describe("Run Full Scan — entry points (E2E smoke)", () => {
  it("entry point #1: NextBestAction recommendation tile", async () => {
    const user = userEvent.setup();
    renderApp();

    const recoSection = screen
      .getByText(/Smart Recommendations/i)
      .closest("div")!.parentElement!.parentElement!;
    const tile = within(recoSection).getByText("Run Full Scan").closest("a")!;
    await user.click(tile);

    expectScanPageReady();
  });

  it("entry point #2: AI Engine Status header link", async () => {
    const user = userEvent.setup();
    renderApp();

    // The header link is the anchor whose accessible name contains "Run Full Scan".
    const allLinks = screen.getAllByRole("link", { name: /Run Full Scan/i });
    expect(allLinks.length).toBeGreaterThanOrEqual(1);
    await user.click(allLinks[allLinks.length - 1]);

    expectScanPageReady();
  });

  it("entry point #3: Boost Visibility quick-action modal", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: /Boost Visibility/i }));
    await user.click(screen.getByRole("button", { name: /Run Full Scan/i }));

    expectScanPageReady();
  });

  it("triggers the ai-scan edge function when 'Run New Scan' is clicked on the scan page", async () => {
    const user = userEvent.setup();
    renderApp();

    // Navigate via NextBestAction tile (entry point #1)
    const recoSection = screen
      .getByText(/Smart Recommendations/i)
      .closest("div")!.parentElement!.parentElement!;
    await user.click(within(recoSection).getByText("Run Full Scan").closest("a")!);
    expectScanPageReady();

    // Now actually run the scan
    await user.click(screen.getByRole("button", { name: /Run New Scan/i }));

    await waitFor(() => expect(invokeSpy).toHaveBeenCalledTimes(1));
    expect(invokeSpy).toHaveBeenCalledWith(
      "ai-scan",
      expect.objectContaining({
        body: expect.objectContaining({
          engines: expect.arrayContaining(["ChatGPT", "Gemini", "Perplexity"]),
        }),
      })
    );

    // Initiation + completion toasts fire
    await waitFor(() => {
      const titles = toastSpy.mock.calls.map((c) => (c[0] as { title?: string })?.title || "");
      expect(titles.some((t) => /scan initiated/i.test(t))).toBe(true);
      expect(titles.some((t) => /scan complete/i.test(t))).toBe(true);
    });
  });
});
