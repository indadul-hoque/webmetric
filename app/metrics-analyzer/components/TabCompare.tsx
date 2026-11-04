import React from "react";
import { HistoryItem, getScoreColor } from "../../types";

interface TabCompareProps {
  compareUrls: string[];
  history: HistoryItem[];
  onRemoveCompare: (url: string, e: React.MouseEvent) => void;
}

export const TabCompare: React.FC<TabCompareProps> = ({
  compareUrls,
  history,
  onRemoveCompare,
}) => {
  const itemA = history.find((h) => h.url === compareUrls[0]);
  const itemB = history.find((h) => h.url === compareUrls[1]);

  if (!itemA || !itemB) {
    return (
      <div className="text-zinc-500 italic p-6">
        Comparison components are missing from logs. Run scans again first.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[itemA, itemB].map((item, idx) => {
        const scorePerf = item.lighthouse?.scores?.performance ?? 0;
        const scoreSeo = item.lighthouse?.scores?.seo ?? item.local.seo.score;
        const scoreAcc =
          item.lighthouse?.scores?.accessibility ??
          item.local.accessibility.score;
        const scoreBp =
          item.lighthouse?.scores?.bestPractices ??
          item.local.bestPractices.score;

        return (
          <div
            key={idx}
            className="p-6 bg-zinc-900/40 border border-zinc-805 rounded-2xl space-y-6"
          >
            <div className="pb-4 border-b border-zinc-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs uppercase font-bold text-zinc-500 font-mono">
                  WEBSITE {idx === 0 ? "A" : "B"}
                </span>
                <button
                  onClick={(e) => onRemoveCompare(item.url, e)}
                  className="text-[10px] text-rose-400 font-bold hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <span className="font-bold text-lg text-white truncate block">
                {item.local.domain}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: "Perf", score: scorePerf },
                { label: "SEO", score: scoreSeo },
                { label: "Access", score: scoreAcc },
                { label: "Security", score: scoreBp },
              ].map((met, mi) => (
                <div
                  key={mi}
                  className="p-2 bg-zinc-950/40 rounded-xl border border-zinc-900"
                >
                  <span
                    className={`text-base font-extrabold block ${getScoreColor(met.score).text}`}
                  >
                    {met.score}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-zinc-500 mt-1 block">
                    {met.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  label: "DNS Load duration",
                  val: `${item.local.loadTimeMs}ms`,
                },
                {
                  label: "HTML document size",
                  val: `${item.local.pageSizeKb}KB`,
                },
                {
                  label: "Total script references",
                  val: item.local.resources.scripts.total,
                },
                {
                  label: "Stylesheet imports",
                  val: item.local.resources.stylesheets.total,
                },
                {
                  label: "Image media elements",
                  val: item.local.resources.images.total,
                },
                {
                  label: "Anchor references",
                  val: item.local.resources.links.total,
                },
              ].map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="flex justify-between py-1.5 border-b border-zinc-850"
                >
                  <span className="text-zinc-400">{row.label}:</span>
                  <span className="text-zinc-200 font-mono font-semibold">
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
