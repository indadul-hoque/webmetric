import React from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { LocalResult, LighthouseResult } from "../../types";

interface TabDiagnosticsProps {
  localData: LocalResult;
  lhData: LighthouseResult | null;
}

export const TabDiagnostics: React.FC<TabDiagnosticsProps> = ({
  localData,
  lhData,
}) => {
  const auditCategories = [
    { label: "SEO Checks", res: localData.seo },
    { label: "Accessibility Checks", res: localData.accessibility },
    { label: "Security & Standards", res: localData.bestPractices },
  ];

  const buildOptimizationList = () => {
    const list: { type: "err" | "warn"; msg: string; cat: string }[] = [];
    localData.seo.errors.forEach((msg) =>
      list.push({ type: "err", msg, cat: "SEO" }),
    );
    localData.seo.warnings.forEach((msg) =>
      list.push({ type: "warn", msg, cat: "SEO" }),
    );
    localData.accessibility.errors.forEach((msg) =>
      list.push({ type: "err", msg, cat: "Accessibility" }),
    );
    localData.accessibility.warnings.forEach((msg) =>
      list.push({ type: "warn", msg, cat: "Accessibility" }),
    );
    localData.bestPractices.errors.forEach((msg) =>
      list.push({ type: "err", msg, cat: "System" }),
    );
    localData.bestPractices.warnings.forEach((msg) =>
      list.push({ type: "warn", msg, cat: "System" }),
    );

    if (lhData?.audits) {
      lhData.audits.forEach((au) => {
        list.push({
          type: au.score < 0.5 ? "err" : "warn",
          msg: `${au.title}: ${au.description.replace(/\[Learn more\]\(.*?\)\./, "")}`,
          cat: `PSI (${au.category})`,
        });
      });
    }
    return list;
  };

  const optimizationList = buildOptimizationList();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {auditCategories.map((cat, idx) => (
          <div
            key={idx}
            className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl"
          >
            <h4 className="font-bold text-base mb-4 text-zinc-200">
              {cat.label}
            </h4>
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs py-1 border-b border-zinc-850">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{" "}
                  Passed
                </span>
                <span className="font-bold text-white font-mono">
                  {cat.res.passes.length}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-zinc-850">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />{" "}
                  Warnings
                </span>
                <span className="font-bold text-white font-mono">
                  {cat.res.warnings.length}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-zinc-850">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-rose-500" /> Failures
                </span>
                <span className="font-bold text-white font-mono">
                  {cat.res.errors.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
        <h3 className="text-sm font-bold text-zinc-300 tracking-widest uppercase mb-6">
          Recommended Optimizations
        </h3>
        <div className="space-y-4">
          {optimizationList.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 italic">
              No issues detected! Perfect compliance score.
            </div>
          ) : (
            optimizationList.map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${item.type === "err" ? "bg-rose-950/10 border-rose-900/40 hover:bg-rose-950/20" : "bg-amber-950/10 border-amber-900/40 hover:bg-amber-950/20"}`}
              >
                <div className="mt-0.5">
                  {item.type === "err" ? (
                    <XCircle className="h-5 w-5 text-rose-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[9px] font-extrabold uppercase border mb-1 inline-block ${item.type === "err" ? "bg-rose-500/10 border-rose-500/20 text-rose-450" : "bg-amber-500/10 border-amber-500/20 text-amber-450"}`}
                  >
                    {item.cat}
                  </span>
                  <p className="text-zinc-200 text-sm">{item.msg}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
