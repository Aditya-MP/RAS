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
  AlertTriangle,
  User,
  MessageSquare,
  Globe
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

export default function EmployerCandidateReportPage() {
  const { candidateId } = useParams() as { candidateId: string };
  const { profile, token, apiFetch } = useAuth();
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReportDetails = useCallback(async () => {
    try {
      // 1. Get report
      const res = await apiFetch(`/api/scoring/report/${candidateId}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }

      // 2. Fetch candidate profile
      const userRes = await apiFetch(`/api/auth/me`); // to get metadata or list candidates
      const candListRes = await apiFetch("/api/auth/candidates");
      if (candListRes.ok) {
        const listData = await candListRes.json();
        const cand = listData.candidates?.find((c: any) => c.id === candidateId);
        if (cand) setCandidateProfile(cand);
      }
    } catch (err) {
      console.error("Error fetching employer candidate report details:", err);
    } finally {
      setLoading(false);
    }
  }, [candidateId, apiFetch]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }
    if (profile && profile.role !== "employer") {
      router.push("/candidate/dashboard");
      return;
    }
    fetchReportDetails();
  }, [profile, token, router, fetchReportDetails]);

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
          <h1 className="text-xl font-bold font-outfit text-white">Report Generation Pending</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            This candidate score has not been generated yet. Navigate back to the teams panel and click the "Run Scoring" button to execute calibration.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-2 py-2.5 px-4 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-xs rounded-xl shadow transition-all cursor-pointer"
          >
            Go Back
          </button>
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
      description: "Code compilation correctness based on test suites.",
      icon: CheckCircle,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "AI Collaboration Fluency",
      score: parseScore(report.ai_collaboration_fluency),
      description: "Prompts iteration and AI code editing patterns.",
      icon: Cpu,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "Keystroke Integrity",
      score: parseScore(report.keystroke_integrity),
      description: "Flight and dwell time variance biometric verification.",
      icon: Shield,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Dialogue soft skills",
      score: parseScore(report.soft_skill_score),
      description: "Cooperative chat logs Dialogue Act analysis.",
      icon: MessageSquare,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Chaos Resilience",
      score: parseScore(report.chaos_resilience),
      description: "Fault resolution response speeds and recovery rates.",
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Architectural Influence",
      score: parseScore(report.influence_score),
      description: "PageRank influence index based on import trees.",
      icon: TrendingUp,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative overflow-x-hidden">
      <div className="grid-bg absolute inset-0 opacity-5 pointer-events-none z-0" />
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-violet-900/12 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-cyan-900/8 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" style={{animationDelay: '3s'}} />

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-16 w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white mr-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-black font-outfit text-sm">
              H
            </div>
            <span className="font-extrabold font-outfit text-white text-base">
              AI <span className="text-accent">HireHub</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-[95%] lg:max-w-[1650px] w-full mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Score Summary dial */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
          
          {/* Candidate Profile summary */}
          <div className="welcome-banner p-6 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-violet-400">
                <User className="w-5.5 h-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white font-outfit">{candidateProfile?.full_name || "Assessed Candidate"}</h3>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{candidateProfile?.email || "candidate@email.com"}</span>
              </div>
            </div>
          </div>

          {/* Percentile Dial */}
          <div className="vibrant-card p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-6 rainbow-top-line">
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
                  className="fill-none transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - finalPercentile / 100)}`}
                  strokeLinecap="round"
                  style={{stroke: 'url(#percentile-gradient)'}}
                />
                <defs>
                  <linearGradient id="percentile-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#d946ef" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-extrabold font-outfit shimmer-text leading-none">
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
            <Activity className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold font-outfit shimmer-text">Chamber Assessment Breakdown</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {metricsBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="vibrant-card p-6 rounded-2xl shadow-md flex flex-col justify-between gap-4"
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

          {/* Calibrated details metrics details summary log */}
          <div className="vibrant-card p-6 rounded-3xl shadow-xl flex flex-col gap-4 mt-2 rainbow-top-line">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-accent" />
              Bias calibration summary
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Teammate peer review ratings are adjusted for reviewer leniency or strictness deviation relative to team averages. Soft skills scores correlate Dialogue acts (proposals, offers) and actual coding contributions (keystroke telemetry) to detect high contribution correlation indices.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
