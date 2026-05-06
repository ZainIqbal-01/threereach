import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useBusinessName } from "./useBusinessName";

describe("useBusinessName", () => {
  beforeEach(() => localStorage.clear());

  it("returns fallback when no profile is stored", () => {
    const { result } = renderHook(() => useBusinessName());
    expect(result.current).toBe("Your Company");
  });

  it("returns stored business name", async () => {
    localStorage.setItem("businessProfile", JSON.stringify({ businessName: "Linear" }));
    const { result } = renderHook(() => useBusinessName());
    await waitFor(() => expect(result.current).toBe("Linear"));
  });

  it("ignores malformed JSON gracefully", () => {
    localStorage.setItem("businessProfile", "{not json");
    const { result } = renderHook(() => useBusinessName("Brand"));
    expect(result.current).toBe("Brand");
  });

  it("trims whitespace", async () => {
    localStorage.setItem("businessProfile", JSON.stringify({ businessName: "  Acme  " }));
    const { result } = renderHook(() => useBusinessName());
    await waitFor(() => expect(result.current).toBe("Acme"));
  });
});
