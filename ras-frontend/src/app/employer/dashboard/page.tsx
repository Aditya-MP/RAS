"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  FileText,
  AlertTriangle,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Loader2,
  Terminal,
  LogOut,
  FolderLock,
  Layers
} from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  description: string;
  extracted_skills: string[];
  seniority_level: string;
  tech_track: string;
  max_candidates: number;
  created_at: string;
}

interface PromptInjection {
  id: string;
  original_filename: string;
  injection_detected_at: string;
  candidate: {
    full_name: string;
    email: string;
  };
}

export default function EmployerDashboard() {
  const { profile, token, signOut, apiFetch } = useAuth();
  const router = useRouter();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [injections, setInjections] = useState<PromptInjection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch assessments and HCD logs
  const fetchData = useCallback(async () => {
    try {
      const assessRes = await apiFetch("/api/assessments");
      if (assessRes.ok) {
        const assessData = await assessRes.ok ? await assessRes.json() : {};
        setAssessments(assessData.assessments || []);
      }

      const injRes = await apiFetch("/api/resume/injections/list");
      if (injRes.ok) {
        const injData = await injRes.json();
        setInjections(injData.injections || []);
      }
    } catch (err) {
      console.error("Error fetching employer dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }
    if (profile && profile.role !== "employer") {
      router.push("/candidate/dashboard");
      return;
    }
    fetchData();
  }, [profile, token, router, fetchData]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-orange-600 selection:text-white">
      <div className="grid-bg absolute inset-0 opacity-5 pointer-events-none z-0" />
      {/* Floating Background Orbs */}
      <div className="absolute top-20 left-1/4 w-[550px] h-[550px] bg-orange-950/12 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" />
      <div className="absolute bottom-20 right-1/4 w-[450px] h-[450px] bg-orange-950/10 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" style={{animationDelay: '3s'}} />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-orange-900/5 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" style={{animationDelay: '5s'}} />
      
      {/* Header */}
      <header className="border-b border-white/5 bg-[#070b16]/90 backdrop-blur-md relative z-10 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-[1550px] mx-auto px-6 py-4 flex items-center justify-between h-16 w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-orange-600 flex items-center justify-center font-bold text-white font-outfit text-sm">
              R
            </div>
            <span className="font-extrabold font-outfit text-white text-base">
              Redrob <span className="text-orange-500">Sandbox</span>
            </span>
            <span className="text-[9px] font-mono font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest ml-2 hidden sm:inline-block">
              Employer Deck
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-500 font-mono">
                {profile.full_name.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-none">{profile.full_name}</span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">{profile.email}</span>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Stats & Security Log */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Stats Deck */}
          <div className="payroute-card p-6 flex flex-col gap-5 shadow-xl">
            <h2 className="text-xs font-black text-slate-100 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              Chamber Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border-none rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-900/80 transition-all duration-300">
                <span className="text-slate-400 text-[9px] uppercase font-mono tracking-widest font-bold">Challenges</span>
                <span className="text-3xl font-black font-outfit text-orange-500 neon-text-orange mt-1">{assessments.length}</span>
              </div>
              <div className="bg-slate-900/50 border-none rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-900/80 transition-all duration-300">
                <span className="text-slate-400 text-[9px] uppercase font-mono tracking-widest font-bold">HCD Flags</span>
                <span className={`text-3xl font-black font-outfit mt-1 ${injections.length > 0 ? "text-orange-500 neon-text-orange animate-pulse" : "text-white"}`}>
                  {injections.length}
                </span>
              </div>
            </div>
          </div>

          {/* Prompt Injections Security Feed */}
          <div className="payroute-card p-6 flex flex-col gap-4 flex-grow max-h-[480px] shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-xs font-black text-slate-100 font-outfit uppercase tracking-wider flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-orange-500" />
                HCD Security Logs
              </h2>
              <span className="text-[9px] font-mono bg-orange-500/10 border border-orange-500/20 text-orange-550 text-orange-500 px-2.5 py-0.5 rounded tracking-wide uppercase">
                Active Scan
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
              </div>
            ) : injections.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-3">
                <Terminal className="w-8 h-8 text-slate-650 text-slate-500" />
                <p className="text-xs text-slate-500 font-sans">No prompt injections flagged. Resume files security integrity clean.</p>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin">
                {injections.map((inj) => (
                  <div
                    key={inj.id}
                    className="p-3.5 bg-slate-900/50 border-none rounded-xl flex flex-col gap-2 hover:bg-slate-900/80 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white font-outfit leading-none">
                        {inj.candidate?.full_name || "Unknown Candidate"}
                      </span>
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 truncate leading-none font-sans">
                      File: {inj.original_filename}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[9px] text-slate-505 text-slate-500 font-mono">
                      <span>{inj.candidate?.email}</span>
                      <span>{new Date(inj.injection_detected_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Assessments & Actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2.5">
              <FileText className="w-5.5 h-5.5 text-orange-500" />
              <span className="shimmer-text">Job Assessments</span>
            </h2>

            <Link
              href="/employer/assessments/new"
              className="py-2.5 px-5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white stroke-[3]" />
              Create Assessment
            </Link>
          </div>

          {loading ? (
            <div className="flex-grow min-h-[400px] flex items-center justify-center payroute-card">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : assessments.length === 0 ? (
            <div className="flex-grow min-h-[400px] flex flex-col items-center justify-center text-center p-8 payroute-card gap-4">
              <FileText className="w-12 h-12 text-slate-600" />
              <div>
                <h3 className="text-md font-bold text-white mb-1">No Assessments Created</h3>
                <p className="text-xs text-slate-500 max-w-sm font-sans">
                  Get started by creating your first pre-employment sandbox challenge. Click the "Create Assessment" button above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments.map((ass) => (
                <div
                  key={ass.id}
                  className="payroute-card p-6 flex flex-col justify-between min-h-[240px] transition-all group">

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-slate-950 border-none text-slate-400 capitalize">
                        {ass.tech_track}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ass.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-md font-bold text-white group-hover:text-orange-500 transition-colors font-outfit mt-1">
                      {ass.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {ass.description || "Pre-employment technical assessment sandbox."}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {ass.extracted_skills?.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="text-[9px] font-mono bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {ass.extracted_skills?.length > 4 && (
                        <span className="text-[9px] font-mono bg-white/5 border border-white/5 text-slate-500 px-2 py-0.5 rounded">
                          +{ass.extracted_skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-sans">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>Max {ass.max_candidates} Candidates</span>
                    </div>

                    <Link
                      href={`/employer/teams/${ass.id}`}
                      className="py-2 px-3.5 bg-orange-650 bg-orange-650/80 group-hover:bg-orange-600 text-white font-bold font-outfit text-[11px] rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-orange-650/10 group-hover:shadow-orange-600/20"
                    >
                      Assessments Panel
                      <ArrowRight className="w-3 h-3 text-current" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
