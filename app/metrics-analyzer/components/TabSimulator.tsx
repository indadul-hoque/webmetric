import React from "react";
import { Zap } from "lucide-react";
import { LocalResult } from "../../types";

interface TabSimulatorProps {
  localData: LocalResult;
  simConnection: "3g-slow" | "3g-fast" | "4g" | "wifi";
  setSimConnection: (val: "3g-slow" | "3g-fast" | "4g" | "wifi") => void;
}

export const TabSimulator: React.FC<TabSimulatorProps> = ({
  localData,
  simConnection,
  setSimConnection,
}) => {
  const calculateSimulatedSpeed = () => {
    const baseSize = localData.pageSizeKb;
    const imageSize = localData.resources.images.total * 120;
    const scriptSize = localData.resources.scripts.total * 60;
    const cssSize = localData.resources.stylesheets.total * 30;
    const totalSizeKb = baseSize + imageSize + scriptSize + cssSize;

    let latency = 20;
    let downloadSpeedKbps = 100000;

    if (simConnection === "3g-slow") {
      latency = 400;
      downloadSpeedKbps = 400;
    } else if (simConnection === "3g-fast") {
      latency = 150;
      downloadSpeedKbps = 1600;
    } else if (simConnection === "4g") {
      latency = 45;
      downloadSpeedKbps = 12000;
    } else {
      latency = 10;
      downloadSpeedKbps = 80000;
    }

    const downloadTimeSec = totalSizeKb / (downloadSpeedKbps / 8);
    const finalSeconds =
      downloadTimeSec +
      (latency / 1000) * 8 +
      localData.resources.scripts.total * 0.05;

    return {
      time: Math.round(finalSeconds * 10) / 10,
      sizeMb: Math.round((totalSizeKb / 1024) * 100) / 100,
    };
  };

  const simResult = calculateSimulatedSpeed();
  const connections = [
    {
      id: "3g-slow",
      title: "Slow 3G Network",
      speed: "400 Kbps",
      ping: "400ms",
    },
    {
      id: "3g-fast",
      title: "Fast 3G Network",
      speed: "1.6 Mbps",
      ping: "150ms",
    },
    { id: "4g", title: "High speed 4G", speed: "12.0 Mbps", ping: "45ms" },
    { id: "wifi", title: "Fiber Broadband", speed: "80.0 Mbps", ping: "10ms" },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-zinc-400 tracking-widest uppercase mb-4">
          Connection Profiles
        </h3>
        {connections.map((conn) => (
          <button
            key={conn.id}
            onClick={() => setSimConnection(conn.id)}
            className={`w-full p-4 rounded-xl border flex justify-between items-center text-left transition cursor-pointer ${simConnection === conn.id ? "bg-blue-600/10 border-blue-500 text-white" : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:border-zinc-800/80"}`}
          >
            <div>
              <p className="text-sm font-bold text-zinc-200">{conn.title}</p>
              <p className="text-xs text-zinc-500 mt-1">
                Bandwidth: {conn.speed}
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              RTT: {conn.ping}
            </span>
          </button>
        ))}
      </div>

      <div className="lg:col-span-2 p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span>Emulated Rendering Timeline</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">
                Estimated Load Time
              </span>
              <span className="text-4xl font-extrabold font-mono text-white mt-2 block">
                {simResult.time}s
              </span>
            </div>
            <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">
                Evaluated Asset Payload
              </span>
              <span className="text-4xl font-extrabold font-mono text-white mt-2 block">
                {simResult.sizeMb}MB
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                event: "DNS connection & TLS handshaking",
                t: simResult.time * 0.1,
              },
              {
                event: "Server response document (TTFB)",
                t: simResult.time * 0.25,
              },
              {
                event: "Styling files parsing (CSS block)",
                t: simResult.time * 0.45,
              },
              {
                event: "Dynamic scripting rendering (JS engine)",
                t: simResult.time * 0.75,
              },
              { event: "Fully Loaded Interactive Layout", t: simResult.time },
            ].map((stepItem, index) => {
              const percentage = (stepItem.t / simResult.time) * 100;
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300 font-sans">
                      {stepItem.event}
                    </span>
                    <span className="text-zinc-550">
                      {Math.round(stepItem.t * 10) / 10}s
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500/80"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-800 text-xs text-zinc-500">
          * Note: Calculations are emulated mathematically based on metrics
          weights.
        </div>
      </div>
    </div>
  );
};
