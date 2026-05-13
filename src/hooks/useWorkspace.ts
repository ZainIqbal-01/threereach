import { create } from "zustand";

// Open string so any Marketing OS module ID is allowed.
// Live modules: overview, scan, brand, optimize, distribution, agents, footprint, proof, reports, settings, billing.
// All other IDs are rendered by the generic ModulePage from the registry.
export type WorkspaceModule = string;
export type WorkspaceTab = "preview" | "code" | "files";

export interface WorkspaceArtifact {
  id: string;
  name: string;
  mime: string;
  content: string;
}

export interface WorkspaceDiff {
  pr_url?: string;
  pr_number?: number;
  files: { path: string; patch: string }[];
  summary?: string;
}

interface WorkspaceState {
  module: WorkspaceModule;
  tab: WorkspaceTab;
  artifacts: WorkspaceArtifact[];
  diff: WorkspaceDiff | null;
  setModule: (m: WorkspaceModule) => void;
  setTab: (t: WorkspaceTab) => void;
  addArtifact: (a: WorkspaceArtifact) => void;
  setDiff: (d: WorkspaceDiff | null) => void;
}

export const useWorkspace = create<WorkspaceState>((set) => ({
  module: "overview",
  tab: "preview",
  artifacts: [],
  diff: null,
  setModule: (module) => set({ module }),
  setTab: (tab) => set({ tab }),
  addArtifact: (a) => set((s) => ({ artifacts: [a, ...s.artifacts.filter((x) => x.id !== a.id)] })),
  setDiff: (diff) => set({ diff }),
}));
