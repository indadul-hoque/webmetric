import React from "react";
import {
  Sparkles,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Suggestion } from "../../utils/getAiSuggetion"; // Relative local file import

interface Props {
  suggestions: Suggestion[];
}

export function AiSuggestionsPanel({ suggestions }: Props) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            AI Diagnostic Insights
          </h2>
          <p className="text-xs text-zinc-400">
            Automated performance and architecture improvement roadmap
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 transition-all duration-200 ${
              item.type === "critical"
                ? "bg-rose-950/10 border-rose-900/50 hover:border-rose-800"
                : item.type === "warning"
                  ? "bg-amber-950/10 border-amber-900/50 hover:border-amber-800"
                  : "bg-emerald-950/10 border-emerald-900/50 hover:border-emerald-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {item.type === "critical" && (
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              {item.type === "warning" && (
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              {item.type === "success" && (
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              )}

              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <span className="font-bold text-sm text-zinc-100">
                    {item.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-semibold ${
                      item.type === "critical"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : item.type === "warning"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-start gap-2 text-zinc-400 text-xs bg-zinc-950/30 p-2 rounded-lg">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-zinc-200 font-medium">
                      Actionable Fix:
                    </strong>{" "}
                    {item.fix}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
