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
  Layers,
  Briefcase,
  Trash2,
  X,
  DollarSign,
  Wand2,
  Bell
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

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  tags: string[];
  tech_track: string;
  seniority_level: string;
  created_at: string;
  assessment_id?: string;
  status?: "open" | "closed";
  applicationCount?: number;
  deadline?: string;
}

export default function EmployerDashboard() {
  const { profile, token, signOut, apiFetch } = useAuth();
  const router = useRouter();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [injections, setInjections] = useState<PromptInjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"assessments" | "jobs" | "notifications">("assessments");
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    recipient_id: "",
    title: "",
    message: "",
    type: "info" as "alert" | "info" | "success",
    time_slot: "",
    uid: ""
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobMode, setJobMode] = useState<"ai" | "manual">("manual");
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    tags: "",
    tech_track: "fullstack",
    seniority_level: "mid",
    assessment_id: "",
    deadline: ""
  });
  const [submittingJob, setSubmittingJob] = useState(false);

  const [selectedJobForScheduling, setSelectedJobForScheduling] = useState<Job | null>(null);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [schedulingTimeSlot, setSchedulingTimeSlot] = useState("");
  const [schedulingInProgress, setSchedulingInProgress] = useState(false);

  const [broadcastJobId, setBroadcastJobId] = useState("");
  const [broadcastTimeSlot, setBroadcastTimeSlot] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);

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

  const fetchSentNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const res = await apiFetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setSentNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Error fetching sent notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  }, [apiFetch]);

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/candidates");
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  }, [apiFetch]);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res = await apiFetch(`/api/jobs?employerId=${profile?.id}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  }, [apiFetch, profile?.id]);

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setGeneratingAI(true);
    try {
      const res = await apiFetch("/api/ai/generate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      
      if (res.ok) {
        const data = await res.json();
        const job = data.jobDetails;
        setJobForm({
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          description: job.description,
          tags: job.tags.join(", "),
          tech_track: job.tech_track,
          seniority_level: job.seniority_level,
          assessment_id: job.assessment_id || "",
          deadline: ""
        });
        setJobMode("manual");
      } else if (res.status === 503) {
        // AI service unavailable, switch to manual mode
        alert("AI service is temporarily unavailable (quota limit or high demand). Please use manual entry.");
        setJobMode("manual");
      } else {
        alert("Failed to generate job details. Please try manual entry.");
      }
    } catch (err) {
      console.error("AI generation error:", err);
      alert("Error generating job details. Please use manual entry.");
      setJobMode("manual");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingJob(true);
    try {
      const res = await apiFetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobForm,
          deadline: jobForm.deadline ? new Date(jobForm.deadline).toISOString() : null,
          tags: jobForm.tags.split(",").map(t => t.trim()).filter(Boolean),
          assessment_id: jobForm.assessment_id || null
        })
      });
      if (res.ok) {
        setShowJobModal(false);
        setJobForm({ title: "", company: "", location: "", salary: "", description: "", tags: "", tech_track: "fullstack", seniority_level: "mid", assessment_id: "", deadline: "" });
        fetchJobs();
      } else {
        const data = await res.json();
        alert(`Failed to create job: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Error creating job:", err);
      alert(`Error creating job: ${err.message || "Unknown error"}`);
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleCloseJob = async (jobId: string) => {
    if (!confirm("Close applications for this job posting? Candidates will no longer be able to apply.")) return;
    try {
      const res = await apiFetch(`/api/jobs/${jobId}/close`, { method: "POST" });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error("Error closing job:", err);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Delete this job posting?")) return;
    try {
      const res = await apiFetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleScheduleJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForScheduling || !schedulingTimeSlot.trim()) return;

    setSchedulingInProgress(true);
    try {
      const res = await apiFetch(`/api/jobs/${selectedJobForScheduling.id}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeSlot: schedulingTimeSlot
        })
      });

      const data = await res.json();

      if (res.ok) {
        setShowSchedulingModal(false);
        setSchedulingTimeSlot("");
        setSelectedJobForScheduling(null);
        fetchJobs();
        alert(`Successfully scheduled assessment! ${data.candidateCount} candidate(s) divided into ${data.teamCount} team(s).`);
        const targetAssessmentId = data.assessmentId || selectedJobForScheduling.assessment_id;
        if (targetAssessmentId) {
          router.push(`/employer/teams/${targetAssessmentId}`);
        }
      } else {
        alert(`Failed to schedule assessment: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Error scheduling assessment:", err);
      alert(`Error scheduling assessment: ${err.message || "Unknown error"}`);
    } finally {
      setSchedulingInProgress(false);
    }
  };

  const handleAIBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastJobId || !broadcastTimeSlot.trim()) {
      alert("Please select a job and enter the assessment start time slot.");
      return;
    }

    setBroadcasting(true);
    try {
      const res = await apiFetch(`/api/jobs/${broadcastJobId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeSlot: broadcastTimeSlot
        })
      });

      const data = await res.json();

      if (res.ok) {
        setShowNotificationModal(false);
        setBroadcastJobId("");
        setBroadcastTimeSlot("");
        fetchSentNotifications();
        fetchJobs();
        alert(`AI Group Division & Notification Broadcast completed successfully! Formed ${data.teamCount} team(s) for ${data.candidateCount} candidate(s).`);
        
        const selectedJobObj = jobs.find(j => j.id === broadcastJobId);
        const targetAssessmentId = data.assessmentId || (selectedJobObj && selectedJobObj.assessment_id);
        if (targetAssessmentId) {
          router.push(`/employer/teams/${targetAssessmentId}`);
        }
      } else {
        alert(`AI Broadcast failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("AI Broadcast error:", err);
      alert(`AI Broadcast error: ${err.message || "Unknown error"}`);
    } finally {
      setBroadcasting(false);
    }
  };

  const handleBroadcastJobChange = (jobId: string) => {
    setBroadcastJobId(jobId);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationForm.recipient_id) {
      alert("Please select a recipient candidate.");
      return;
    }
    setSendingNotification(true);
    try {
      const payload = {
        recipient_id: notificationForm.recipient_id,
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
        metadata: {
          uid: notificationForm.uid || undefined,
          time_slot: notificationForm.time_slot || undefined
        }
      };

      const res = await apiFetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowNotificationModal(false);
        setNotificationForm({
          recipient_id: "",
          title: "",
          message: "",
          type: "info",
          time_slot: "",
          uid: ""
        });
        fetchSentNotifications();
        alert("Notification sent successfully to the candidate.");
      } else {
        const data = await res.json();
        alert(`Failed to send notification: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Error sending notification:", err);
      alert(`Error sending notification: ${err.message || "Unknown error"}`);
    } finally {
      setSendingNotification(false);
    }
  };

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
    fetchJobs();
    fetchCandidates();
  }, [profile, token, router, fetchData, fetchJobs, fetchCandidates]);

  useEffect(() => {
    if (activeTab === "notifications") {
      fetchSentNotifications();
    }
  }, [activeTab, fetchSentNotifications]);

  useEffect(() => {
    if (profile && activeTab === "jobs") {
      fetchJobs();
    }
  }, [profile, activeTab, fetchJobs]);

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
              H
            </div>
            <span className="font-extrabold font-outfit text-white text-base">
              AI <span className="text-orange-500">HireHub</span>
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("assessments")}
                className={`text-sm font-bold font-outfit transition-all flex items-center gap-2 pb-1 border-b-2 ${activeTab === "assessments" ? "text-orange-500 border-orange-500" : "text-slate-500 border-transparent hover:text-slate-300"}`}
              >
                <FileText className="w-4.5 h-4.5" />
                Assessments
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`text-sm font-bold font-outfit transition-all flex items-center gap-2 pb-1 border-b-2 ${activeTab === "jobs" ? "text-orange-500 border-orange-500" : "text-slate-500 border-transparent hover:text-slate-300"}`}
              >
                <Briefcase className="w-4.5 h-4.5" />
                Jobs
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`text-sm font-bold font-outfit transition-all flex items-center gap-2 pb-1 border-b-2 ${activeTab === "notifications" ? "text-orange-500 border-orange-500" : "text-slate-500 border-transparent hover:text-slate-300"}`}
              >
                <Bell className="w-4.5 h-4.5" />
                Notifications
              </button>
            </div>

            {activeTab === "assessments" ? (
              <Link
                href="/employer/assessments/new"
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white stroke-[3]" />
                Create Assessment
              </Link>
            ) : activeTab === "jobs" ? (
              <button
                onClick={() => setShowJobModal(true)}
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white stroke-[3]" />
                Create Job
              </button>
            ) : (
              <button
                onClick={() => setShowNotificationModal(true)}
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white stroke-[3]" />
                AI Schedule & Broadcast
              </button>
            )}
          </div>

          {activeTab === "assessments" && (
            <>
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
        </>
      )}

      {activeTab === "jobs" && (
        <>
          {loadingJobs ? (
            <div className="flex-grow min-h-[400px] flex items-center justify-center payroute-card">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex-grow min-h-[400px] flex flex-col items-center justify-center text-center p-8 payroute-card gap-4">
              <Briefcase className="w-12 h-12 text-slate-600" />
              <div>
                <h3 className="text-md font-bold text-white mb-1">No Jobs Posted</h3>
                <p className="text-xs text-slate-500 max-w-sm font-sans">
                  Create your first job posting to start attracting candidates.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="payroute-card p-6 flex flex-col justify-between min-h-[280px] transition-all group">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-slate-950 border-none text-slate-400 capitalize">
                        {job.tech_track}
                      </span>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-all cursor-pointer"
                        title="Delete Job"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>

                    <h3 className="text-md font-bold text-white group-hover:text-orange-500 transition-colors font-outfit mt-1">
                      {job.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.tags?.slice(0, 4).map((tag, index) => (
                        <span key={index} className="text-[9px] font-mono bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {job.tags?.length > 4 && (
                        <span className="text-[9px] font-mono bg-white/5 border border-white/5 text-slate-500 px-2 py-0.5 rounded">
                          +{job.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-mono">{job.company}</span>
                        <span className="text-xs text-slate-400 font-sans">{job.location}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-500">{job.salary}</span>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-sans">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="font-bold text-white">{job.applicationCount || 0}</span>
                        <span>Candidate(s) Applied</span>
                      </div>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${job.status === 'closed' ? 'bg-rose-500/10 border border-rose-500/20 text-rose-455 text-rose-405' : 'bg-lime-500/10 border border-lime-500/20 text-lime-455 text-lime-405'}`}>
                        {job.status === 'closed' ? 'Closed' : 'Open'}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 flex items-center justify-between gap-4">
                      {(job.status === "closed" && (job.applicationCount || 0) > 0) || job.assessment_id ? (
                        <button
                          onClick={() => {
                            setSelectedJobForScheduling(job);
                            setSchedulingTimeSlot("");
                            setShowSchedulingModal(true);
                          }}
                          className="py-1.5 px-3 bg-orange-650 hover:bg-orange-600 text-white font-bold font-outfit text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {job.status === "closed" ? "Schedule Round 1" : "End Job & Start Assessments"}
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      ) : job.status !== "closed" ? (
                        <button
                          onClick={() => handleCloseJob(job.id)}
                          className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold font-outfit text-[11px] rounded-lg transition-all cursor-pointer"
                        >
                          Close Posting
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-550 font-mono italic">
                          Applications ended.
                        </span>
                      )}

                      {job.assessment_id && (
                        <Link
                          href={`/employer/teams/${job.assessment_id}`}
                          className="text-xs text-orange-500 hover:underline flex items-center gap-1 font-sans"
                        >
                          Assessments Panel
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "notifications" && (
        <>
          {loadingNotifications ? (
            <div className="flex-grow min-h-[400px] flex items-center justify-center payroute-card">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : sentNotifications.length === 0 ? (
            <div className="flex-grow min-h-[400px] flex flex-col items-center justify-center text-center p-8 payroute-card gap-4">
              <Bell className="w-12 h-12 text-slate-600 animate-pulse" />
              <div>
                <h3 className="text-md font-bold text-white mb-1">No Notifications Broadcasted</h3>
                <p className="text-xs text-slate-500 max-w-sm font-sans font-medium">
                  Trigger the AI-powered group division and send personalized sandbox invite notifications to candidates automatically.
                </p>
              </div>
              <button
                onClick={() => setShowNotificationModal(true)}
                className="py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                AI Schedule & Broadcast
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sentNotifications.map((notif) => (
                <div key={notif.id} className="payroute-card p-5 flex flex-col gap-3 text-left hover:bg-slate-900/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded w-max mb-1.5 capitalize ${
                        notif.type === 'alert'
                          ? 'bg-rose-500/10 border border-rose-500/20 text-rose-455 text-rose-405'
                          : notif.type === 'success'
                          ? 'bg-lime-500/10 border border-lime-500/20 text-lime-455 text-lime-405'
                          : 'bg-slate-950 border-none text-slate-400'
                      }`}>
                        {notif.type}
                      </span>
                      <h3 className="text-xs font-black font-outfit text-white uppercase tracking-wider">
                        {notif.title}
                      </h3>
                      <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                        Recipient: <span className="text-slate-350">{notif.recipient?.full_name || "Unknown Candidate"}</span> ({notif.recipient?.email})
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-505 text-slate-500">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-305 text-slate-300 leading-relaxed font-sans">
                    {notif.message}
                  </p>

                  {(notif.metadata?.uid || notif.metadata?.time_slot) && (
                    <div className="p-3 bg-slate-950/60 border border-white/[0.02] rounded-xl flex flex-col gap-1.5 text-xs text-left">
                      {notif.metadata?.time_slot && (
                        <div className="text-[10px] text-slate-405 text-slate-400 font-sans">
                          📅 <span className="font-semibold text-white">Time Slot:</span> {notif.metadata.time_slot}
                        </div>
                      )}
                      {notif.metadata?.uid && (
                        <div className="text-[10px] text-slate-405 text-slate-400 font-mono">
                          🔑 <span className="font-semibold text-white">Chamber UID:</span> <code className="text-orange-400 bg-white/5 px-1.5 py-0.5 rounded">{notif.metadata.uid}</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  </main>

  {showJobModal && (
    <div className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0f1d] border border-white/10 max-w-2xl w-full p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => { setShowJobModal(false); setJobMode("manual"); setAiPrompt(""); }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-lg font-black font-outfit text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-orange-500" />
            Create New Job Posting
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Use AI to generate job details or fill manually.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setJobMode("ai")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs font-outfit transition-all flex items-center justify-center gap-2 ${
              jobMode === "ai"
                ? "bg-orange-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            AI Generate
          </button>
          <button
            onClick={() => setJobMode("manual")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs font-outfit transition-all ${
              jobMode === "manual"
                ? "bg-orange-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            Manual Entry
          </button>
        </div>

        {jobMode === "ai" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono text-slate-400 uppercase">Describe the job (AI will generate details)</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Looking for a Senior React Developer for our remote fintech team, competitive salary, experience with TypeScript and AWS required"
                rows={4}
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
              />
            </div>
            <button
              onClick={handleGenerateWithAI}
              disabled={!aiPrompt.trim() || generatingAI}
              className="py-2.5 px-6 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generatingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Job Details
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateJob} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-slate-400 uppercase">Job Title *</label>
              <input
                type="text"
                required
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="Senior Fullstack Engineer"
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-slate-400 uppercase">Company *</label>
              <input
                type="text"
                required
                value={jobForm.company}
                onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                placeholder="Redrob Corp"
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-slate-400 uppercase">Location</label>
              <input
                type="text"
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder="San Francisco, CA"
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-slate-400 uppercase">Salary Range</label>
              <input
                type="text"
                value={jobForm.salary}
                onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                placeholder="$120,000 - $150,000"
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-slate-400 uppercase">Tech Track</label>
              <select
                value={jobForm.tech_track}
                onChange={(e) => setJobForm({ ...jobForm, tech_track: e.target.value })}
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="fullstack">Fullstack</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="devops">DevOps</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-slate-400 uppercase">Seniority Level</label>
              <select
                value={jobForm.seniority_level}
                onChange={(e) => setJobForm({ ...jobForm, seniority_level: e.target.value })}
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-mono text-slate-400 uppercase">Application Deadline *</label>
            <input
              type="datetime-local"
              required
              value={jobForm.deadline}
              onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-mono text-slate-400 uppercase">Description *</label>
            <textarea
              required
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={4}
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-mono text-slate-400 uppercase">Skills/Tags (comma separated)</label>
            <input
              type="text"
              value={jobForm.tags}
              onChange={(e) => setJobForm({ ...jobForm, tags: e.target.value })}
              placeholder="React, Node.js, PostgreSQL, AWS"
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={submittingJob}
              className="py-2.5 px-6 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submittingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Job"}
            </button>
            <button
              type="button"
              onClick={() => setShowJobModal(false)}
              className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  )}

  {showSchedulingModal && selectedJobForScheduling && (
    <div className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0f1d] border border-white/10 max-w-md w-full p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative z-50">
        <button
          onClick={() => { setShowSchedulingModal(false); setSelectedJobForScheduling(null); setSchedulingTimeSlot(""); }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-lg font-black font-outfit text-white uppercase tracking-wider mb-2 flex items-center gap-2 text-left">
            <Calendar className="w-5 h-5 text-orange-500" />
            Schedule Round 1
          </h2>
          <p className="text-xs text-slate-400 font-sans text-left">
            Schedule interview assessments for job "<span className="text-white font-semibold">{selectedJobForScheduling.title}</span>". Candidates will be randomly grouped into teams of 3 to 5 and notified immediately.
          </p>
        </div>

        <form onSubmit={handleScheduleJob} className="flex flex-col gap-4 text-left">
          {!selectedJobForScheduling.assessment_id && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 font-sans flex flex-col gap-1">
              <span className="font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider font-mono text-amber-300">
                ✨ AI-Generated Coding Assessment
              </span>
              <span>This job does not have a linked assessment challenge. Gemini AI will automatically generate a tailored coding challenge workspace based on the job title, track, and description.</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-slate-400 uppercase">Assessment Time Slot</label>
            <input
              type="text"
              required
              value={schedulingTimeSlot}
              onChange={(e) => setSchedulingTimeSlot(e.target.value)}
              placeholder="e.g., Tomorrow at 10:00 AM, or June 28 at 2:00 PM"
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 leading-normal font-sans">
              Enter the slot details. Every candidate who has applied to this job posting ({selectedJobForScheduling.applicationCount || 0} candidate(s)) will receive a customized alert notification containing their team chamber UID.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={schedulingInProgress}
              className="py-2.5 px-6 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {schedulingInProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : "Form Teams & Schedule"}
            </button>
            <button
              type="button"
              onClick={() => { setShowSchedulingModal(false); setSelectedJobForScheduling(null); setSchedulingTimeSlot(""); }}
              className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {showNotificationModal && (
    <div className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0f1d] border border-white/10 max-w-md w-full p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative z-50">
        <button
          onClick={() => { setShowNotificationModal(false); setBroadcastJobId(""); setBroadcastTimeSlot(""); }}
          className="absolute top-4 right-4 p-2 text-slate-405 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-lg font-black font-outfit text-white uppercase tracking-wider mb-2 flex items-center gap-2 text-left">
            <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
            AI Assessment Scheduling
          </h2>
          <p className="text-xs text-slate-400 font-sans text-left">
            Select a job posting. Internally, the AI will perform random group division, form teams, generate unique sandbox chamber UIDs, and broadcast personalized assessment invitations to all applicants.
          </p>
        </div>

        <form onSubmit={handleAIBroadcast} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-slate-400 uppercase">Select Job Posting *</label>
            <select
              required
              value={broadcastJobId}
              onChange={(e) => handleBroadcastJobChange(e.target.value)}
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="">-- Choose Job --</option>
              {jobs.filter(j => j.status === 'closed' && (j.applicationCount || 0) > 0).map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.applicationCount || 0} applicants){!job.assessment_id ? ' - (AI Auto-Gen Assessment)' : ''}
                </option>
              ))}
            </select>
          </div>

          {(() => {
            const selectedBroadcastJob = jobs.find(j => j.id === broadcastJobId);
            const broadcastNeedsLink = selectedBroadcastJob && !selectedBroadcastJob.assessment_id;
            return broadcastNeedsLink ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 font-sans flex flex-col gap-1 text-left">
                <span className="font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider font-mono text-amber-300">
                  ✨ AI-Generated Coding Assessment
                </span>
                <span>This job does not have a linked assessment challenge. Gemini AI will automatically generate a tailored coding challenge workspace based on the job title, track, and description.</span>
              </div>
            ) : null;
          })()}

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-slate-400 uppercase">Assessment Time Slot / Start Time *</label>
            <input
              type="text"
              required
              value={broadcastTimeSlot}
              onChange={(e) => setBroadcastTimeSlot(e.target.value)}
              placeholder="e.g., Tomorrow at 10:00 AM, or June 28 at 2:00 PM"
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 leading-normal font-sans">
              Enter the starting schedule slot. AI will notify each candidate separately with personalized messaging containing their specific team's UID.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={broadcasting}
              className="py-2.5 px-6 bg-orange-600 hover:bg-orange-500 text-white font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {broadcasting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running AI Division & Broadcast...
                </>
              ) : (
                "Broadcast via AI"
              )}
            </button>
            <button
              type="button"
              onClick={() => { setShowNotificationModal(false); setBroadcastJobId(""); setBroadcastTimeSlot(""); }}
              className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
}
