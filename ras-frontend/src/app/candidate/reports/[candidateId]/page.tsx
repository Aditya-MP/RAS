"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Cpu,
  Shield,
  Zap,
  Loader2,
  TrendingUp,
  Activity,
  AlertTriangle
} from "lucide-react";

interface Report {
  id: string;
  team_id: string;
  candidate_id: string;
  final_percentile: string | number;
  coding_correctness: string | number;
  ai_collaboration_fluency: string | number;
  keystroke_integrity: string | number;
  soft_skill_score: string | number;
  peer_score: string | number;
  chaos_resilience: string | number;
  influence_score: string | number;
  report_json: any;
  created_at: string;
}

export default function CandidateReportPage() {
  const { candidateId } = useParams() as { candidateId: string };
  const { profile, token, apiFetch } = useAuth();
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/scoring/report/${candidateId}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  }, [candidateId, apiFetch]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }
    fetchReport();
  }, [token, router, fetchReport]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col items-center justify-center p-6 relative">
        <div className="glass-card p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center gap-4 max-w-md shadow-2xl">
          <AlertTriangle className="w-10 h-10 text-amber-500 animate-pulse" />
          <h1 className="text-xl font-bold font-outfit text-white">Report Pending Calibration</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Scoring calibration for your team is in progress. The evaluation engine generates metrics once the session ends and the host submits final score parameters.
          </p>
          <Link
            href="/candidate/dashboard"
            className="mt-2 py-2.5 px-4 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-xs rounded-xl shadow transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const parseScore = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return isNaN(num) ? 0 : Math.round(num * 100);
  };

  const finalPercentile = Math.round(typeof report.final_percentile === "string" ? parseFloat(report.final_percentile) : report.final_percentile);

  const metricsBreakdown = [
    {
      title: "Coding Correctness",
      score: parseScore(report.coding_correctness),
      description: "Ratio of test compilations, runtime executions, and syntax checks passed.",
      icon: CheckCircle,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "AI Collaboration Fluency",
      score: parseScore(report.ai_collaboration_fluency),
      description: "Effectiveness of Gemini assistant prompt calibration and code acceptance loops.",
      icon: Cpu,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "Keystroke Dynamics Integrity",
      score: parseScore(report.keystroke_integrity),
      description: "Plagiarism verification checking keystroke dwell and flight time variance.",
      icon: Shield,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Soft Skill Communication",
      score: parseScore(report.soft_skill_score),
      description: "Dialogue Act classification tracking cooperative proposals and justifications.",
      icon: BookOpen,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Chaos Resilience",
      score: parseScore(report.chaos_resilience),
      description: "Speed and resolution rate in applying system fixes to injected active faults.",
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Architectural Influence",
      score: parseScore(report.influence_score),
      description: "PageRank influence on team codebase dependency import/export relationships.",
      icon: TrendingUp,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative">
      <div className="grid-bg absolute inset-0 opacity-5 pointer-events-none z-0" />

      {/* Header */}
      <header className="px-8 py-5 border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/candidate/dashboard" className="p-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white mr-2 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-black font-outfit text-sm">
            R
          </div>
          <span className="font-extrabold font-outfit text-white text-base">
            Redrob <span className="text-accent">Sandbox</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-[95%] lg:max-w-[1650px] w-full mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Score Summary dial */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
          <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center text-center gap-6">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest leading-none">
              Evaluation Percentile
            </h2>

            {/* Circular Dial progress */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-900 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-accent fill-none transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - finalPercentile / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-extrabold font-outfit text-white leading-none">
                  {finalPercentile}
                </span>
                <span className="text-[10px] font-semibold text-accent font-mono mt-2 uppercase tracking-wider">
                  Percentile
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold font-outfit text-white flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-accent" />
                Technical Mastery Rank
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans px-2">
                This rating combines raw syntax execution metrics, collaborative coding behavior patterns, and socratic calibration parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Metric breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold font-outfit text-white">Chamber Assessment Breakdown</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {metricsBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-white font-outfit leading-none">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{item.description}</p>
                  </div>
                  <div className={`p-2.5 border rounded-xl shrink-0 ${item.color}`}>
                    <item.icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-baseline text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    <span>Calibration index</span>
                    <span className="text-white font-extrabold">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-900 border border-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
