import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface BusinessResource {
  id: string;
  type: "document" | "link" | "note";
  name: string;
  // For documents: storage path. For links: the URL. For notes: text content.
  value: string;
  size?: number;
  mimeType?: string;
  addedAt: string;
}

export interface BusinessProfile {
  id?: string;
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
  onboardingComplete?: boolean;
}

const DISMISS_KEY = "enrichmentDismissedAt";

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
  return hasEnrichment ? missing.slice(0, 2) : missing;
}

interface DbBusinessRow {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  detailed_info: string | null;
  target_audience: string | null;
  competitors: string[] | null;
  links: string[] | null;
  onboarding_complete: boolean;
}

interface DbResourceRow {
  id: string;
  kind: string;
  title: string | null;
  url: string | null;
  notes: string | null;
  file_name: string | null;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

function rowToProfile(row: DbBusinessRow | null, resources: DbResourceRow[]): BusinessProfile {
  if (!row) return { resources: [] };
  return {
    id: row.id,
    businessName: row.name,
    websiteUrl: row.website ?? undefined,
    industry: row.industry ?? undefined,
    description: row.description ?? undefined,
    detailedInfo: row.detailed_info ?? undefined,
    audience: row.target_audience ?? undefined,
    onboardingComplete: row.onboarding_complete,
    resources: resources.map((r) => ({
      id: r.id,
      type: (r.kind as BusinessResource["type"]) || "document",
      name: r.title || r.file_name || r.url || "Resource",
      value: r.kind === "link" ? r.url ?? "" : r.kind === "note" ? r.notes ?? "" : r.file_path ?? "",
      size: r.file_size ?? undefined,
      mimeType: r.mime_type ?? undefined,
      addedAt: r.created_at,
    })),
  };
}

export function useBusinessProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile>({ resources: [] });
  const [loading, setLoading] = useState(true);
  const migratedRef = useRef(false);

  const dismissedAt =
    typeof window !== "undefined" ? localStorage.getItem(DISMISS_KEY) ?? undefined : undefined;

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile({ resources: [] });
      setLoading(false);
      return;
    }
    const [{ data: bizRow }, { data: resRows }] = await Promise.all([
      supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("business_resources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);
    const next = rowToProfile(bizRow as DbBusinessRow | null, (resRows ?? []) as DbResourceRow[]);
    next.enrichmentDismissedAt = dismissedAt;
    setProfile(next);
    setLoading(false);
  }, [user, dismissedAt]);

  // One-time migration of legacy localStorage profile into DB
  const migrateLegacy = useCallback(async () => {
    if (!user || migratedRef.current) return;
    migratedRef.current = true;
    try {
      const raw = localStorage.getItem("businessProfile");
      if (!raw) return;
      const legacy = JSON.parse(raw);
      // Only migrate if there's no DB profile yet
      const { data: existing } = await supabase
        .from("business_profiles")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      if (existing) {
        localStorage.removeItem("businessProfile");
        return;
      }
      if (!legacy.businessName) return;
      await supabase.from("business_profiles").insert({
        user_id: user.id,
        name: legacy.businessName,
        website: legacy.websiteUrl ?? null,
        industry: legacy.industry ?? null,
        description: legacy.description ?? null,
        detailed_info: legacy.detailedInfo ?? null,
        target_audience: legacy.audience ?? null,
        onboarding_complete: localStorage.getItem("onboardingComplete") === "true",
      });
      localStorage.removeItem("businessProfile");
    } catch (e) {
      console.warn("Legacy migration skipped:", e);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    migrateLegacy().then(() => refresh());
  }, [user, migrateLegacy, refresh]);

  const update = useCallback(
    async (patch: Partial<BusinessProfile>) => {
      if (!user) return;
      const fields: {
        name?: string;
        website?: string | null;
        industry?: string | null;
        description?: string | null;
        detailed_info?: string | null;
        target_audience?: string | null;
        onboarding_complete?: boolean;
      } = {};
      if (patch.businessName !== undefined) fields.name = patch.businessName;
      if (patch.websiteUrl !== undefined) fields.website = patch.websiteUrl || null;
      if (patch.industry !== undefined) fields.industry = patch.industry || null;
      if (patch.description !== undefined) fields.description = patch.description || null;
      if (patch.detailedInfo !== undefined) fields.detailed_info = patch.detailedInfo || null;
      if (patch.audience !== undefined) fields.target_audience = patch.audience || null;
      if (patch.onboardingComplete !== undefined) fields.onboarding_complete = patch.onboardingComplete;

      if (profile.id) {
        await supabase.from("business_profiles").update(fields).eq("id", profile.id);
      } else {
        await supabase.from("business_profiles").insert({
          user_id: user.id,
          name: fields.name ?? "My Business",
          website: fields.website ?? null,
          industry: fields.industry ?? null,
          description: fields.description ?? null,
          detailed_info: fields.detailed_info ?? null,
          target_audience: fields.target_audience ?? null,
          onboarding_complete: fields.onboarding_complete ?? false,
        });
      }
      await refresh();
    },
    [user, profile.id, refresh]
  );

  const addResources = useCallback(
    async (items: Omit<BusinessResource, "id" | "addedAt">[]) => {
      if (!user) return;
      const rows = items.map((it) => ({
        user_id: user.id,
        business_profile_id: profile.id ?? null,
        kind: it.type,
        title: it.name,
        url: it.type === "link" ? it.value : null,
        notes: it.type === "note" ? it.value : null,
        file_name: it.type === "document" ? it.name : null,
        file_path: it.type === "document" ? it.value : null,
        file_size: it.size ?? null,
        mime_type: it.mimeType ?? null,
      }));
      await supabase.from("business_resources").insert(rows);
      await refresh();
    },
    [user, profile.id, refresh]
  );

  const removeResource = useCallback(
    async (id: string) => {
      const target = profile.resources?.find((r) => r.id === id);
      if (target?.type === "document" && target.value) {
        await supabase.storage.from("business-resources").remove([target.value]);
      }
      await supabase.from("business_resources").delete().eq("id", id);
      await refresh();
    },
    [profile.resources, refresh]
  );

  const dismissEnrichment = useCallback(() => {
    const ts = new Date().toISOString();
    localStorage.setItem(DISMISS_KEY, ts);
    setProfile((p) => ({ ...p, enrichmentDismissedAt: ts }));
  }, []);

  return {
    profile,
    loading,
    missing: getMissingFields(profile),
    update,
    addResources,
    removeResource,
    dismissEnrichment,
    refresh,
  };
}
