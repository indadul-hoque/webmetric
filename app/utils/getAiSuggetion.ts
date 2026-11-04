import { LocalResult, LighthouseResult } from "../types"; // Navigates up to your root types.tsx

export interface Suggestion {
  id: string;
  type: "critical" | "warning" | "success";
  category: "Performance" | "SEO" | "Accessibility" | "Security";
  title: string;
  description: string;
  fix: string;
}

export function getAiSuggestions(
  local: LocalResult | null,
  lh: LighthouseResult | null,
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  if (!local) return suggestions;

  // 1. Performance: Check Largest Contentful Paint via Lighthouse
  if (lh) {
    const lcpValue = parseFloat(lh.metrics.lcp);
    if (lcpValue > 2.5) {
      suggestions.push({
        id: "lcp-slow",
        type: lcpValue > 4.0 ? "critical" : "warning",
        category: "Performance",
        title: `High Largest Contentful Paint (${lh.metrics.lcp})`,
        description:
          "The main content of your page is taking too long to render visually for real users.",
        fix: "Compress hero banner image assets, eliminate render-blocking stylesheets, or use a content delivery network (CDN).",
      });
    }
  }

  // 2. Performance: Check overall uncompressed HTML weight
  if (local.pageSizeKb > 500) {
    suggestions.push({
      id: "page-weight",
      type: local.pageSizeKb > 1500 ? "critical" : "warning",
      category: "Performance",
      title: `Heavy HTML Document Size (${local.pageSizeKb} KB)`,
      description:
        "Your document baseline bundle is heavy. This increases total cellular network layout latencies.",
      fix: "Minify raw production scripts, prune unused code blocks, or trim large embedded inline style configurations.",
    });
  }

  // 3. Security: Enforce HTTPS Protocol
  if (local.protocol !== "https:") {
    suggestions.push({
      id: "insecure-http",
      type: "critical",
      category: "Security",
      title: "Insecure Connection Protocol",
      description:
        "The targeted network host serves traffic completely over unencrypted plain-text HTTP pathways.",
      fix: "Obtain an SSL/TLS security certificate instantly and force dynamic 301 server redirects to target safe HTTPS routes.",
    });
  }

  // 4. Accessibility: Look for images missing alt descriptions
  if (local.resources.images.missingAlt > 0) {
    suggestions.push({
      id: "missing-alts",
      type: local.resources.images.missingAlt > 3 ? "critical" : "warning",
      category: "Accessibility",
      title: `Missing Alt Text attributes (${local.resources.images.missingAlt} assets)`,
      description:
        "Some image graphics on the layout lack alternative text configurations required by assistive tools.",
      fix: "Incorporate semantic, descriptive 'alt=\"...\"' attribute values directly on your <img> tags so screen-readers can explain them.",
    });
  }

  // 5. SEO: Catch missing index-level descriptions
  if (!local.meta.description) {
    suggestions.push({
      id: "missing-seo-desc",
      type: "warning",
      category: "SEO",
      title: "Missing Search Index Meta Description",
      description:
        "Search engines are forced to guess text snippets in search engine result pages instead of showing a curated summary.",
      fix: 'Add a `<meta name="description" content="..." />` tag targeting a total description length between 50 and 160 characters.',
    });
  }

  // Fallback state if everything is green
  if (suggestions.length === 0) {
    suggestions.push({
      id: "perfect-score",
      type: "success",
      category: "Performance",
      title: "Excellent Optimization Standard Found",
      description:
        "Our core engine ran all local criteria metrics against this endpoint and returned minimal formatting errors.",
      fix: "Keep doing what you're doing. Continue tracking metrics across production builds to monitor structural regression bounds.",
    });
  }

  return suggestions;
}
