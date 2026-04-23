import { useCallback, useEffect, useState } from "react";

export interface BusinessResource {
  id: string;
  type: "document" | "link" | "note";
  name: string;
  // For documents: data URL (base64). For links: the URL. For notes: the text.
  value: string;
  size?: number;
  addedAt: string;
}

export interface BusinessProfile {
  businessName?: string;
  websiteUrl?: string;
  description?: string;
  services?: string;
  industry?: string;
  audience?: string;
  usp?: string;
  founderName?: string;
  yearFounded?: string;
  hqLocation?: string;
  detailedInfo?: string;
  resources?: BusinessResource[];
  enrichmentDismissedAt?: string;
}

const STORAGE_KEY = "businessProfile";

function read(): BusinessProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function write(profile: BusinessProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("businessProfile:updated"));
  } catch {}
}

/** Returns the list of important fields that are missing or too short. */
export function getMissingFields(profile: BusinessProfile): string[] {
  const missing: string[] = [];
  if (!profile.description || profile.description.trim().length < 40) missing.push("Description");
  if (!profile.services || profile.services.trim().length < 10) missing.push("Services / Products");
  if (!profile.industry?.trim()) missing.push("Industry");
  if (!profile.audience?.trim()) missing.push("Target Audience");
  if (!profile.usp?.trim()) missing.push("Unique Value Prop");
  if (!profile.founderName?.trim()) missing.push("Founder");
  if (!profile.hqLocation?.trim()) missing.push("HQ Location");
  const hasEnrichment =
    (profile.detailedInfo && profile.detailedInfo.trim().length > 80) ||
    (profile.resources && profile.resources.length > 0);
  // If the user has provided rich enrichment, suppress most "missing" noise.
  return hasEnrichment ? missing.slice(0, 2) : missing;
}

export function useBusinessProfile() {
  const [profile, setProfile] = useState<BusinessProfile>(() => read());

  useEffect(() => {
    const handler = () => setProfile(read());
    window.addEventListener("storage", handler);
    window.addEventListener("businessProfile:updated", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("businessProfile:updated", handler as EventListener);
    };
  }, []);

  const update = useCallback((patch: Partial<BusinessProfile>) => {
    const next = { ...read(), ...patch };
    write(next);
    setProfile(next);
  }, []);

  const addResources = useCallback((items: BusinessResource[]) => {
    const current = read();
    const next: BusinessProfile = {
      ...current,
      resources: [...(current.resources ?? []), ...items],
    };
    write(next);
    setProfile(next);
  }, []);

  const removeResource = useCallback((id: string) => {
    const current = read();
    const next: BusinessProfile = {
      ...current,
      resources: (current.resources ?? []).filter((r) => r.id !== id),
    };
    write(next);
    setProfile(next);
  }, []);

  const dismissEnrichment = useCallback(() => {
    update({ enrichmentDismissedAt: new Date().toISOString() });
  }, [update]);

  return {
    profile,
    missing: getMissingFields(profile),
    update,
    addResources,
    removeResource,
    dismissEnrichment,
  };
}
