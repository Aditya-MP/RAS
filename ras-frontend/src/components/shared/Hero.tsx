"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Auto-play fix for background video
  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.muted = true;
      bgVideoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
      });
    }
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVideoOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden bg-[#050814]">
      {/* Background Video aligned to the right half */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0 pointer-events-none select-none overflow-hidden">
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-75"
        >
          <source src="/Hero_Section_Background_Videos.mp4" type="video/mp4" />
        </video>
        {/* Horizontal Gradient Mask to blend video to the dark background on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050814] via-[#050814]/40 to-transparent z-10" />
        {/* Top/Bottom masks for smooth vertical integration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-transparent to-[#050814] z-10" />
      </div>

      {/* Cyber Mesh Overlay */}
      <div className="grid-bg absolute inset-0 opacity-15 z-0 pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center items-start relative z-10 w-full">
        {/* Main Split Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8">
            {/* New Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full shadow-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-mono">
                Now: Multiplayer Sandboxes
              </span>
            </motion.div>

            {/* Title (matches Hera.ai styling with Serif Lime highlight) */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-outfit leading-[1.1] text-white tracking-tight"
            >
              Hire the right developer. <br />
              <span className="text-accent italic font-serif font-medium text-4xl sm:text-5xl md:text-6xl tracking-wide block mt-2">
                10x faster.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-sans"
            >
              Redrob Sandbox is the AI recruiter that screens, interviews, and shortlists candidates for your team—without the spreadsheet chaos or biased guesswork.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto text-sm font-bold text-slate-950 px-8 py-4 bg-accent hover:bg-accent/90 rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-1.5 group cursor-pointer">
                Start hiring with Redrob
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="w-full sm:w-auto text-sm font-semibold text-slate-200 hover:text-white px-7 py-4 glass rounded-full border border-white/10 hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-slate-300 fill-slate-300 mr-1.5" />
                Watch 90-sec demo
              </button>
            </motion.div>

            {/* Badges / Security Checkmarks */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2 text-slate-400 text-xs font-semibold font-sans"
            >
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                SOC 2 Secured
              </span>
            </motion.div>
          </div>
        </div>

        {/* Brand/Trust Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 w-full pt-8 border-t border-white/5 relative z-10"
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4 font-mono">
            Trusted by talent teams at
          </span>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-sm font-semibold text-slate-400 font-sans">
            {["Northwind", "Acme Labs", "Lumen", "Helix", "Forma", "Vanta.io"].map((brand) => (
              <span key={brand} className="hover:text-slate-200 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Overlay Modal (Hera.ai Amber Glow style) */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setIsVideoOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Glowing Video Frame Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(220,80,0,0.55),_0_0_80px_rgba(220,80,0,0.25)] border border-orange-500/35"
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking the video
            >
              {/* Layered inner glow from CSS */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_30px_rgba(220,80,0,0.45)] z-10" />

              {/* Video Element */}
              <video
                src="/Hero_Section_Background_Videos.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
