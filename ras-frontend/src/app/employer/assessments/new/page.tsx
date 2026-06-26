"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Loader2,
  AlertTriangle
} from "lucide-react";

export default function NewAssessmentPage() {
  const { apiFetch } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jdText, setJdText] = useState("");
  const [seniorityLevel, setSeniorityLevel] = useState<"junior" | "mid" | "senior">("mid");
  const [techTrack, setTechTrack] = useState<"frontend" | "backend" | "devops" | "fullstack">("backend");
  const [maxCandidates, setMaxCandidates] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch("/api/assessments", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          jd_text: jdText,
          seniority_level: seniorityLevel,
          tech_track: techTrack,
          max_candidates: maxCandidates,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create assessment");
      }

      router.push("/employer/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to submit assessment.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative overflow-x-hidden">
      <div className="grid-bg absolute inset-0 opacity-5 pointer-events-none z-0" />
      <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-violet-900/12 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-fuchsia-900/8 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" style={{animationDelay: '3s'}} />

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-16 w-full">
          <div className="flex items-center gap-2">
            <Link href="/employer/dashboard" className="p-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white mr-2 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-black font-outfit text-sm">
              H
            </div>
            <span className="font-extrabold font-outfit text-white text-base">
              AI <span className="text-accent">HireHub</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="flex-1 max-w-[90%] lg:max-w-[1300px] w-full mx-auto px-6 py-12 relative z-10">
        <div className="vibrant-card p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col gap-8 rainbow-top-line">
          
          <div>
            <span className="text-[10px] font-mono font-bold bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded text-violet-400 uppercase tracking-widest">
              AI Skill Extraction
            </span>
            <h1 className="text-2xl font-bold font-outfit text-white mt-4 mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 text-violet-400" />
              <span className="shimmer-text">Create Assessment Challenge</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Define the requirements and paste the Job Description. The Ambient Tech Lead parses the description to extract target skills using Gemini AI automatically.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Challenge Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                  Challenge Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Senior Python System Architect"
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 focus:border-violet-500/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-sm"
                />
              </div>

              {/* Target Candidate Capacity */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                  Capacity (Max Candidates)
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  required
                  value={maxCandidates}
                  onChange={(e) => setMaxCandidates(parseInt(e.target.value) || 5)}
                  placeholder="5"
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 focus:border-violet-500/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Seniority Switcher */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                  Seniority Level
                </label>
                <select
                  value={seniorityLevel}
                  onChange={(e) => setSeniorityLevel(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 focus:border-violet-500/40 rounded-2xl text-white focus:outline-none transition-all font-sans text-sm cursor-pointer"
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              {/* Tech Track Switcher */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                  Technical Track
                </label>
                <select
                  value={techTrack}
                  onChange={(e) => setTechTrack(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 focus:border-violet-500/40 rounded-2xl text-white focus:outline-none transition-all font-sans text-sm cursor-pointer"
                >
                  <option value="frontend">Frontend Engineering</option>
                  <option value="backend">Backend Engineering</option>
                  <option value="fullstack">Fullstack Engineering</option>
                  <option value="devops">DevOps / Systems</option>
                </select>
              </div>
            </div>

            {/* Assessment description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                Short Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Collaborative API sandbox parsing high-volume logs."
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 focus:border-violet-500/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-sm"
              />
            </div>

            {/* Job Description Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                Job Description (for Skill Analysis)
              </label>
              <textarea
                required
                rows={8}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job specification details here. Technical keywords (React, Django, Kafka, Redis) are parsed to structure sandbox test suites..."
                className="w-full px-4 py-3.5 bg-slate-950/50 border border-white/5 focus:border-violet-500/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-xs resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold font-outfit rounded-2xl transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-500/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting Skills & Pre-Generating Coding Sandbox...
                </>
              ) : (
                <>
                  Generate Assessment Sandbox
                  <Sparkles className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
