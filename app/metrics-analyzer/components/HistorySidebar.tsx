import React from "react";
import { History, XCircle, Trash2 } from "lucide-react";
import { HistoryItem, getScoreColor } from "../../types";

interface HistorySidebarProps {
  history: HistoryItem[];
  compareUrls: string[];
  onClose: () => void;
  onLoadItem: (item: HistoryItem) => void;
  onClearItem: (url: string, e: React.MouseEvent) => void;
  onToggleCompare: (url: string, e: React.MouseEvent) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  compareUrls,
  onClose,
  onLoadItem,
  onClearItem,
  onToggleCompare,
}) => {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-zinc-950/95 border-l border-zinc-800 z-50 p-6 flex flex-col shadow-2xl glassmorphism">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-indigo-400" />
          <span>Inspection History</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-zinc-900 rounded-md cursor-pointer text-zinc-400"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {history.map((item, idx) => {
          const perf =
            item.lighthouse?.scores?.performance ||
            item.local?.seo?.score ||
            50;
          const { text, border, bg } = getScoreColor(perf);
          const isSelected = compareUrls.includes(item.url);
          return (
            <div
              key={idx}
              onClick={() => onLoadItem(item)}
              className="p-3 bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl cursor-pointer hover:bg-zinc-900/60 transition group relative"
            >
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <span className="font-medium text-sm text-zinc-100 truncate pr-5 group-hover:text-blue-400">
                  {item.local.domain}
                </span>
                <button
                  onClick={(e) => onClearItem(item.url, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded text-rose-400 absolute top-2 right-2 transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onToggleCompare(item.url, e)}
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border transition ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Compare
                  </button>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${bg} ${text} border ${border}`}
                  >
                    {perf}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
