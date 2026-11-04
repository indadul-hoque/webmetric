import React from "react";
import { FileText } from "lucide-react";
import { LocalResult } from "../../types";

interface TabSeoProps {
  localData: LocalResult;
}

export const TabSeo: React.FC<TabSeoProps> = ({ localData }) => {
  const metaRows = [
    {
      label: "Document Title",
      val: localData.meta.title || "Not Found",
      check: !!localData.meta.title,
    },
    {
      label: "Description Tag",
      val: localData.meta.description || "Not Found",
      check: !!localData.meta.description,
    },
    {
      label: "Viewport Settings",
      val: localData.meta.viewport || "Not Configured",
      check: !!localData.meta.viewport,
    },
    {
      label: "Og:Title",
      val: localData.meta.ogTitle || "Not Configured",
      check: !!localData.meta.ogTitle,
    },
    {
      label: "Og:Description",
      val: localData.meta.ogDescription || "Not Configured",
      check: !!localData.meta.ogDescription,
    },
    {
      label: "Og:Image Src",
      val: localData.meta.ogImage || "Not Configured",
      check: !!localData.meta.ogImage,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-6">
        <h3 className="text-sm font-bold text-zinc-400 tracking-widest uppercase mb-4">
          Metadata Diagnostic Checks
        </h3>
        <div className="space-y-4 text-sm">
          {metaRows.map((me, i) => (
            <div key={i} className="pb-3.5 border-b border-zinc-850">
              <div className="flex justify-between items-center mb-1">
                <span className="text-zinc-400 font-medium text-xs">
                  {me.label}
                </span>
                <span
                  className={`text-[10px] font-semibold font-mono ${me.check ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {me.check ? "Present" : "Missing"}
                </span>
              </div>
              <p className="text-white text-sm font-mono break-all pr-2">
                {me.val}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <h4 className="text-xs uppercase font-bold text-zinc-500 mb-4 font-mono">
            Google SERP Simulator
          </h4>
          <div className="p-4 bg-white rounded-xl text-black">
            <p className="text-xs text-zinc-700 truncate mb-0.5">
              {localData.url}
            </p>
            <p className="text-blue-800 text-lg hover:underline cursor-pointer font-medium leading-tight truncate mb-1">
              {localData.meta.title || "Custom Webpage Title"}
            </p>
            <p className="text-sm text-zinc-800 leading-snug line-clamp-2 pr-6">
              {localData.meta.description ||
                "You do not have a meta description parsed."}
            </p>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <h4 className="text-xs uppercase font-bold text-zinc-500 mb-4 font-mono">
            OpenGraph Snippet Simulator
          </h4>
          <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 flex flex-col max-w-sm">
            {localData.meta.ogImage ? (
              <img
                src={localData.meta.ogImage}
                alt="og card representation"
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="h-44 w-full bg-zinc-900 flex flex-col items-center justify-center text-center p-6 border-b border-zinc-850">
                <FileText className="h-8 w-8 text-zinc-700 mb-2" />
                <span className="text-zinc-550 text-xs font-mono">
                  Missing OG Image tag
                </span>
              </div>
            )}
            <div className="p-4 flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                {localData.domain}
              </span>
              <span className="text-zinc-200 font-semibold text-sm mt-1 truncate">
                {localData.meta.ogTitle ||
                  localData.meta.title ||
                  "Og Page Title"}
              </span>
              <span className="text-zinc-400 text-xs mt-1 line-clamp-2">
                {localData.meta.ogDescription ||
                  localData.meta.description ||
                  "Social media preview description."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
