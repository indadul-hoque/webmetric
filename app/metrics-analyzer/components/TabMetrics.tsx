import React from "react";
import {
  Sparkles,
  Info,
  Layers,
  BarChart3,
  Smartphone,
  Database,
} from "lucide-react";
import { LocalResult, LighthouseResult, getScoreColor } from "../../types";

interface TabMetricsProps {
  localData: LocalResult;
  lhData: LighthouseResult | null;
}

export const TabMetrics: React.FC<TabMetricsProps> = ({
  localData,
  lhData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        {/* LIGHTHOUSE DIALS */}
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Lighthouse Performance Indexes</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Performance",
                score: lhData?.scores?.performance ?? 0,
                desc: "Speed and loading metrics",
              },
              {
                label: "Accessibility",
                score:
                  lhData?.scores?.accessibility ??
                  localData.accessibility.score,
                desc: "Ease of use by disabled",
              },
              {
                label: "Best Practices",
                score:
                  lhData?.scores?.bestPractices ??
                  localData.bestPractices.score,
                desc: "Web standard conformity",
              },
              {
                label: "SEO Config",
                score: lhData?.scores?.seo ?? localData.seo.score,
                desc: "Search Engine optimized",
              },
            ].map((d, i) => {
              const hasLh = lhData !== null || d.label !== "Performance";
              const finalScore = hasLh ? d.score : 0;
              const conf = getScoreColor(finalScore);
              const radius = 34;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset =
                circumference - (finalScore / 100) * circumference;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-3 rounded-xl bg-zinc-950/40 border border-zinc-900"
                >
                  <div className="relative h-20 w-20 flex items-center justify-center mb-3">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        className="stroke-zinc-800 fill-none"
                        strokeWidth="6"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        className="fill-none transition-all duration-1000 ease-out"
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={
                          hasLh ? strokeDashoffset : circumference
                        }
                        stroke={conf.stroke}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      className={`absolute font-mono text-xl font-extrabold ${hasLh ? conf.text : "text-zinc-600"}`}
                    >
                      {hasLh ? finalScore : "--"}
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-zinc-200">
                    {d.label}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1">
                    {d.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {!lhData && (
            <div className="mt-6 p-4 rounded-xl bg-blue-950/20 border border-blue-900/50 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300 leading-normal">
                <strong>Performance evaluation in progress:</strong> Google
                Lighthouse insights are loading in the background. View local
                resource measurements and SEO data below in the meantime.
              </p>
            </div>
          )}
        </div>

        {/* CORE WEB VITALS */}
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Real-User Load Metrics (Core Web Vitals)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Largest Contentful Paint (LCP)",
                val: lhData?.metrics?.lcp ?? "Pending",
                info: "Measures loading performance. Crucial for good UX.",
                rating: lhData
                  ? parseFloat(lhData.metrics.lcp) <= 2.5
                    ? "Good"
                    : parseFloat(lhData.metrics.lcp) <= 4.0
                      ? "Need Work"
                      : "Poor"
                  : "Pending",
              },
              {
                title: "Cumulative Layout Shift (CLS)",
                val: lhData?.metrics?.cls ?? "Pending",
                info: "Measures visual stability. Prevent random shifts.",
                rating: lhData
                  ? parseFloat(lhData.metrics.cls) <= 0.1
                    ? "Good"
                    : parseFloat(lhData.metrics.cls) <= 0.25
                      ? "Need Work"
                      : "Poor"
                  : "Pending",
              },
              {
                title: "First Contentful Paint (FCP)",
                val: lhData?.metrics?.fcp ?? "Pending",
                info: "Measures time to first content rendering.",
                rating: lhData
                  ? parseFloat(lhData.metrics.fcp) <= 1.8
                    ? "Good"
                    : parseFloat(lhData.metrics.fcp) <= 3.0
                      ? "Need Work"
                      : "Poor"
                  : "Pending",
              },
            ].map((v, i) => {
              const color =
                v.rating === "Good"
                  ? "text-emerald-400"
                  : v.rating === "Need Work"
                    ? "text-amber-400"
                    : v.rating === "Poor"
                      ? "text-rose-400"
                      : "text-zinc-600";
              return (
                <div
                  key={i}
                  className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs text-zinc-500 font-medium mb-1">
                      {v.title}
                    </p>
                    <p className="text-sm text-zinc-400 font-sans leading-snug">
                      {v.info}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-6">
                    <span className="text-xl font-bold font-mono text-white">
                      {v.val}
                    </span>
                    <span
                      className={`text-xs font-extrabold uppercase font-mono ${color}`}
                    >
                      {v.rating}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ALLOCATION CHART */}
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <span>Payload Asset Allocation</span>
          </h3>

          {(() => {
            const js = localData.resources.scripts.total;
            const css = localData.resources.stylesheets.total;
            const img = localData.resources.images.total;
            const ln = localData.resources.links.total;
            const total = js + css + img + ln || 1;

            const pctJs = (js / total) * 100;
            const pctCss = (css / total) * 100;
            const pctImg = (img / total) * 100;
            const pctLn = (ln / total) * 100;

            return (
              <div>
                <div className="h-6 w-full rounded-lg overflow-hidden flex mb-6">
                  {js > 0 && (
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${pctJs}%` }}
                    />
                  )}
                  {css > 0 && (
                    <div
                      className="h-full bg-pink-500"
                      style={{ width: `${pctCss}%` }}
                    />
                  )}
                  {img > 0 && (
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${pctImg}%` }}
                    />
                  )}
                  {ln > 0 && (
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${pctLn}%` }}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-blue-500 rounded" />
                    <div>
                      <p className="text-xs text-zinc-400">Scripts ({js})</p>
                      <p className="text-sm font-semibold text-white font-mono">
                        {Math.round(pctJs)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-pink-500 rounded" />
                    <div>
                      <p className="text-xs text-zinc-400">
                        Stylesheets ({css})
                      </p>
                      <p className="text-sm font-semibold text-white font-mono">
                        {Math.round(pctCss)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-emerald-500 rounded" />
                    <div>
                      <p className="text-xs text-zinc-400">Images ({img})</p>
                      <p className="text-sm font-semibold text-white font-mono">
                        {Math.round(pctImg)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-indigo-500 rounded" />
                    <div>
                      <p className="text-xs text-zinc-400">Anchors ({ln})</p>
                      <p className="text-sm font-semibold text-white font-mono">
                        {Math.round(pctLn)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between text-xs text-zinc-400 font-mono">
                  <span>
                    Estim. Raw HTML Size:{" "}
                    <strong className="text-white">
                      {localData.pageSizeKb} KB
                    </strong>
                  </span>
                  <span>
                    Unpacked Elements density:{" "}
                    <strong className="text-white">Medium</strong>
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* DEVICE VISUAL PREVIEW & HEADERS */}
      <div className="space-y-6">
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col items-center">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6 self-start flex items-center gap-2 w-full">
            <Smartphone className="h-4 w-4 text-indigo-400" />
            <span>Device Capture</span>
          </h3>

          {lhData?.screenshot ? (
            <div className="w-full relative rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 aspect-[3/4] flex items-start justify-center shadow-inner group">
              <img
                src={lhData.screenshot}
                alt="Capture"
                className="w-full h-full object-cover object-top hover:object-bottom transition-all duration-[6000ms] ease-in-out cursor-ns-resize"
              />
              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono">
                Hover to scroll
              </div>
            </div>
          ) : (
            <div className="w-full rounded-xl border border-dashed border-zinc-800 aspect-[3/4] flex flex-col items-center justify-center text-center p-6 bg-zinc-950/20">
              <Smartphone className="h-10 w-10 text-zinc-700 animate-pulse mb-3" />
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
                Visualizing Render
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-indigo-400" />
            <span>Response Headers</span>
          </h3>
          <div className="space-y-2 font-mono text-[11px]">
            {Object.keys(localData.headers).length > 0 ? (
              Object.entries(localData.headers).map(([k, v]) => (
                <div
                  key={k}
                  className="p-2 bg-zinc-950/60 rounded border border-zinc-900/60 break-all pr-2"
                >
                  <span className="text-yellow-600 font-semibold">{k}:</span>
                  <span className="text-zinc-300 ml-1.5">{v}</span>
                </div>
              ))
            ) : (
              <div className="text-zinc-600 text-xs italic p-4 text-center">
                No metadata system headers captured
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
