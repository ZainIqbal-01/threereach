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

type ScanResp = { data: { results: Record<string, unknown>[] } | null; error: { message: string } | null };
const invokeSpy = vi.fn<(name: string, opts?: unknown) => Promise<ScanResp>>(async () => ({
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
  supabase: { functions: { invoke: (name: string, opts?: unknown) => invokeSpy(name, opts) } },
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

    // NextBestAction renders before the AI Engine Status section, so the first
    // "Run Full Scan" occurrence belongs to the recommendation tile.
    const tile = screen.getAllByText("Run Full Scan")[0].closest("a")!;
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
    await user.click(screen.getAllByText("Run Full Scan")[0].closest("a")!);
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

  it("shows an error toast and keeps the scan page usable when ai-scan fails", async () => {
    const user = userEvent.setup();
    // One-shot failure for the next invoke call
    invokeSpy.mockImplementationOnce(async () => ({
      data: null as unknown as { results: never[] },
      error: { message: "Gemini gateway timed out" },
    }));

    renderApp();
    await user.click(screen.getAllByText("Run Full Scan")[0].closest("a")!);
    expectScanPageReady();

    const runBtn = screen.getByRole("button", { name: /Run New Scan/i });
    await user.click(runBtn);

    // Error toast surfaced with the upstream message
    await waitFor(() => {
      const calls = toastSpy.mock.calls.map((c) => c[0] as { title?: string; description?: string; variant?: string });
      const failure = calls.find((c) => /scan failed/i.test(c.title || ""));
      expect(failure).toBeTruthy();
      expect(failure?.variant).toBe("destructive");
      expect(failure?.description).toMatch(/Gemini gateway timed out/i);
    });

    // Page is still functional: button re-enabled, simulator + history still rendered
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Run New Scan/i })).not.toBeDisabled();
    });
    expect(screen.getByPlaceholderText(/Enter a query to test/i)).toBeInTheDocument();
    expect(screen.getByText(/Scan History/i)).toBeInTheDocument();

    // And a follow-up scan can succeed (default mock implementation)
    await user.click(screen.getByRole("button", { name: /Run New Scan/i }));
    await waitFor(() => {
      const titles = toastSpy.mock.calls.map((c) => (c[0] as { title?: string })?.title || "");
      expect(titles.some((t) => /scan complete/i.test(t))).toBe(true);
    });
  });

  it("shows a loading/progress state during scan and clears it on failure", async () => {
    const user = userEvent.setup();
    // Hold the invoke pending so we can inspect the loading UI.
    let resolveInvoke: (v: { data: unknown; error: { message: string } | null }) => void;
    invokeSpy.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveInvoke = resolve as typeof resolveInvoke;
        })
    );

    renderApp();
    await user.click(screen.getAllByText("Run Full Scan")[0].closest("a")!);
    expectScanPageReady();
    await user.click(screen.getByRole("button", { name: /Run New Scan/i }));

    // Loading state visible
    expect(screen.getByTestId("scan-progress")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Scanning/i })).toBeDisabled();

    // Resolve with an upstream error
    resolveInvoke!({ data: null, error: { message: "boom" } });

    // Progress clears, error banner appears, page is interactive again
    await waitFor(() => {
      expect(screen.queryByTestId("scan-progress")).not.toBeInTheDocument();
      expect(screen.getByTestId("scan-error")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Run New Scan/i })).not.toBeDisabled();
    });
  });

  it("does not duplicate the destructive toast on rapid repeated failures", async () => {
    const user = userEvent.setup();
    invokeSpy.mockImplementation(async () => ({
      data: null as unknown as { results: never[] },
      error: { message: "Same error" },
    }));

    renderApp();
    await user.click(screen.getAllByText("Run Full Scan")[0].closest("a")!);
    await user.click(screen.getByRole("button", { name: /Run New Scan/i }));
    await waitFor(() => expect(screen.getByTestId("scan-error")).toBeInTheDocument());

    // Click Retry twice in quick succession
    const retryBtns = screen.getAllByRole("button", { name: /Retry/i });
    await user.click(retryBtns[0]);
    await waitFor(() => expect(screen.getByTestId("scan-error")).toBeInTheDocument());
    await user.click(screen.getAllByRole("button", { name: /Retry/i })[0]);
    await waitFor(() => expect(invokeSpy).toHaveBeenCalledTimes(3));

    // Only one destructive toast for "Scan failed" + "Same error" combo
    const destructive = toastSpy.mock.calls
      .map((c) => c[0] as { title?: string; description?: string; variant?: string })
      .filter((t) => t.variant === "destructive" && /scan failed/i.test(t.title || "") && /Same error/.test(t.description || ""));
    expect(destructive.length).toBe(1);

    invokeSpy.mockReset();
  });

  it("handles a network/fetch rejection and keeps the page usable", async () => {
    const user = userEvent.setup();
    invokeSpy.mockImplementationOnce(async () => {
      throw new TypeError("Failed to fetch");
    });

    renderApp();
    await user.click(screen.getAllByText("Run Full Scan")[0].closest("a")!);
    await user.click(screen.getByRole("button", { name: /Run New Scan/i }));

    await waitFor(() => {
      const destructive = toastSpy.mock.calls.find((c) => {
        const t = c[0] as { title?: string; variant?: string; description?: string };
        return t.variant === "destructive" && /scan failed/i.test(t.title || "") && /failed to fetch/i.test(t.description || "");
      });
      expect(destructive).toBeTruthy();
    });

    expect(screen.getByTestId("scan-error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Run New Scan/i })).not.toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter a query to test/i)).toBeInTheDocument();
  });

  it("renders successful prompts + history when ai-scan returns mixed (partial) engine results", async () => {
    const user = userEvent.setup();
    invokeSpy.mockImplementationOnce(async () => ({
      data: {
        results: [
          { engine: "ChatGPT", status: "mentioned", position: 1, context: "Top pick: brand X" },
          { engine: "Gemini", error: "Rate limited" },
          { engine: "Perplexity", status: "weak", position: 8, context: "marginal mention" },
        ],
      },
      error: null,
    }));

    renderApp();
    await user.click(screen.getAllByText("Run Full Scan")[0].closest("a")!);
    await user.click(screen.getByRole("button", { name: /Run New Scan/i }));

    // Per-engine error banner present
    const errBanner = await screen.findByTestId("engine-errors");
    expect(errBanner).toHaveTextContent(/Gemini/i);
    expect(errBanner).toHaveTextContent(/Rate limited/i);

    // Successful results still rendered in history (new "Full scan" rows)
    await waitFor(() => {
      const fullScanRows = screen.getAllByText(/Full scan — industry visibility check/i);
      expect(fullScanRows.length).toBeGreaterThanOrEqual(2);
    });

    // Ranking position from successful engine visible (#1)
    expect(screen.getByText("#1")).toBeInTheDocument();

    // Toast announces partial completion (not a destructive failure)
    const partialToast = toastSpy.mock.calls.find((c) =>
      /completed with errors/i.test((c[0] as { title?: string }).title || "")
    );
    expect(partialToast).toBeTruthy();

    // Retry button works from the partial-errors banner
    const retry = within(errBanner).getByRole("button", { name: /Retry/i });
    await user.click(retry);
    await waitFor(() => expect(invokeSpy).toHaveBeenCalledTimes(2));
  });
});
