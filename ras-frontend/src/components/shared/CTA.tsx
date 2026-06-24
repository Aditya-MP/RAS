"use client";

import React from "react";
import { ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <footer className="relative overflow-hidden pt-32 pb-16 bg-[#050814]">
      {/* Background glowing gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-r from-primary/5 via-secondary/15 to-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Banner Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="glass p-12 sm:p-16 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col items-center text-center gap-8 shadow-2xl shadow-black/40"
        >
          {/* Inner mesh decoration */}
          <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />
          <div className="absolute top-[10%] left-[10%] w-[120px] h-[120px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[15%] right-[10%] w-[120px] h-[120px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <span className="flex items-center gap-2 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full uppercase tracking-widest font-mono">
            <Terminal className="w-3.5 h-3.5" />
            Integrity First Assessments
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-outfit text-white tracking-tight max-w-3xl leading-[1.15]">
            Ready to Discover Your Next Engineering Star?
          </h2>

          <p className="text-slate-450 max-w-xl leading-relaxed font-sans">
            Configure custom stack sandboxes, invite candidate cohorts, and receive fully calibrated collaboration assessments within 2 hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
            <button className="w-full sm:w-auto text-sm font-bold text-slate-950 px-8 py-4 bg-accent hover:bg-accent/90 rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
              Launch Sandbox Session
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="w-full sm:w-auto text-sm font-semibold text-slate-200 hover:text-white px-7 py-3.5 glass border border-white/10 hover:bg-white/5 rounded-full transition-all duration-200 cursor-pointer">
              Schedule Consultation
            </button>
          </div>
        </motion.div>

        {/* Footer Links & Credits */}
        <div className="mt-32 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-400">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-bold font-outfit text-white">
              Redrob <span className="text-accent">Sandbox</span>
            </span>
            <p className="text-xs leading-relaxed max-w-xs text-slate-400 font-sans">
              Futuristic recruitment reimagined. The ambient platform that identifies hidden engineering talents through multiplayer developer sandboxes.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Sandboxes", "Changelog"],
            },
            {
              title: "Integrations",
              links: ["Supabase Realtime", "Judge0 Compiler", "Gemini Socratic", "Llama DAC"],
            },
            {
              title: "Security",
              links: ["gVisor Sandbox", "HCD PDF Sanitizer", "Telemetry RLS", "Auth Scope-Lock"],
            },
          ].map((col, idx) => (
            <div key={idx} className="flex flex-col gap-4 select-none">
              <span className="text-sm font-bold text-white font-outfit">
                {col.title}
              </span>
              <ul className="flex flex-col gap-2.5 font-sans">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-slate-400 hover:text-white transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
          <span>&copy; {new Date().getFullYear()} Redrob Sandbox Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
