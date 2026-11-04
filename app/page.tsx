"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Shield,
  ExternalLink,
  BarChart3,
  Award,
  FileText,
  Zap,
  ArrowUpDown,
  XCircle,
  Globe, // This is your lightweight Lucide SVG icon
} from "lucide-react";
import { LocalResult, LighthouseResult, HistoryItem } from "./types";

// Component Sub-modules Imports
import { Header } from "./metrics-analyzer/components/Header";
import { SearchInput } from "./metrics-analyzer/components/SearchInput";
import { HistorySidebar } from "./metrics-analyzer/components/HistorySidebar";
import { ProgressOverlay } from "./metrics-analyzer/components/ProgressOverlay";
import { TabMetrics } from "./metrics-analyzer/components/TabMetrics";
import { TabDiagnostics } from "./metrics-analyzer/components/TabDiagnostics";
import { TabSeo } from "./metrics-analyzer/components/TabSeo";
import { TabSimulator } from "./metrics-analyzer/components/TabSimulator";
import { TabCompare } from "./metrics-analyzer/components/TabCompare";
import { getAiSuggestions } from "./utils/getAiSuggetion";
import { AiSuggestionsPanel } from "./metrics-analyzer/components/AiSuggestionPanel";
export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<
    "metrics" | "audits" | "seo" | "simulator" | "compare"
  >("metrics");
  const [scanState, setScanState] = useState<
    "idle" | "local" | "lighthouse" | "completed" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [scanStep, setScanStep] = useState(0);

  const [localData, setLocalData] = useState<LocalResult | null>(null);
  const [lhData, setLhData] = useState<LighthouseResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [compareUrls, setCompareUrls] = useState<string[]>([]);
  const [simConnection, setSimConnection] = useState<
    "3g-slow" | "3g-fast" | "4g" | "wifi"
  >("4g");

  useEffect(() => {
    const saved = localStorage.getItem("webmetric_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("History parse failure", e);
      }
    }
  }, []);

  const saveToHistory = (
    local: LocalResult,
    lighthouse: LighthouseResult | null,
  ) => {
    const newItem: HistoryItem = {
      url: local.url,
      local,
      lighthouse,
      timestamp: Date.now(),
    };
    const filtered = history.filter(
      (item) => item.url.toLowerCase() !== local.url.toLowerCase(),
    );
    const updated = [newItem, ...filtered].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("webmetric_history", JSON.stringify(updated));
  };

  const handleScan = async (e?: React.FormEvent, testUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = testUrl || urlInput;
    if (!targetUrl) return;

    setScanState("local");
    setErrorMessage("");
    setScanStep(0);
    setLocalData(null);
    setLhData(null);

    const stepInterval = setInterval(() => {
      setScanStep((s) => (s < 1 ? s + 1 : s));
    }, 800);

    try {
      const localRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, mode: "local" }),
      });

      clearInterval(stepInterval);
      if (!localRes.ok) {
        const err = await localRes.json();
        throw new Error(err.error || "Failed to complete local scan");
      }

      const localResult: LocalResult = await localRes.json();
      setLocalData(localResult);
      setUrlInput(localResult.url);

      setScanState("lighthouse");
      setScanStep(2);

      const lhInterval = setInterval(() => {
        setScanStep((s) => (s >= 2 && s < 4 ? s + 1 : s));
      }, 2500);

      const lhRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: localResult.url, mode: "lighthouse" }),
      });

      clearInterval(lhInterval);

      let lhResult: LighthouseResult | null = null;
      if (lhRes.ok) {
        lhResult = await lhRes.json();
        setLhData(lhResult);
      }

      setScanStep(5);
      setScanState("completed");
      setActiveTab("metrics");
      saveToHistory(localResult, lhResult);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || "An execution error occurred.");
      setScanState("error");
    }
  };

  const toggleCompare = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareUrls.includes(url)) {
      setCompareUrls(compareUrls.filter((u) => u !== url));
    } else {
      setCompareUrls(
        compareUrls.length >= 2 ? [compareUrls[1], url] : [...compareUrls, url],
      );
    }
  };

  const tabsConfig = [
    { id: "metrics", label: "Metrics & Vitals", icon: BarChart3 },
    { id: "audits", label: "Diagnostics Checklist", icon: Award },
    { id: "seo", label: "SEO & Social Preview", icon: FileText },
    { id: "simulator", label: "Speed Simulator", icon: Zap },
    {
      id: "compare",
      label: "Compare Model",
      icon: ArrowUpDown,
      hidden: compareUrls.length < 2,
    },
  ] as const;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col font-sans grid-bg min-h-screen">
      <Header
        historyCount={history.length}
        compareCount={compareUrls.length}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onSelectCompareTab={() => setActiveTab("compare")}
      />

      <SearchInput
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        scanState={scanState}
        onScan={handleScan}
      />

      {showHistory && (
        <HistorySidebar
          history={history}
          compareUrls={compareUrls}
          onClose={() => setShowHistory(false)}
          onLoadItem={(item) => {
            setLocalData(item.local);
            setLhData(item.lighthouse);
            setUrlInput(item.url);
            setScanState("completed");
            setShowHistory(false);
            setActiveTab("metrics");
          }}
          onClearItem={(url, e) => {
            e.stopPropagation();
            const updated = history.filter((item) => item.url !== url);
            setHistory(updated);
            localStorage.setItem("webmetric_history", JSON.stringify(updated));
          }}
          onToggleCompare={toggleCompare}
        />
      )}

      {(scanState === "local" || scanState === "lighthouse") && (
        <ProgressOverlay scanState={scanState} scanStep={scanStep} />
      )}

      {scanState === "error" && (
        <div className="w-full max-w-xl mx-auto bg-rose-950/20 border border-rose-900 rounded-2xl p-6 mt-6 flex items-start gap-4">
          <XCircle className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-rose-400 text-lg">Analysis Failed</h3>
            <p className="text-zinc-300 text-sm mt-1">{errorMessage}</p>
            <button
              onClick={() => handleScan()}
              className="mt-4 px-4 py-2 bg-rose-900 text-white rounded-lg text-xs font-semibold hover:bg-rose-800 transition cursor-pointer"
            >
              Retry Analysis
            </button>
          </div>
        </div>
      )}

      {scanState === "completed" && localData && (
        <div className="w-full mt-2 flex flex-col gap-6">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-indigo-400" />
              <span className="font-mono text-sm tracking-tight text-white">
                {localData.url}
              </span>
              <a
                href={localData.url}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-zinc-300 transition"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-zinc-400">Fetch:</span>{" "}
                <span className="text-white font-semibold">
                  {localData.loadTimeMs}ms
                </span>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-zinc-400">SSL:</span>
                <span
                  className={`font-semibold ${localData.protocol === "https:" ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {localData.protocol === "https:"
                    ? "SECURED (TLS)"
                    : "INSECURE"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-px">
            {tabsConfig.map((t) => {
              if (t.hidden) return null;
              const isMatches = activeTab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium text-sm transition whitespace-nowrap cursor-pointer ${isMatches ? "border-blue-500 text-blue-400" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === "metrics" && (
            <TabMetrics localData={localData} lhData={lhData} />
          )}
          {activeTab === "audits" && (
            <TabDiagnostics localData={localData} lhData={lhData} />
          )}
          {activeTab === "seo" && <TabSeo localData={localData} />}
          {activeTab === "simulator" && (
            <TabSimulator
              localData={localData}
              simConnection={simConnection}
              setSimConnection={setSimConnection}
            />
          )}
          {activeTab === "compare" && (
            <TabCompare
              compareUrls={compareUrls}
              history={history}
              onRemoveCompare={toggleCompare}
            />
          )}
          {/* === NEW AI SUGGESTIONS SECTION HOOK === */}
          <div className="mt-4">
            <AiSuggestionsPanel
              suggestions={getAiSuggestions(localData, lhData)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
