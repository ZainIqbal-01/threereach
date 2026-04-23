import type { DashboardData } from "@/hooks/useDashboardData";

/** Build a branded CSV summary of the current dashboard snapshot. */
export function buildDashboardCSV(businessName: string, data: DashboardData): string {
  const rows: string[][] = [];
  rows.push(["Three Reach AI — Dashboard Export"]);
  rows.push(["Business", businessName]);
  rows.push(["Generated", new Date().toISOString()]);
  rows.push([]);
  rows.push(["Metric", "Value"]);
  rows.push(["Visibility Score", `${data.currentScore}/100`]);
  rows.push(["Status", data.status]);
  rows.push(["Total Mentions", String(data.totalMentions)]);
  rows.push(["Total Scans", String(data.totalScans)]);
  rows.push(["Scans This Week", String(data.scansThisWeek)]);
  rows.push([]);
  rows.push(["Engine", "Status", "Confidence", "Last Checked"]);
  for (const e of data.engines) {
    rows.push([e.name, e.status, `${e.confidence}%`, e.lastChecked]);
  }
  if (data.recentMentions.length) {
    rows.push([]);
    rows.push(["Recent Mentions"]);
    for (const m of data.recentMentions) rows.push([m]);
  }
  return rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
