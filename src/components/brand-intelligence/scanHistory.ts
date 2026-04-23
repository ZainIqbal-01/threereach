import { ScanRecord } from "./types";

const STORAGE_KEY = "three-reach-scan-history";

export function getScanHistory(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScan(record: ScanRecord): void {
  const history = getScanHistory();
  history.unshift(record);
  // Keep last 20 scans
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
}

export function deleteScan(id: string): void {
  const history = getScanHistory().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
