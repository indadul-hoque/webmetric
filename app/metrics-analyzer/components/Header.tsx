import React from "react";
import { Zap, History, ArrowUpDown } from "lucide-react";
import { HistoryItem } from "../../types";

interface HeaderProps {
  historyCount: number;
  compareCount: number;
  onToggleHistory: () => void;
  onSelectCompareTab: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  compareCount,
  onToggleHistory,
  onSelectCompareTab,
}) => {
  return (
    <header className="flex justify-between items-center mb-10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-1.5 leading-none">
            Web<span className="text-blue-400">Metric</span>
          </h1>
          <span className="text-xs text-zinc-500 font-mono">
            CORE WEB ANALYZER
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {historyCount > 0 && (
          <button
            onClick={onToggleHistory}
            className="px-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition cursor-pointer"
          >
            <History className="h-4 w-4 text-zinc-400" />
            <span>History ({historyCount})</span>
          </button>
        )}
        {compareCount > 0 && (
          <button
            onClick={onSelectCompareTab}
            disabled={compareCount < 2}
            className={`px-4 py-2 text-sm font-medium rounded-xl flex items-center gap-2 transition cursor-pointer ${
              compareCount >= 2
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
            }`}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Compare ({compareCount}/2)</span>
          </button>
        )}
      </div>
    </header>
  );
};
