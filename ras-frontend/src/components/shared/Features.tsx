"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

const featuresData = [
  {
    icon: Sparkles,
    iconColor: "text-accent",
    title: "AI Socratic Tech Lead",
    description:
      "A state-driven agent (ATL) that monitors candidate sessions and intervenes with Socratic hints, guiding logic without writing code.",
    metric: "Powered by Gemini 2.5 Pro",
    colSpan: "lg:col-span-2",
  },
  {
    icon: TrendingUp,
    iconColor: "text-primary",
    title: "Multidimensional Scoring",
    description:
      "Compiles passing test ratios, AI collaboration fluency indices, KDA keystroke rhythms, and peer calibration into a percentile rank.",
    metric: "7 weighted vectors",
    colSpan: "lg:col-span-1",
  },
  {
    icon: AlertTriangle,
    iconColor: "text-rose-500",
    title: "Real-world Chaos Injects",
    description:
      "Injects DB pool starvation, stale caches, deadlocks, and OOM terminations to test candidate adaptability under pressure.",
    metric: "10 cataloged failures",
    colSpan: "lg:col-span-1",
  },
  {
    icon: GitBranch,
    iconColor: "text-violet-400",
    title: "Architectural PageRank",
    description:
      "Parses AST import relationships to compute architectural influence. Rewards developers who build foundational dependencies.",
    metric: "PageRank influence graph",
    colSpan: "lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-emerald-400",
    title: "Hybrid Cascade Scan (HCD)",
    description:
      "Strips hidden visual & semantic prompt injections from candidate resumes, logging security bypass attempts for recruiters.",
    metric: "11 injection rules parsed",
    colSpan: "lg:col-span-2",
  },
  {
    icon: Activity,
    iconColor: "text-indigo-400",
    title: "Biometric Keystroke Dynamics",
    description:
      "Measures dwell times and release-to-press flight times. Classifies human composition vs. automated macro scripts.",
    metric: "1ms sampling resolution",
    colSpan: "lg:col-span-1",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function BentoCard({ feat }: { feat: typeof featuresData[0] }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    const width = rect.width;
    const height = rect.height;
    const rotateY = ((x - width / 2) / (width / 2)) * 8; // Max 8 deg rotation
    const rotateX = -((y - height / 2) / (height / 2)) * 8; // Max 8 deg rotation
    setRotate({ x: rotateX, y: rotateY });
  };

  const IconComponent = feat.icon;

  const tiltTransform = isHovered
    ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
    : "perspective(1000px) rotateX(0deg) rotateY(0deg)";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCoords({ x: 0, y: 0 });
        setRotate({ x: 0, y: 0 });
      }}
      variants={cardVariants}
      style={{
        transform: tiltTransform,
        transition: isHovered ? "none" : "transform 0.5s ease, y 0.5s ease",
      }}
      whileHover={{ y: -6 }}
      className={`glass-card p-8 rounded-3xl relative overflow-hidden group select-none cursor-pointer flex flex-col justify-between min-h-[300px] border border-white/5 ${feat.colSpan}`}
    >
      {/* Cursor Glow Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(132, 204, 22, 0.12), transparent 80%)`,
        }}
      />

      <div className="relative z-10">
        <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl w-fit mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10 shadow-lg shadow-black/20">
          <IconComponent className={`w-6 h-6 ${feat.iconColor}`} />
        </div>

        <h3 className="text-xl font-bold font-outfit text-white mb-3 group-hover:text-accent transition-colors duration-250">
          {feat.title}
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed font-sans">
          {feat.description}
        </p>
      </div>

      <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-6 relative z-10">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Metrics Scope
        </span>
        <span className="text-xs font-semibold text-slate-350 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 shadow-md shadow-black/10">
          {feat.metric}
        </span>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-28 relative overflow-hidden bg-[#050814]/40">
      {/* Ambient decoration */}
      <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-semibold text-accent uppercase tracking-widest font-outfit px-3.5 py-1.5 glass rounded-full border border-white/5 shadow-lg shadow-black/20"
          >
            Engineered Capabilities
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight"
          >
            Designed for the Future of Technical Hiring
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 leading-relaxed font-sans"
          >
            A complete collaborative evaluation engine that replaces generic algorithm questions with actual, live engineering behavior.
          </motion.p>
        </div>

        {/* Features Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresData.map((feat, idx) => (
            <BentoCard key={idx} feat={feat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
