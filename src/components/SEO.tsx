import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
}

/** Lightweight per-page SEO helper — updates document title + meta description + canonical. */
export function SEO({ title, description, canonical }: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes("Three Reach") ? title : `${title} · Three Reach AI`;
    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    const href = canonical || window.location.href.split("?")[0];
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [title, description, canonical]);

  return null;
}
