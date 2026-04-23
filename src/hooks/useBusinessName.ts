import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useBusinessName(fallback = "Your Company") {
  const { user } = useAuth();
  const [name, setName] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) {
        // Fallback to legacy localStorage during transition
        try {
          const raw = localStorage.getItem("businessProfile");
          if (raw) {
            const p = JSON.parse(raw);
            if (p?.businessName?.trim()) setName(p.businessName.trim());
          }
        } catch { /* ignore */ }
        return;
      }
      const { data } = await supabase
        .from("business_profiles")
        .select("name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled && data?.name) setName(data.name);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return name;
}
