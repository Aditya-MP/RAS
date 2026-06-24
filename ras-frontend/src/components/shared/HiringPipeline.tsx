"use client";

import React from "react";
import { Upload, GitBranch, Terminal, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const nodes = [
  {
    step: "01",
    icon: Upload,
    title: "Secure PDF Ingestion",
    description: "HCD stripping strips hidden visual/semantic prompt injections, outputting clean structured profile metadata.",
  },
  {
    step: "02",
    icon: GitBranch,
    title: "AST PageRank Scan",
    description: "Evaluates dependency architecture import links to quantify candidate framework and code organization design patterns.",
  },
  {
    step: "03",
    icon: Terminal,
    title: "Multiplayer Sandbox IDE",
    description: "Candidates solve real-world tickets collaboratively under state-driven AI Socratic Tech Lead steering.",
  },
  {
    step: "04",
    icon: LineChart,
    title: "Telemetry Ranking",
    description: "Calibrates biometric keystroke dynamics, AI collaboration fluency, and chaos resilience into final hiring index.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function HiringPipeline() {
  return (
    <section className="py-28 relative overflow-hidden bg-[#050814]/10 border-t border-white/5">
      <div className="grid-bg absolute inset-0 opacity-[0.08] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-24">
          <span className="text-[10px] font-semibold text-accent uppercase tracking-widest font-outfit px-3.5 py-1.5 glass rounded-full border border-white/5">
            Functional Stream
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
            How The Redrob Evaluation Funnel Works
          </h2>
          <p className="text-slate-400 leading-relaxed font-sans">
            From resume upload to final placement: a fully automated, integrity-locked candidate mapping system.
          </p>
        </div>

        {/* Pipeline Graphic */}
        <div className="relative">
          {/* Connecting SVG Path Line for desktop layout */}
          <div className="absolute top-[60px] left-[10%] right-[10%] h-[2px] hidden lg:block z-0">
            <svg className="w-full h-full" fill="none">
              <motion.line
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="url(#lime-indigo-grad)"
                strokeWidth="2"
                strokeDasharray="8 6"
                initial={{ strokeDashoffset: 100 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <defs>
                <linearGradient id="lime-indigo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Node Grid Layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10"
          >
            {nodes.map((node, idx) => {
              const IconComponent = node.icon;
              return (
                <motion.div
                  key={idx}
                  variants={nodeVariants}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 group cursor-default"
                >
                  {/* Step Circular Node */}
                  <div className="relative flex items-center justify-center">
                    {/* Ring Pulse outer */}
                    <div className="absolute inset-[-6px] bg-accent/5 border border-accent/10 rounded-full scale-95 group-hover:scale-105 group-hover:bg-accent/10 transition-all duration-350 z-0" />
                    
                    {/* Main Circle */}
                    <div className="w-[110px] h-[110px] rounded-full bg-slate-900 border border-white/5 flex items-center justify-center relative z-10 shadow-xl group-hover:border-accent/40 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-slate-400 group-hover:text-accent group-hover:scale-110 transition-all duration-350" />
                      
                      {/* Step float label */}
                      <span className="absolute -top-1 -right-1 text-[10px] font-mono font-bold text-slate-950 bg-accent px-2 py-0.5 rounded-full shadow-md">
                        {node.step}
                      </span>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="flex flex-col gap-3 max-w-xs">
                    <h3 className="text-lg font-bold font-outfit text-white group-hover:text-accent transition-colors duration-200">
                      {node.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-sans">
                      {node.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
