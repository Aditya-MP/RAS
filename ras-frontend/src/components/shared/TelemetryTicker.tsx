"use client";

import React from "react";
import { Terminal, Shield, Cpu, Activity } from "lucide-react";

const mockPlacements = [
  { role: "Senior Frontend Engineer", company: "Astro Labs", score: "98th", tci: "0.98", chaos: "95%" },
  { role: "DevOps Architect", company: "Vanta.io", score: "99th", tci: "0.99", chaos: "99%" },
  { role: "Django Backend Lead", company: "Acme Labs", score: "96th", tci: "0.96", chaos: "92%" },
  { role: "Fullstack JS Developer", company: "Lumen Corp", score: "95th", tci: "0.95", chaos: "94%" },
  { role: "Systems Engineer", company: "Helix Inc", score: "97th", tci: "0.97", chaos: "98%" },
  { role: "Site Reliability Specialist", company: "Forma Tech", score: "98th", tci: "0.98", chaos: "96%" },
  { role: "Python Core Developer", company: "Oryzo AI", score: "96th", tci: "0.96", chaos: "91%" },
];

export default function TelemetryTicker() {
  // Double the array for seamless infinite looping scroll
  const doubledPlacements = [...mockPlacements, ...mockPlacements, ...mockPlacements];

  return (
    <section className="py-24 relative bg-[#050814]/20 border-t border-white/5 overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-semibold text-accent uppercase tracking-widest font-outfit px-3.5 py-1.5 glass rounded-full border border-white/5 shadow-md">
            Telemetry Feed
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
            Live Candidate Placement Telemetry
          </h2>
          <p className="text-slate-400 leading-relaxed font-sans">
            Monitor real-time sandbox matches, collaboration scores (TCI), and chaos resilience index levels globally.
          </p>
        </div>

        {/* Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left stats panel */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-xl text-accent">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                    Verified Calibration
                  </h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Every sandbox calibration index is cryptographic-hash locked using telemetry verification standards.
                </p>
              </div>
              <div className="mt-12 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-outfit text-white">4,819</span>
                <span className="text-xs text-accent font-semibold">Matched Developers</span>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                    Compute Latency
                  </h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Serverless Monaco Sandbox execution instances compile and start up under gVisor in under 850ms.
                </p>
              </div>
              <div className="mt-12 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-outfit text-white">82ms</span>
                <span className="text-xs text-indigo-400 font-semibold">Avg Sandbox Exec</span>
              </div>
            </div>
          </div>

          {/* Right scrolling terminal */}
          <div className="lg:col-span-8">
            <div className="h-full bg-slate-950/70 border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
              {/* Terminal Window Header */}
              <div className="px-6 py-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  <Terminal className="w-3 h-3" />
                  hirehub@sandbox:~ telemetry-logs
                </div>
                <div className="w-12" /> {/* spacer */}
              </div>

              {/* Scrolling Content viewport */}
              <div className="p-6 flex-1 h-[320px] relative overflow-hidden font-mono text-xs select-none">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none z-10" />

                {/* Inline CSS animation injection to make it self-contained */}
                <style>{`
                  @keyframes ticker-scroll {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-33.33%); }
                  }
                  .animate-ticker {
                    animation: ticker-scroll 25s linear infinite;
                  }
                  .animate-ticker:hover {
                    animation-play-state: paused;
                  }
                `}</style>

                {/* Log Line Ticker Container */}
                <div className="animate-ticker flex flex-col gap-3">
                  {doubledPlacements.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-4 bg-white/[0.01] border border-white/[0.03] rounded-xl hover:bg-white/[0.03] transition-colors gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <Activity className="w-3.5 h-3.5 text-accent animate-pulse shrink-0" />
                        <span className="text-slate-400">
                          <span className="text-accent font-semibold">{item.role}</span> matched at{" "}
                          <span className="text-white font-semibold">{item.company}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-500 shrink-0">
                        <span>Rank: <span className="text-yellow-400 font-bold">{item.score}</span></span>
                        <span>TCI: <span className="text-indigo-400 font-semibold">{item.tci}</span></span>
                        <span>Chaos Index: <span className="text-rose-400 font-semibold">{item.chaos}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
