import { useEffect, useState, useCallback } from "react";
import { LEVELS, LevelKey } from "@/lib/geoPlaybook";

const STORAGE_KEY = "geo-checklist";

type ChecklistState = Record<string, boolean>;

function readState(): ChecklistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeState(s: ChecklistState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("geo-checklist-changed"));
  } catch {}
}

export function useGEOMaturity() {
  const [state, setState] = useState<ChecklistState>(readState);

  useEffect(() => {
    const sync = () => setState(readState());
    window.addEventListener("geo-checklist-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("geo-checklist-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeState(next);
      return next;
    });
  }, []);

  const set = useCallback((id: string, value: boolean) => {
    setState((prev) => {
      const next = { ...prev, [id]: value };
      writeState(next);
      return next;
    });
  }, []);

  // Per-level progress
  const levelProgress = LEVELS.map((lvl) => {
    const total = lvl.checklist.length;
    const done = lvl.checklist.filter((item) => state[item.id]).length;
    return {
      key: lvl.key,
      number: lvl.number,
      title: lvl.title,
      total,
      done,
      pct: total === 0 ? 0 : Math.round((done / total) * 100),
      complete: done === total && total > 0,
    };
  });

  // Current level = the lowest-numbered incomplete level (or 7 if all done)
  const currentLevel = levelProgress.find((l) => !l.complete) ?? levelProgress[levelProgress.length - 1];

  // Unified GEO Maturity Score: weighted by level number (later levels = harder = more weight)
  const totalWeight = LEVELS.reduce((acc, l) => acc + l.number, 0); // 1+2+...+7 = 28
  const earnedWeight = levelProgress.reduce(
    (acc, l) => acc + (l.pct / 100) * LEVELS.find((x) => x.key === l.key)!.number,
    0,
  );
  const score = Math.round((earnedWeight / totalWeight) * 100);

  const completedLevels = levelProgress.filter((l) => l.complete).length;

  return { state, toggle, set, levelProgress, currentLevel, score, completedLevels };
}

export type { LevelKey };
