"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Play,
  Square,
  AlertOctagon,
  TrendingUp,
  Plus,
  Loader2,
  Terminal,
  Activity,
  CheckCircle,
  Eye,
  Award,
  Zap,
  Sparkles
} from "lucide-react";

interface Candidate {
  id: string;
  email: string;
  full_name: string;
}

interface TeamMember {
  candidate: Candidate;
}

interface Team {
  id: string;
  assessment_id: string;
  status: "pending" | "active" | "completed" | "aborted";
  session_start: string | null;
  session_end: string | null;
  created_at: string;
  members: TeamMember[];
}

export default function TeamsManagementPage() {
  const { assessmentId } = useParams() as { assessmentId: string };
  const { profile, token, apiFetch } = useAuth();
  const router = useRouter();

  const [assessment, setAssessment] = useState<any>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Active Managed Team
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [scoringTeamId, setScoringTeamId] = useState<string | null>(null);
  const [scoringResult, setScoringResult] = useState<string | null>(null);

  // Chaos event form
  const [chaosType, setChaosType] = useState("DB_POOL_STARVATION");
  const [chaosSeverity, setChaosSeverity] = useState<"low" | "medium" | "high">("medium");
  const [chaosDesc, setChaosDesc] = useState("Database pool connections exhausted by heavy query volume.");
  const [injectingChaos, setInjectingChaos] = useState(false);
  const [chaosLog, setChaosLog] = useState<any[]>([]);

  // Fetch Assessment details, teams, candidates
  const fetchData = useCallback(async () => {
    try {
      // 1. Get assessment
      const assRes = await apiFetch(`/api/assessments/${assessmentId}`);
      if (assRes.ok) {
        const assData = await assRes.json();
        setAssessment(assData.assessment);
      }

      // 2. Get teams for assessment
      const teamsRes = await apiFetch(`/api/teams/assessment/${assessmentId}`);
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData.teams || []);
      }

      // 3. Get candidates
      const candRes = await apiFetch("/api/auth/candidates");
      if (candRes.ok) {
        const candData = await candRes.json();
        setCandidates(candData.candidates || []);
      }
    } catch (err) {
      console.error("Error fetching teams data:", err);
    } finally {
      setLoading(false);
    }
  }, [assessmentId, apiFetch]);

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

  // Fetch Active Team Chaos events
  const fetchChaosLogs = useCallback(async (teamId: string) => {
    try {
      const res = await apiFetch(`/api/chaos/team/${teamId}`);
      if (res.ok) {
        const data = await res.json();
        setChaosLog(data.events || []);
      }
    } catch (err) {
      console.error("Error fetching chaos logs:", err);
    }
  }, [apiFetch]);

  useEffect(() => {
    if (activeTeam) {
      fetchChaosLogs(activeTeam.id);
      const timer = setInterval(() => fetchChaosLogs(activeTeam.id), 5000);
      return () => clearInterval(timer);
    }
  }, [activeTeam, fetchChaosLogs]);

  // Create Team
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreatingTeam(true);

    if (selectedCandidates.length < 2) {
      setCreateError("At least 2 candidates are required to create a collaborative team.");
      setCreatingTeam(false);
      return;
    }

    try {
      const res = await apiFetch("/api/teams", {
        method: "POST",
        body: JSON.stringify({
          assessmentId,
          candidateIds: selectedCandidates,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create team");
      }

      setShowCreateModal(false);
      setSelectedCandidates([]);
      fetchData();
    } catch (err: any) {
      setCreateError(err.message || "Failed to save team sandbox.");
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleToggleCandidate = (id: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Start Session
  const handleStartSession = async (teamId: string) => {
    try {
      const res = await apiFetch(`/api/teams/${teamId}/start`, { method: "POST" });
      if (res.ok) {
        fetchData();
        // Refresh active team object if selected
        if (activeTeam?.id === teamId) {
          const fresh = await apiFetch(`/api/teams/${teamId}`);
          const freshData = await fresh.json();
          setActiveTeam(freshData.team);
        }
      }
    } catch (err) {
      console.error("Error starting session:", err);
    }
  };

  // End Session
  const handleEndSession = async (teamId: string) => {
    try {
      const res = await apiFetch(`/api/teams/${teamId}/end`, { method: "POST" });
      if (res.ok) {
        fetchData();
        if (activeTeam?.id === teamId) {
          const fresh = await apiFetch(`/api/teams/${teamId}`);
          const freshData = await fresh.json();
          setActiveTeam(freshData.team);
        }
      }
    } catch (err) {
      console.error("Error ending session:", err);
    }
  };

  // Inject Chaos Event
  const handleInjectChaos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam) return;

    setInjectingChaos(true);

    try {
      const res = await apiFetch("/api/chaos/trigger", {
        method: "POST",
        body: JSON.stringify({
          teamId: activeTeam.id,
          eventType: chaosType,
          description: chaosDesc,
          severity: chaosSeverity,
        }),
      });

      if (res.ok) {
        fetchChaosLogs(activeTeam.id);
      }
    } catch (err) {
      console.error("Error injecting chaos event:", err);
    } finally {
      setInjectingChaos(false);
    }
  };

  // Run Calibration & Scoring
  const handleRunScoring = async (teamId: string) => {
    setScoringTeamId(teamId);
    setScoringResult(null);

    try {
      const res = await apiFetch(`/api/scoring/score-team/${teamId}`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Calibration engine failed to complete");
      }

      setScoringResult("Calibrated reports generated successfully! Redirecting to report portal...");
      setTimeout(() => {
        fetchData();
        setScoringTeamId(null);
        setScoringResult(null);
      }, 2000);
    } catch (err: any) {
      setScoringResult(`Error: ${err.message}`);
    }
  };

  if (loading || !assessment) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative overflow-x-hidden">
      <div className="grid-bg absolute inset-0 opacity-5 pointer-events-none z-0" />
      {/* Floating Background Orbs */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-violet-900/12 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" />
      <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-cyan-900/8 rounded-full blur-3xl pointer-events-none z-0 animate-float-orb" style={{animationDelay: '3s'}} />

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-16 w-full">
          <div className="flex items-center gap-2">
            <Link href="/employer/dashboard" className="p-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white mr-2 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-black font-outfit text-sm">
              R
            </div>
            <span className="font-extrabold font-outfit text-white text-base">
              Redrob <span className="text-accent">Sandbox</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-[95%] lg:max-w-[1650px] w-full mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Teams List */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 capitalize">{assessment.tech_track} • {assessment.seniority_level}</span>
              <h1 className="text-lg font-bold font-outfit text-white mt-1">
                {assessment.title}
              </h1>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="py-2 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold font-outfit text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Sandbox
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {teams.length === 0 ? (
              <div className="vibrant-card p-8 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
                <Users className="w-8 h-8 text-slate-600" />
                <p className="text-xs text-slate-500">No teams assigned. Select candidates and launch a new sandbox team.</p>
              </div>
            ) : (
              teams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => setActiveTeam(team)}
                  className={`vibrant-card p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    activeTeam?.id === team.id
                      ? "!border-violet-500/30 !shadow-[0_0_30px_rgba(139,92,246,0.1)] animate-border-glow"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono uppercase">
                      Chamber: {team.id.substring(0, 8)}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                        team.status === "active"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : team.status === "completed"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {team.status}
                    </span>
                  </div>

                  {/* Members list */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 font-mono uppercase tracking-wider">Teammates</span>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((m, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold font-sans bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-slate-300"
                        >
                          {m.candidate?.full_name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-1">
                    <div className="flex gap-2">
                      {team.status === "pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartSession(team.id);
                          }}
                          className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-black text-[11px] font-bold font-outfit rounded-md flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-black text-black" />
                          Start
                        </button>
                      )}
                      {team.status === "active" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEndSession(team.id);
                          }}
                          className="py-1.5 px-3 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold font-outfit rounded-md flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Square className="w-3 h-3 fill-white text-white" />
                          End
                        </button>
                      )}
                      {team.status === "completed" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRunScoring(team.id);
                          }}
                          disabled={scoringTeamId === team.id}
                          className="py-1.5 px-3 bg-accent hover:bg-accent-hover text-black text-[11px] font-bold font-outfit rounded-md flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Activity className="w-3 h-3 text-black" />
                          {scoringTeamId === team.id ? "Scoring..." : "Run Scoring"}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono">
                      <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Active Control Dashboard */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {!activeTeam ? (
            <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8 vibrant-card rounded-3xl gap-3">
              <Terminal className="w-12 h-12 text-slate-700" />
              <h3 className="text-md font-bold text-slate-400">Select a sandbox chamber</h3>
              <p className="text-xs text-slate-600 max-w-xs">Click on any created assessment team in the list to manage and review active telemetry operations.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* scoring process status banner */}
              {scoringTeamId === activeTeam.id && scoringResult && (
                <div className="p-4 bg-accent/10 border border-accent/20 text-accent font-semibold text-xs rounded-2xl text-center leading-relaxed">
                  {scoringResult}
                </div>
              )}

              {/* Dynamic telemetry status control board */}
              <div className="vibrant-card p-6 rounded-3xl flex flex-col gap-6 shadow-xl rainbow-top-line">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">Control Console</span>
                    <h2 className="text-md font-bold text-white font-outfit mt-1">
                      Chamber UUID: <span className="shimmer-text">{activeTeam.id}</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeTeam.status === "active" && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                    <span className="text-xs font-mono font-bold capitalize text-slate-300">
                      {activeTeam.status} Session
                    </span>
                  </div>
                </div>

                {/* Team members details & Reports links */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Assigned Developers</h3>
                  <div className="flex flex-col gap-3">
                    {activeTeam.members.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-4 stat-card-violet rounded-2xl flex items-center justify-between transition-all duration-300"
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-bold text-white font-outfit">{m.candidate?.full_name}</span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{m.candidate?.email}</span>
                        </div>

                        {activeTeam.status === "completed" ? (
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/employer/reports/${m.candidate?.id}`}
                              className="py-1.5 px-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold font-outfit text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-md shadow-violet-600/15"
                            >
                              <Award className="w-3.5 h-3.5" />
                              View Report
                            </Link>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">Telemetry stream ready</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chaos Injection Center */}
              {activeTeam.status === "active" && (
                <div className="vibrant-card p-6 rounded-3xl shadow-xl flex flex-col gap-5 animate-border-glow">
                  <h2 className="text-md font-bold font-outfit text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4.5 h-4.5 text-amber-400" />
                    Chaos Injection Center
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Test candidate grit and communication skills. Inject system infrastructure faults into their live Monaco sandbox runtime environment.
                  </p>

                  <form onSubmit={handleInjectChaos} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Chaos type */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-mono">Fault Type</label>
                        <select
                          value={chaosType}
                          onChange={(e) => setChaosType(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-accent/40 cursor-pointer"
                        >
                          <option value="DB_POOL_STARVATION">Database Connection Leak</option>
                          <option value="API_RATE_LIMIT">Third-party Rate Limit Exceeded</option>
                          <option value="SLOW_QUERY">Slow SQL Execution Trace</option>
                          <option value="OOM">OutOfMemory Sandbox Failure</option>
                          <option value="DEADLOCK">Transaction Lock starvations</option>
                        </select>
                      </div>

                      {/* Severity */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-mono">Severity</label>
                        <select
                          value={chaosSeverity}
                          onChange={(e) => setChaosSeverity(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-accent/40 cursor-pointer"
                        >
                          <option value="low">Low Warning</option>
                          <option value="medium">Medium System degradation</option>
                          <option value="high">Critical sandbox crash</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-mono">Description Payload</label>
                      <input
                        type="text"
                        required
                        value={chaosDesc}
                        onChange={(e) => setChaosDesc(e.target.value)}
                        placeholder="Detail the target failure description"
                        className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-accent/40"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={injectingChaos}
                      className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold font-outfit text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {injectingChaos ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <AlertOctagon className="w-4 h-4 text-black" />
                          Inject Active Fault
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Chaos Trigger Logs */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4 max-h-[300px]">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Fault Injection History</h3>
                {chaosLog.length === 0 ? (
                  <p className="text-xs text-slate-600 italic py-6">No chaos events injected yet.</p>
                ) : (
                  <div className="overflow-y-auto flex flex-col gap-2.5 pr-2 scrollbar-thin">
                    {chaosLog.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between text-xs gap-3"
                      >
                        <div className="flex flex-col text-left truncate">
                          <span className="font-bold text-white font-mono uppercase tracking-wider">{log.event_type.replace(/_/g, " ")}</span>
                          <span className="text-[10px] text-slate-400 mt-1 leading-normal font-sans truncate">{log.description}</span>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span
                            className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                              log.status === "resolved"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse"
                            }`}
                          >
                            {log.status}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(log.triggered_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE TEAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-950/90 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 relative animate-in fade-in zoom-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                <Users className="w-5.5 h-5.5 text-accent" />
                Assign Sandbox Team
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                Select at least 2 candidate profiles to form a collaborative team assessment chamber.
              </p>
            </div>

            {createError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl leading-relaxed">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateTeam} className="flex flex-col gap-6">
              {/* Candidate picker list */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-mono">Available Candidates</label>
                <div className="max-h-[220px] overflow-y-auto border border-white/5 rounded-2xl p-3 bg-slate-900/50 flex flex-col gap-2 scrollbar-thin">
                  {candidates.length === 0 ? (
                    <p className="text-xs text-slate-600 text-center py-6">No candidates found in profiles.</p>
                  ) : (
                    candidates.map((cand) => (
                      <label
                        key={cand.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedCandidates.includes(cand.id)
                            ? "bg-accent/5 border-accent text-white"
                            : "bg-slate-950/20 border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-bold font-outfit">{cand.full_name}</span>
                          <span className="text-[10px] text-slate-500 mt-0.5 font-mono">{cand.email}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(cand.id)}
                          onChange={() => handleToggleCandidate(cand.id)}
                          className="rounded text-accent focus:ring-accent accent-accent w-4 h-4 cursor-pointer"
                        />
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedCandidates([]);
                  }}
                  className="flex-1 py-3.5 border border-white/10 hover:bg-white/5 rounded-xl text-xs text-white font-bold font-outfit cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTeam}
                  className="flex-1 py-3.5 bg-accent hover:bg-accent-hover text-black font-extrabold font-outfit text-xs rounded-xl shadow-lg shadow-accent/10 hover:shadow-accent/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {creatingTeam ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      Launch Sandbox
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
