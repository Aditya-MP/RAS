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
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative">
      <div className="grid-bg absolute inset-0 opacity-5 pointer-events-none z-0" />
      
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-black font-outfit text-sm">
            R
          </div>
          <span className="font-extrabold font-outfit text-white text-base">
            Redrob <span className="text-accent">Sandbox</span>
          </span>
          <span className="text-[9px] font-mono font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest ml-2">
            Employer Deck
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent font-mono">
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
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-[95%] lg:max-w-[1650px] w-full mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Stats & Security Log */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Stats Deck */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-6">
            <h2 className="text-md font-bold font-outfit text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-accent" />
              Chamber Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">Challenges</span>
                <span className="text-2xl font-bold font-outfit text-white mt-1">{assessments.length}</span>
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">HCD Flags</span>
                <span className={`text-2xl font-bold font-outfit mt-1 ${injections.length > 0 ? "text-amber-500 animate-pulse" : "text-white"}`}>
                  {injections.length}
                </span>
              </div>
            </div>
          </div>

          {/* Prompt Injections Security Feed */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-5 flex-1 max-h-[480px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-md font-bold font-outfit text-white uppercase tracking-wider flex items-center gap-2">
                <FolderLock className="w-4.5 h-4.5 text-rose-500" />
                HCD Security Logs
              </h2>
              <span className="text-[10px] font-mono bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded">
                Active Scan
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
              </div>
            ) : injections.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-3">
                <Terminal className="w-8 h-8 text-slate-600" />
                <p className="text-xs text-slate-500">No prompt injections flagged. Resume files security integrity clean.</p>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin">
                {injections.map((inj) => (
                  <div
                    key={inj.id}
                    className="p-3.5 bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl flex flex-col gap-2 hover:bg-rose-500/[0.04] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white font-outfit leading-none">
                        {inj.candidate?.full_name || "Unknown Candidate"}
                      </span>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 truncate leading-none">
                      File: {inj.original_filename}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500 font-mono">
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
              <FileText className="w-5.5 h-5.5 text-accent" />
              Job Assessments
            </h2>

            <Link
              href="/employer/assessments/new"
              className="py-2.5 px-4 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-accent/15 hover:shadow-accent/25 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              Create Assessment
            </Link>
          </div>

          {loading ? (
            <div className="flex-grow min-h-[400px] flex items-center justify-center glass-card rounded-3xl border border-white/5">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : assessments.length === 0 ? (
            <div className="flex-grow min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass-card rounded-3xl border border-white/5 gap-4">
              <FileText className="w-12 h-12 text-slate-600" />
              <div>
                <h3 className="text-md font-bold text-white mb-1">No Assessments Created</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Get started by creating your first pre-employment sandbox challenge. Click the "Create Assessment" button above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments.map((ass) => (
                <div
                  key={ass.id}
                  className="glass-card p-6 rounded-3xl border border-white/5 shadow-lg flex flex-col justify-between min-h-[240px] hover:border-white/12 transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-slate-900 border border-white/5 text-slate-400 capitalize">
                        {ass.tech_track}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ass.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-md font-bold text-white group-hover:text-accent transition-colors font-outfit mt-1">
                      {ass.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ass.description || "Pre-employment technical assessment sandbox."}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {ass.extracted_skills?.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="text-[9px] font-mono bg-white/5 border border-white/5 text-accent px-2 py-0.5 rounded"
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
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>Max {ass.max_candidates} Candidates</span>
                    </div>

                    <Link
                      href={`/employer/teams/${ass.id}`}
                      className="py-2 px-3.5 bg-white/5 group-hover:bg-accent group-hover:text-black hover:bg-white/10 border border-white/5 group-hover:border-accent text-white font-bold font-outfit text-[11px] rounded-lg transition-all flex items-center gap-1.5"
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
