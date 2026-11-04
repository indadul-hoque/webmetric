import React from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";

interface ProgressOverlayProps {
  scanState: "local" | "lighthouse" | string;
  scanStep: number;
}

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({
  scanState,
  scanStep,
}) => {
  const steps = [
    {
      title: "Resolving DNS & SSL Check",
      desc: "Checking connection security and protocol headers",
    },
    {
      title: "HTML Page Analysis",
      desc: "Parsing web document structure and resources metadata",
    },
    {
      title: "PageSpeed Audit Query",
      desc: "Contacting Lighthouse reporting services",
    },
    {
      title: "Web Vitals Engine Calculation",
      desc: "Running paint and layout shift indicators",
    },
    {
      title: "Reviewing Code Aesthetics",
      desc: "Finalizing optimization checklists and previews",
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 md:p-8 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          <h3 className="font-bold text-lg">Scanning Destination</h3>
        </div>
        <span className="text-xs text-blue-400 font-mono uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/25">
          {scanState === "local"
            ? "Step 1: Local Parse"
            : "Step 2: Core Vitals"}
        </span>
      </div>

      <div className="w-full bg-zinc-950 rounded-full h-1.5 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-700"
          style={{ width: `${(scanStep / 5) * 100}%` }}
        ></div>
      </div>

      <div className="space-y-4">
        {steps.map((st, i) => {
          const isActive =
            (scanState === "local" && i < 2) ||
            (scanState === "lighthouse" && i >= 2);
          const isCompleted =
            (scanState === "local" && i < scanStep) ||
            (scanState === "lighthouse" && (i < 2 || i < scanStep));
          return (
            <div
              key={i}
              className={`flex items-start gap-3 transition-opacity duration-300 ${isCompleted ? "opacity-100" : isActive ? "opacity-100 animate-pulse" : "opacity-40"}`}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />
                ) : (
                  <div
                    className={`h-4 w-4 rounded-full border ${isActive ? "border-blue-400 border-t-transparent animate-spin" : "border-zinc-800"}`}
                  />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold leading-tight ${isActive ? "text-blue-300" : "text-zinc-200"}`}
                >
                  {st.title}
                </p>
                <p className="text-xs text-zinc-500 leading-none mt-1">
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
