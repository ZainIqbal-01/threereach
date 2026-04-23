import { useState, useEffect } from "react";

export function useBusinessName(fallback = "Your Company") {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("businessProfile");
      if (stored) {
        const profile = JSON.parse(stored);
        if (profile.businessName?.trim()) {
          setName(profile.businessName.trim());
        }
      }
    } catch {}
  }, []);

  return name;
}
