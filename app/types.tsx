export interface AuditResult {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue?: string;
  category: string;
}

export interface LocalResult {
  url: string;
  domain: string;
  protocol: string;
  loadTimeMs: number;
  pageSizeKb: number;
  headers: Record<string, string>;
  meta: {
    title?: string;
    description?: string;
    keywords?: string;
    viewport?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    charset?: string;
    robots?: string;
  };
  resources: {
    scripts: {
      total: number;
      external: number;
      inline: number;
      sources: string[];
    };
    stylesheets: {
      total: number;
      external: number;
      inline: number;
      sources: string[];
    };
    images: {
      total: number;
      webpOrAvif: number;
      legacy: number;
      missingAlt: number;
      sources: { src: string; alt?: string }[];
    };
    links: {
      total: number;
      internal: number;
      external: number;
      list: string[];
    };
  };
  headings: {
    total: number;
    h1Count: number;
    structure: { tag: string; text: string }[];
  };
  seo: {
    score: number;
    passes: string[];
    warnings: string[];
    errors: string[];
  };
  accessibility: {
    score: number;
    passes: string[];
    warnings: string[];
    errors: string[];
  };
  bestPractices: {
    score: number;
    passes: string[];
    warnings: string[];
    errors: string[];
  };
}

export interface LighthouseResult {
  url: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    fcp: string;
    lcp: string;
    cls: string;
    tbt: string;
    speedIndex: string;
    interactive: string;
  };
  crux: {
    overallStatus: string;
    metrics: { lcp: number | null; cls: number | null; inp: number | null };
  };
  audits: AuditResult[];
  screenshot: string | null;
}

export interface HistoryItem {
  url: string;
  local: LocalResult;
  lighthouse: LighthouseResult | null;
  timestamp: number;
}

export type ScoreColorConfig = {
  text: string;
  border: string;
  bg: string;
  stroke: string;
};

export function getScoreColor(score: number): ScoreColorConfig {
  if (score >= 90)
    return {
      text: "text-emerald-400",
      border: "border-emerald-500",
      bg: "bg-emerald-500/10",
      stroke: "#34d399",
    };
  if (score >= 50)
    return {
      text: "text-amber-400",
      border: "border-amber-500",
      bg: "bg-amber-500/10",
      stroke: "#fbbf24",
    };
  return {
    text: "text-coral-400",
    border: "border-rose-500",
    bg: "bg-rose-500/10",
    stroke: "#f87171",
  };
}
