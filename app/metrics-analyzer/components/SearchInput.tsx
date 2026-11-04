import React from "react";
import { Globe, RefreshCw, Search } from "lucide-react";

interface SearchInputProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  scanState: string;
  onScan: (e: React.FormEvent, testUrl?: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  urlInput,
  setUrlInput,
  scanState,
  onScan,
}) => {
  const isLoading = scanState === "local" || scanState === "lighthouse";

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center mb-8">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center tracking-tight mb-2">
        Evaluate Website <span className="text-gradient">Performance</span>{" "}
        Instantly
      </h2>
      <p className="text-zinc-400 text-center text-sm md:text-base max-w-lg mb-8">
        Detailed metrics diagnostics, asset optimization checklists, and
        PageSpeed core vital audits for any website.
      </p>

      <form onSubmit={onScan} className="w-full relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl blur-xl transition group-focus-within:from-blue-600/25 group-focus-within:to-indigo-600/25"></div>
        <div className="relative flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-2.5 shadow-xl glassmorphism">
          <Globe className="h-5 w-5 text-zinc-500 ml-3" />
          <input
            type="text"
            placeholder="Enter site domain or full URL (e.g. google.com)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-transparent px-2 text-white placeholder-zinc-500 outline-none text-sm md:text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !urlInput}
            className="px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm md:text-base hover:opacity-90 active:scale-95 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:pointer-events-none"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Analyze</span>
          </button>
        </div>
      </form>

      {scanState === "idle" && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-mono text-zinc-500">
          <span>Try these:</span>
          {["github.com", "wikipedia.org", "news.ycombinator.com"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={(e) => onScan(e, s)}
              className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
