"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  TrendingUp,
  Briefcase,
  Shield,
  User,
  Award,
  FileText,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  Loader2,
  LogOut,
  Newspaper,
  Bell,
  CreditCard,
  Lock,
  Plus,
  Check,
  Activity,
  Sparkles,
  Clock,
  MapPin,
  Calendar,
  X,
  ChevronRight
} from "lucide-react";

interface TeamAssessment {
  id: string;
  status: "pending" | "active" | "completed" | "aborted";
  session_start: string | null;
  session_end: string | null;
  assessment: {
    id: string;
    title: string;
    tech_track: string;
    seniority_level: string;
  };
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  tags: string[];
  description: string;
}

export default function CandidateDashboard() {
  const { profile, token, signOut, apiFetch } = useAuth();
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>("home");

  // Premium Subscription Status
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");

  // Job List state
  const [jobs] = useState<Job[]>([
    {
      id: "job-1",
      title: "Senior AI Integration Architect",
      company: "Redrob Corp",
      location: "San Francisco, CA (Hybrid)",
      salary: "$160,000 - $190,000",
      match: 96,
      tags: ["React", "Python", "LLMs", "Vector DBs"],
      description: "Design and implement collaborative agentic pipelines utilizing state-of-the-art telemetry architectures. Work closely with product leads to scale cognitive software evaluation metrics."
    },
    {
      id: "job-2",
      title: "Lead Fullstack Developer",
      company: "Vercel Partners",
      location: "Remote (Global)",
      salary: "$140,000 - $170,000",
      match: 89,
      tags: ["Next.js", "TypeScript", "Node.js", "Postgres"],
      description: "Scale core runtime dashboards with real-time analytics, focusing on sub-millisecond updates, telemetry logging mechanisms, and premium glassmorphism layouts."
    },
    {
      id: "job-3",
      title: "Ambient Telemetry Engineer",
      company: "Supabase Labs",
      location: "Singapore (Remote)",
      salary: "$130,000 - $155,000",
      match: 84,
      tags: ["Rust", "WebSockets", "TimescaleDB", "Go"],
      description: "Maintain high-frequency websocket telemetry engines mapping keystroke dynamics, paste buffers, and developer focus events for distributed assessments."
    },
    {
      id: "job-4",
      title: "Next-Gen UI Specialist",
      company: "Luxury Creative Agency",
      location: "New York, NY (Onsite)",
      salary: "$110,000 - $140,000",
      match: 76,
      tags: ["WebGL", "Three.js", "Tailwind CSS", "GSAP"],
      description: "Build immersive landing pages with 3D particles, custom canvas overlays, and fluid scroll animations mimicking modern creative designs."
    }
  ]);

  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
    hasInjection?: boolean;
  } | null>(null);

  // Assessment Teams list
  const [teams, setTeams] = useState<TeamAssessment[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [uidInput, setUidInput] = useState("");
  const [uidError, setUidError] = useState<string | null>(null);
  const [verifyingUid, setVerifyingUid] = useState(false);
  const [uidVerified, setUidVerified] = useState(false);
  const [proceedChecked, setProceedChecked] = useState(false);

  // Profile Form state
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [dob, setDob] = useState("");
  const [degree, setDegree] = useState("");
  const [school, setSchool] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSyncStatus, setProfileSyncStatus] = useState<string | null>(null);

  // Notification Feed
  const [notifications, setNotifications] = useState<{ id: string; text: string; date: string; type: "alert" | "info" | "success" }[]>([
    {
      id: "notif-1",
      text: "System registered a pending Round 1 Workspace Invitation. Enter UID to unlock instructions.",
      date: "Just now",
      type: "alert"
    },
    {
      id: "notif-2",
      text: "Welcome to Redrob Sandboxed assessments! Keep your profile completed to match active jobs.",
      date: "2 hours ago",
      type: "info"
    }
  ]);

  // Fetch assigned teams
  const fetchTeams = useCallback(async () => {
    try {
      const res = await apiFetch("/api/teams/my-teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || []);
      }
    } catch (err) {
      console.error("Error fetching candidate teams:", err);
    } finally {
      setLoadingTeams(false);
    }
  }, [apiFetch]);

  // Load configuration from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const premium = localStorage.getItem("ras_premium") === "true";
      setIsPremium(premium);

      const applied = localStorage.getItem("ras_applied_jobs");
      if (applied) {
        setAppliedJobs(JSON.parse(applied));
      }

      const cachedProfile = localStorage.getItem("ras_profile");
      if (cachedProfile) {
        const data = JSON.parse(cachedProfile);
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setDob(data.dob || "");
        setDegree(data.degree || "");
        setSchool(data.school || "");
        setGradYear(data.gradYear || "");
        setCompany(data.company || "");
        setRole(data.role || "");
        setDuration(data.duration || "");
        setSkills(data.skills || "");
        setPreferredRole(data.preferredRole || "");
        setExpectedSalary(data.expectedSalary || "");
      }
    }
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }
    if (profile && profile.role !== "candidate") {
      router.push("/employer/dashboard");
      return;
    }
    fetchTeams();
  }, [profile, token, router, fetchTeams]);

  // Handle Mock Payment Submit
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc) return;

    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setIsPremium(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("ras_premium", "true");
      }
      setShowPaymentModal(false);
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          text: `Premium Subscription successfully authorized ($${selectedPlan === "monthly" ? "19.99/mo" : "149.99/yr"}). Resume upload unlocked.`,
          date: "Just now",
          type: "success"
        },
        ...prev
      ]);
    }, 2000);
  };

  // Job Apply Click handler
  const handleJobApplyClick = (job: Job) => {
    if (!isPremium) {
      setSelectedJobToApply(job);
      setShowPaymentModal(true);
    } else {
      setSelectedJobToApply(job);
      setActiveTab("jobs-upload");
      setUploadStatus(null);
      setResumeFile(null);
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;

    // Frontend Format Check
    if (!resumeFile.name.toLowerCase().endsWith(".pdf")) {
      setUploadStatus({
        success: false,
        message: "File scanning rejected: The workspace scanner requires authentic PDF documents to perform semantic security checks. Please select a valid PDF file."
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await apiFetch("/api/resume/upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set boundary
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse resume");
      }

      if (data.resume.has_injection) {
        setUploadStatus({
          success: true,
          hasInjection: true,
          message: "Prompt injection payloads stripped from PDF! The Hybrid Cascade Detector (HCD) neutralized scripting logs. Scored metrics will flag security integrity logs."
        });
      } else {
        setUploadStatus({
          success: true,
          hasInjection: false,
          message: "Resume processed successfully! Semantic credentials scanned and synchronized with matching models."
        });
      }

      if (selectedJobToApply) {
        const updated = [...appliedJobs, selectedJobToApply.id];
        setAppliedJobs(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("ras_applied_jobs", JSON.stringify(updated));
        }

        // Add team invitation simulation after successful apply
        setTimeout(() => {
          setNotifications(prev => [
            {
              id: `notif-${Date.now()}`,
              text: `Team sandbox chamber formed with 4 random candidates for ${selectedJobToApply.title}! Active test slot assigned with UID: d9777164-52eb-4fd2-a5e0-252e31930558. Details: Duration is 90 minutes, starting Tomorrow at 10:00 AM. Join sandbox now.`,
              date: "Just now",
              type: "alert"
            },
            ...prev
          ]);
        }, 3000);
      }
    } catch (err: any) {
      setUploadStatus({
        success: false,
        message: err.message || "Resume upload failed. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSyncStatus(null);

    setTimeout(() => {
      const info = {
        phone,
        location,
        dob,
        degree,
        school,
        gradYear,
        company,
        role,
        duration,
        skills,
        preferredRole,
        expectedSalary
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("ras_profile", JSON.stringify(info));
      }
      setSavingProfile(false);
      setProfileSyncStatus("Profile qualifications updated and synchronized.");
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          text: "Profile qualifications updated and synchronized.",
          date: "Just now",
          type: "success"
        },
        ...prev
      ]);
    }, 1500);
  };

  // Verify Assessment UID
  const handleVerifyUid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uidInput.trim()) return;

    setVerifyingUid(true);
    setUidError(null);

    try {
      const res = await apiFetch(`/api/teams/${uidInput.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sandbox chamber not found or unauthorized ID.");
      }

      const isMember = data.team.members.some(
        (m: any) => m.candidate?.id === profile?.id
      );

      if (!isMember) {
        throw new Error("You are not registered in this assessment sandbox team. Contact your employer.");
      }

      setUidError(null);
      setUidVerified(true);
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          text: `UID verified. Registered in sandbox team: ${data.team.assessment?.title}`,
          date: "Just now",
          type: "success"
        },
        ...prev
      ]);
    } catch (err: any) {
      setUidError(err.message || "UID verification failed.");
      setUidVerified(false);
    } finally {
      setVerifyingUid(false);
    }
  };

  const handleStartTest = () => {
    if (!uidInput.trim() || !proceedChecked || !uidVerified) return;
    router.push(`/candidate/workspace/${uidInput.trim()}`);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
      </div>
    );
  }

  // Active stats counts
  const statCompletedTests = teams.filter(t => t.status === "completed").length;

  return (
    <div className="h-screen bg-[#030712] text-slate-100 flex flex-col relative font-sans overflow-hidden selection:bg-fuchsia-600 selection:text-white">
      {/* Background neon glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-lime-900/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* HEADER BAR (Cyber-Dark style) */}
      <header className="px-6 py-4 border-b border-slate-800 bg-[#070b16]/90 backdrop-blur-md relative z-45 flex items-center justify-between h-16 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-fuchsia-600 flex items-center justify-center font-bold text-white font-outfit text-sm shadow-sm shadow-fuchsia-600/20">
            R
          </div>
          <span className="font-extrabold font-outfit text-white text-base tracking-tight">
            Redrob <span className="text-fuchsia-500">Sandbox</span>
          </span>
          <span className="text-[9px] font-mono font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest ml-2 hidden sm:inline-block">
            Developer Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Premium status badge */}
          {isPremium ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">Premium Access</span>
            </div>
          ) : (
            <button
              onClick={() => { setSelectedPlan("monthly"); setShowPaymentModal(true); }}
              className="flex items-center gap-1 px-3 py-1 bg-fuchsia-500/10 hover:bg-fuchsia-600 hover:text-white border border-fuchsia-500/20 rounded-full transition-all text-[10px] font-bold text-fuchsia-400 cursor-pointer shadow-xs"
            >
              <CreditCard className="w-3 h-3 text-fuchsia-400" />
              <span>Upgrade to Premium</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center text-xs font-bold font-mono shadow-sm">
              {profile.full_name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 leading-none">{profile.full_name}</span>
              <span className="text-[9px] font-mono text-slate-500 mt-1">{profile.email}</span>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN ROW LAYOUT CONTAINER */}
      <div className="flex-grow flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col md:flex-row overflow-hidden relative z-10 border-x border-slate-900 bg-[#050814]/30">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="hidden md:flex w-56 lg:w-64 border-r border-slate-800 bg-[#070b16]/65 px-3 py-4 flex-col gap-1.5 shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between px-3 mb-2 shrink-0">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              Main Menu
            </span>
            <span className="text-[8px] font-mono text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-lime-500/20">
              <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-ping shrink-0" />
              Connected
            </span>
          </div>

          <button
            onClick={() => setActiveTab("home")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer border ${
              activeTab === "home"
                ? "bg-fuchsia-600/10 border-fuchsia-500/20 text-fuchsia-400 font-extrabold"
                : "bg-transparent border-transparent text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/20"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard Home</span>
          </button>

          <button
            onClick={() => setActiveTab("analysis")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer border ${
              activeTab === "analysis"
                ? "bg-fuchsia-600/10 border-fuchsia-500/20 text-fuchsia-400 font-extrabold"
                : "bg-transparent border-transparent text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/20"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Market Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer border ${
              activeTab === "jobs" || activeTab === "jobs-upload"
                ? "bg-fuchsia-600/10 border-fuchsia-500/20 text-fuchsia-400 font-extrabold"
                : "bg-transparent border-transparent text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/20"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Find Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab("assessment")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer border ${
              activeTab === "assessment"
                ? "bg-fuchsia-600/10 border-fuchsia-500/20 text-fuchsia-400 font-extrabold"
                : "bg-transparent border-transparent text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/20"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Assessment Center</span>
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer border ${
              activeTab === "results"
                ? "bg-fuchsia-600/10 border-fuchsia-500/20 text-fuchsia-400 font-extrabold"
                : "bg-transparent border-transparent text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/20"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Career Results</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer border ${
              activeTab === "profile"
                ? "bg-fuchsia-600/10 border-fuchsia-500/20 text-fuchsia-400 font-extrabold"
                : "bg-transparent border-transparent text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/20"
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer border ${
              activeTab === "news"
                ? "bg-fuchsia-600/10 border-fuchsia-500/20 text-fuchsia-400 font-extrabold"
                : "bg-transparent border-transparent text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/20"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>News Hub</span>
          </button>
        </aside>

        {/* MAIN VIEWPORT CONTAINER */}
        <main className="flex-1 min-w-0 overflow-y-auto relative">
          
          {/* TAB 1: HOME PANEL */}
          {activeTab === "home" && (
            <div className="px-6 md:px-10 py-6 md:py-8 w-full flex flex-col gap-6 pb-20">
            
            {/* Profile welcome */}
            <div className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-black/20 hover:border-fuchsia-500/25 transition-all duration-300">
              <div className="flex flex-col gap-1 text-left">
                <h1 className="text-lg md:text-xl font-black font-outfit text-white tracking-tight">
                  Welcome back, <span className="text-fuchsia-450 text-fuchsia-400">{profile.full_name}</span>
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed max-w-lg font-sans font-medium">
                  Your candidate portal is connected to active assessment workflows. Scanned resumes match semantic hiring channels directly.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("profile")}
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold font-outfit text-slate-300 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Edit Profile
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              <div className="p-4 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-2 relative shadow-lg shadow-black/20 hover:border-fuchsia-500/25 transition-all">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/15 flex items-center justify-center text-fuchsia-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Applied</div>
                <div className="text-xl font-black font-outfit text-white">{12 + appliedJobs.length}</div>
              </div>

              <div className="p-4 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-2 shadow-lg shadow-black/20 hover:border-fuchsia-500/25 transition-all">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/15 flex items-center justify-center text-fuchsia-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Active Jobs</div>
                <div className="text-xl font-black font-outfit text-white">5</div>
              </div>

              <div className="p-4 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-2 shadow-lg shadow-black/20 hover:border-fuchsia-500/25 transition-all">
                <div className="w-8 h-8 rounded-lg bg-lime-500/5 border border-lime-500/15 flex items-center justify-center text-lime-400">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Shortlisted</div>
                <div className="text-xl font-black font-outfit text-white">2</div>
              </div>

              <div className="p-4 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-2 shadow-lg shadow-black/20 hover:border-fuchsia-500/25 transition-all">
                <div className="w-8 h-8 rounded-lg bg-lime-500/5 border border-lime-500/15 flex items-center justify-center text-lime-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Tests Taken</div>
                <div className="text-xl font-black font-outfit text-white">3</div>
              </div>
            </div>

            {/* Grid content: Job Market inline Graph + Assessments/Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 shrink-0">
              
              {/* Left: Job Market Analysis summary card */}
              <div className="lg:col-span-7 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl flex flex-col gap-3 shadow-lg shadow-black/20 text-left hover:border-fuchsia-500/25 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Job Market Analysis</h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">Aggregate fullstack engineering job demand over time</p>
                  </div>
                  <span className="text-[8px] font-mono font-bold bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 rounded text-lime-400 uppercase">
                    Hiring Surge
                  </span>
                </div>

                {/* Inline Chart */}
                <div className="w-full h-28 relative">
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="homeChartGradLime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#84cc16" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                    
                    <path
                      d="M 0,200 L 0,160 Q 120,130 200,90 T 400,60 Q 500,70 600,30 L 600,200 Z"
                      fill="url(#homeChartGradLime)"
                    />
                    <path
                      d="M 0,160 Q 120,130 200,90 T 400,60 Q 500,70 600,30"
                      fill="none"
                      stroke="#84cc16"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="200" cy="90" r="4.5" fill="#a3e635" stroke="#090d16" strokeWidth="1.5" />
                    <circle cx="400" cy="60" r="4.5" fill="#a3e635" stroke="#090d16" strokeWidth="1.5" />
                    <circle cx="600" cy="30" r="4.5" fill="#a3e635" stroke="#090d16" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="border-t border-slate-800/80 pt-2.5 flex flex-col gap-1.5 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-400">📈 Trending Now:</span>
                    <span className="font-bold text-slate-200">React, Node.js, AI/ML Agents, WebSockets</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-400">🔥 Hot Time:</span>
                    <span className="font-bold text-lime-400 bg-lime-500/5 border border-lime-500/15 px-2 py-0.5 rounded">2026 Q3 Predicted Hiring Surge</span>
                  </div>
                </div>
              </div>

              {/* Right: Active Assessments list */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-white uppercase tracking-wider">
                    Assessment Snapshots
                  </h2>
                  <button onClick={fetchTeams} className="text-[10px] font-mono font-bold text-fuchsia-400 hover:underline cursor-pointer">
                    Refresh
                  </button>
                </div>

                {loadingTeams ? (
                  <div className="min-h-[110px] flex items-center justify-center bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl">
                    <Loader2 className="w-5 h-5 animate-spin text-fuchsia-500" />
                  </div>
                ) : teams.length === 0 ? (
                  <div className="p-4 text-center bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col items-center justify-center gap-1">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <p className="text-[9px] text-slate-500 font-sans">
                      No active workspace invitations. Verify UID in the Assessment tab.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {teams.slice(0, 2).map(team => (
                      <div key={team.id} className="p-3 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] hover:border-fuchsia-500/30 rounded-xl flex items-center justify-between gap-3 transition-all">
                        <div className="flex flex-col text-left min-w-0">
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 bg-slate-900 border border-slate-800 text-slate-400 w-fit rounded capitalize">
                            {team.assessment?.tech_track}
                          </span>
                          <h3 className="text-xs font-bold text-slate-200 mt-1 truncate">
                            {team.assessment?.title}
                          </h3>
                        </div>

                        <div className="shrink-0">
                          {team.status === "active" ? (
                            <Link
                              href={`/candidate/workspace/${team.id}`}
                              className="py-1 px-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold font-outfit text-[9px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              Join
                              <Play className="w-2 h-2 fill-white text-white" />
                            </Link>
                          ) : team.status === "completed" ? (
                            <Link
                              href={`/candidate/workspace/${team.id}/review`}
                              className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-outfit text-[9px] rounded-lg transition-all cursor-pointer"
                            >
                              Review
                            </Link>
                          ) : (
                            <button
                              onClick={() => { setUidInput(team.id); setActiveTab("assessment"); }}
                              className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold font-outfit text-[9px] rounded-lg transition-all cursor-pointer"
                            >
                              Verify UID
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mini Notifications inbox */}
                <div className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-3 rounded-xl flex flex-col gap-2 shadow-2xs text-left">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">System Alerts</span>
                  {notifications.slice(0, 2).map(n => (
                    <div key={n.id} className="text-left pb-1.5 border-b border-slate-800 last:border-b-0 last:pb-0 flex items-start gap-2">
                      <div className="mt-0.5 shrink-0">
                        {n.type === "alert" ? (
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                        ) : n.type === "success" ? (
                          <CheckCircle className="w-3 h-3 text-lime-400" />
                        ) : (
                          <Bell className="w-3 h-3 text-fuchsia-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom: Personalized Job Recommendations */}
            <div className="flex flex-col gap-4 text-left shrink-0">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                💼 Personalized Job Recommendations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {jobs.slice(0, 3).map(job => (
                  <div key={job.id} className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] hover:border-lime-500/30 p-4 rounded-xl flex flex-col justify-between min-h-[180px] transition-all shadow-sm group">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-lime-400 transition-colors">
                            {job.title}
                          </h4>
                          <span className="text-[8px] text-slate-500 font-mono">{job.company}</span>
                        </div>
                        <span className="shrink-0 text-[9px] font-bold text-lime-400 bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                          ⚡ {job.match}% match
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans line-clamp-3">
                        {job.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[8px] text-slate-500 flex items-center gap-1 font-mono">
                        <MapPin className="w-2.5 h-2.5 text-slate-500" />
                        {job.location.split(" (")[0]}
                      </span>
                      
                      {appliedJobs.includes(job.id) ? (
                        <span className="text-[9px] font-bold text-lime-450 text-lime-400 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => handleJobApplyClick(job)}
                          className="py-1 px-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold font-outfit text-[9px] rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-0.5"
                        >
                          Apply
                          <ArrowRight className="w-2.5 h-2.5 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MARKET ANALYTICS */}
        {activeTab === "analysis" && (
          <div className="px-6 md:px-10 py-6 md:py-8 w-full flex flex-col gap-6 pb-20">
            <div className="flex flex-col gap-1 text-left shrink-0">
              <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                Job Market Analytics & Timing Hotspots
              </h1>
              <p className="text-xs text-slate-400 leading-normal font-medium">
                Real-time engineering job demand tracking, timing advantages, and automated skill-gap analysis.
              </p>
            </div>

            {/* Line Graph block */}
            <div className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl shadow-sm flex flex-col gap-4 text-left shrink-0 hover:border-lime-500/25 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Engineering Job Demand Trend (2025 - 2026)</h3>
                  <p className="text-[9px] text-slate-500">Aggregate volume of recruitment searches in agentic fullstack layers</p>
                </div>
                <div className="text-[9px] font-mono font-bold bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 rounded text-lime-400 uppercase">
                  Hiring Surge Predicted
                </div>
              </div>

              {/* SVG Graph */}
              <div className="w-full h-40 mt-2 relative">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />

                  <path
                    d="M 0,200 L 0,160 Q 120,130 200,90 T 400,60 Q 500,70 600,30 L 600,200 Z"
                    fill="url(#homeChartGradLime)"
                  />
                  <path
                    d="M 0,160 Q 120,130 200,90 T 400,60 Q 500,70 600,30"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <circle cx="200" cy="90" r="4" fill="#a3e635" stroke="#090d16" strokeWidth="1.5" />
                  <circle cx="400" cy="60" r="4" fill="#a3e635" stroke="#090d16" strokeWidth="1.5" />
                  <circle cx="600" cy="30" r="4.5" fill="#a3e635" stroke="#090d16" strokeWidth="1.5" />
                </svg>
                
                {/* Tooltip Simulation */}
                <div className="absolute top-[10px] right-[10px] bg-[#090d16] border border-fuchsia-500/25 p-2 rounded-xl text-left shadow-lg pointer-events-none text-[10px]">
                  <span className="text-[8px] font-mono text-slate-500 uppercase">Current Month (June 2026)</span>
                  <div className="text-[11px] font-black text-white font-outfit mt-0.5">Peak Volume: +42% YoY</div>
                </div>
              </div>

              <div className="grid grid-cols-4 border-t border-slate-800/80 pt-3 text-center text-[10px]">
                <div>
                  <span className="text-[9px] font-mono text-slate-500">Q3 2025</span>
                  <div className="font-bold text-slate-400 mt-0.5">Stable</div>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500">Q4 2025</span>
                  <div className="font-bold text-slate-400 mt-0.5">Moderate</div>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500">Q1 2026</span>
                  <div className="font-bold text-slate-400 mt-0.5">Growth</div>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500">Q2 2026 (Now)</span>
                  <div className="font-bold text-lime-400 mt-0.5">Peak Surge</div>
                </div>
              </div>
            </div>

            {/* Heatmaps and company insights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 shrink-0">
              
              {/* Hot skills heatmap list */}
              <div className="md:col-span-6 p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-3 text-left">
                <h3 className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Activity className="w-4 h-4 text-lime-400" />
                  Demand Heatmap by Tech Skill
                </h3>
                
                <div className="flex flex-col gap-3.5 mt-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-slate-300">AI Agents & System Architecture</span>
                      <span className="font-mono text-lime-400 font-bold">98% volume</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-500 rounded-full" style={{ width: "98%" }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-slate-300">Next.js & Serverless UI</span>
                      <span className="font-mono text-lime-400 font-bold">88% volume</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-500 rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-slate-300">WebSocket / Telemetry Systems</span>
                      <span className="font-mono text-lime-400 font-bold">75% volume</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-500 rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-slate-300">WebGL & Canvas Graphics</span>
                      <span className="font-mono text-lime-400 font-bold">62% volume</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-500 rounded-full" style={{ width: "62%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timing Advantage Analysis */}
              <div className="md:col-span-6 p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-3 text-left">
                <h3 className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Clock className="w-4 h-4 text-lime-400" />
                  Hiring Timing Hotspots
                </h3>
                
                <div className="p-3 bg-fuchsia-950/20 border border-fuchsia-900/35 rounded-lg text-xs leading-relaxed text-slate-300">
                  <span className="font-extrabold text-fuchsia-400 block mb-1">Timing Hotspot Alert: Q3 Surge</span>
                  Historical statistics show candidates submitting applications in Q3 (July - August) experience a **3.4x higher rate** of team sandboxing. Corporate hiring teams allocate fresh assessment pools during this cycle. 
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">Recruitment Insights</h4>
                  <ul className="text-[10px] text-slate-400 space-y-1.5 list-disc list-inside font-medium">
                    <li>Mass hiring campaigns targeting DevOps and Security pipelines.</li>
                    <li>High demand for fullstack candidates with verified HCD resume reports.</li>
                    <li>Socratic evaluation scores are heavily reviewed for Senior and Architect roles.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: FIND JOBS (PERSONALIZED) */}
        {activeTab === "jobs" && (
          <div className="px-6 md:px-10 py-6 md:py-8 w-full flex flex-col gap-6 pb-20">
            <div className="flex flex-col gap-1 text-left shrink-0">
              <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                Personalized Job Listings
              </h1>
              <p className="text-xs text-slate-450 leading-normal font-sans font-medium">
                Active roles compiled based on matching parameters. Standard applications require a premium gateway validation.
              </p>
            </div>

            {/* Job listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
              {jobs.map(job => (
                <div key={job.id} className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] hover:border-fuchsia-500/25 rounded-2xl flex flex-col justify-between min-h-[220px] transition-all relative group">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-0.5 text-left">
                        <h3 className="text-xs font-black font-outfit text-white group-hover:text-fuchsia-400 transition-colors">
                          {job.title}
                        </h3>
                        <span className="text-[9px] font-mono text-slate-500">{job.company}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold text-lime-450 text-lime-400 bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 rounded-full">
                          {job.match}% match
                        </span>
                        {appliedJobs.includes(job.id) && (
                          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-550/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            Applied
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.2 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-405 text-slate-400 leading-normal font-sans text-left">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
                    <div className="text-[9px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{job.location}</span>
                    </div>

                    {appliedJobs.includes(job.id) ? (
                      <div className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1 font-sans">
                        <Check className="w-3 h-3 text-emerald-450" />
                        Reviewing Status
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJobApplyClick(job)}
                        className="py-1.5 px-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold font-outfit text-[10px] rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
                      >
                        Apply Position
                        <ArrowRight className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3.5: JOBS RESUME UPLOAD FLOW */}
        {activeTab === "jobs-upload" && selectedJobToApply && (
          <div className="px-6 md:px-10 py-6 md:py-8 w-full flex flex-col gap-4 pb-20">
            <button
              onClick={() => setActiveTab("jobs")}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 text-left font-bold cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-500" />
              Cancel Application
            </button>

            <div className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl shadow-sm flex flex-col gap-5">
              <div>
                <span className="text-[8px] font-mono font-bold px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded text-fuchsia-400 uppercase">
                  Step 2: Resume Scanning
                </span>
                <h2 className="text-sm font-bold font-outfit text-white mt-3 mb-1 text-left">
                  Apply to: {selectedJobToApply.title} ({selectedJobToApply.company})
                </h2>
                <p className="text-[11px] text-slate-400 leading-normal max-w-xl text-left">
                  Our Hybrid Cascade Detector (HCD) parses skills while scanning the document structures to intercept malicious exploit injections. Select an authentic PDF resume format.
                </p>
              </div>

              <form onSubmit={handleResumeUpload} className="flex flex-col gap-4 max-w-md">
                <div className="border border-dashed border-slate-800 hover:border-fuchsia-500/40 bg-slate-950/60 rounded-xl p-6 transition-all flex flex-col items-center justify-center cursor-pointer text-center relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="w-8 h-8 text-slate-650 group-hover:text-fuchsia-400 transition-colors mb-2" />
                  <span className="text-xs font-bold text-slate-300">
                    {resumeFile ? resumeFile.name : "Select or drag PDF resume here"}
                  </span>
                  <span className="text-[8px] text-slate-500 mt-1">
                    PDF formats only (Max size 5MB)
                  </span>
                </div>

                {resumeFile && (
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold font-outfit rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Neutralizing payloads...
                      </>
                    ) : (
                      <>
                        Upload and Submit Application
                        <Check className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                )}
              </form>

              {uploadStatus && (
                <div className="max-w-md">
                  <div
                    className={`p-3 border rounded-xl flex items-start gap-3 text-[11px] leading-relaxed ${
                      !uploadStatus.success
                        ? "bg-rose-950/20 border-rose-900/30 text-rose-305 text-rose-300"
                        : uploadStatus.hasInjection
                        ? "bg-amber-950/20 border-amber-900/30 text-amber-305 text-amber-300"
                        : "bg-lime-950/20 border-lime-900/30 text-lime-305 text-lime-400"
                    }`}
                  >
                    {!uploadStatus.success ? (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    ) : uploadStatus.hasInjection ? (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0 text-lime-400" />
                    )}
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="font-extrabold uppercase text-[8px] tracking-wider font-mono">
                        {!uploadStatus.success ? "Scan Error" : uploadStatus.hasInjection ? "HCD Payload Strip alert" : "Credentials Verified"}
                      </span>
                      <span>{uploadStatus.message}</span>
                    </div>
                  </div>

                  {uploadStatus.success && (
                    <div className="mt-3 flex gap-2.5">
                      <button
                        onClick={() => { setActiveTab("jobs"); setSelectedJobToApply(null); }}
                        className="py-1.5 px-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold font-outfit text-xs rounded-xl cursor-pointer"
                      >
                        Back to Jobs
                      </button>
                      <button
                        onClick={() => setActiveTab("home")}
                        className="py-1.5 px-3.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold font-outfit text-xs rounded-xl cursor-pointer"
                      >
                        View Dashboard
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ASSESSMENT CENTER */}
        {activeTab === "assessment" && (
          <div className="px-6 md:px-10 py-6 md:py-8 w-full flex flex-col gap-6 pb-20">
            <div className="flex flex-col gap-1 text-left shrink-0">
              <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                Assessment Entry Chamber
              </h1>
              <p className="text-xs text-slate-400 leading-normal font-sans font-medium">
                Register assessment IDs, read instructions checklist, and proceed directly to collaborative sandbox IDEs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 shrink-0">
              {/* Left Form: Enter UID */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl shadow-sm flex flex-col gap-3 text-left">
                  <h3 className="text-[10px] font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-fuchsia-500" />
                    Verify Sandbox UID
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                    Recruiters generate assessment UIDs upon forming sandbox teams. Enter or paste your registered workspace UID below.
                  </p>

                  {/* Quick fill section if candidate has assigned team */}
                  {teams.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-mono font-bold text-slate-550 uppercase tracking-widest">My Active Assessment IDs</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {teams.map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setUidInput(t.id)}
                            className="text-[8px] font-mono px-2 py-0.8 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-fuchsia-400 hover:text-fuchsia-350 transition-colors font-bold cursor-pointer"
                          >
                            {t.assessment?.title} ({t.id.substring(0, 8)}...)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleVerifyUid} className="flex flex-col gap-3 mt-0.5">
                    <input
                      type="text"
                      required
                      value={uidInput}
                      onChange={(e) => { setUidInput(e.target.value); setUidVerified(false); setUidError(null); }}
                      placeholder="Enter 36-char Team UUID..."
                      className={`w-full px-3.5 py-2.5 bg-slate-950 border ${uidVerified ? 'border-lime-500/40' : 'border-slate-850'} focus:border-fuchsia-500/50 rounded-xl text-white placeholder-slate-650 focus:outline-none transition-all font-mono text-[10px]`}
                    />

                    <button
                      type="submit"
                      disabled={verifyingUid}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {verifyingUid ? (
                        <Loader2 className="w-4 h-4 animate-spin text-fuchsia-500" />
                      ) : (
                        "Verify Registration"
                      )}
                    </button>
                  </form>

                  {uidError && (
                    <div className="p-2.5 bg-rose-950/20 border border-rose-900/35 text-rose-350 text-[10px] rounded-xl flex items-center gap-2 text-left">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span>{uidError}</span>
                    </div>
                  )}

                  {uidVerified && !uidError && (
                    <div className="p-2.5 bg-lime-950/20 border border-lime-900/35 text-lime-400 text-[10px] rounded-xl flex items-center gap-2 text-left">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-lime-450" />
                      <span>UID verified successfully. Sandbox team registered. Proceed.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Area: Instructions Checklist */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl shadow-sm flex flex-col gap-4 text-left">
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                    Instructions, Dos & Don'ts Checklist
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                    <div className="p-3 bg-lime-950/10 border border-lime-900/20 rounded-xl text-left">
                      <span className="font-extrabold text-lime-400 text-xs font-outfit uppercase tracking-wider block mb-1.5 font-sans">Chamber Dos</span>
                      <ul className="text-[10px] text-slate-350 space-y-1.5 list-inside list-disc font-sans font-medium">
                        <li>Communicate inside the chat pane.</li>
                        <li>Explain architecture in dialogue feeds.</li>
                        <li>Run execution snapshots frequently.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-950/10 border border-rose-900/20 rounded-xl text-left">
                      <span className="font-extrabold text-rose-400 text-xs font-outfit uppercase tracking-wider block mb-1.5 font-sans">Chamber Don'ts</span>
                      <ul className="text-[10px] text-slate-350 space-y-1.5 list-inside list-disc font-sans font-medium">
                        <li>Avoid external copy-paste cycles.</li>
                        <li>Avoid tab blur actions.</li>
                        <li>Bypassing constraints fails grading.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-3">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={proceedChecked}
                        onChange={(e) => setProceedChecked(e.target.checked)}
                        className="mt-0.5 rounded border-slate-800 focus:ring-fuchsia-500 text-fuchsia-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 leading-normal font-sans font-medium">
                        I agree to enable keyboard biometrics tracking (keystroke flight & dwell durations), window focus monitors, and Socratic assistant logging.
                      </span>
                    </label>

                    <button
                      onClick={handleStartTest}
                      disabled={!uidInput.trim() || !proceedChecked || !uidVerified}
                      className="py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-slate-900 disabled:text-slate-500 disabled:opacity-50 text-white font-extrabold font-outfit text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {!uidVerified ? 'Verify UID First' : 'Start Test / Proceed to IDE'}
                      <Play className="w-3 h-3 fill-white text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Autonomous AI Assessors Deck */}
              <div className="lg:col-span-12 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-6 rounded-2xl shadow-sm text-left hover:border-fuchsia-500/20 transition-all flex flex-col gap-4 mt-2">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                    AI Assessors & Evaluation Agents (Round 1 & 2)
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
                    Evaluation is completely automated up to Round 2 using dedicated Gemini neural models with specific agent directives. No human recruiters are involved during these early stages.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  {/* Agent 1 */}
                  <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col justify-between hover:border-fuchsia-500/30 transition-all">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded">
                          Round 1
                        </span>
                        <span className="text-[9px] font-mono font-bold text-slate-500">Gemini 2.5 Flash</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">Question Generator R1</h4>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        Formulates adaptive, profile-tailored coding challenges. Evaluates technical stack fit and constructs the baseline code templates.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-900/60 text-[9px] font-mono text-slate-500">
                      Mode: Adaptive Generation
                    </div>
                  </div>

                  {/* Agent 2 */}
                  <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col justify-between hover:border-fuchsia-500/30 transition-all">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded">
                          Round 1
                        </span>
                        <span className="text-[9px] font-mono font-bold text-slate-500">Gemini 2.5 Pro</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">Socratic Guide R1</h4>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        Monitors the workspace chat container. Explores candidate technical decisions through interactive dialogue without giving away answers.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-900/60 text-[9px] font-mono text-slate-500">
                      Mode: Interactive Dialogue
                    </div>
                  </div>

                  {/* Agent 3 */}
                  <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col justify-between hover:border-fuchsia-500/30 transition-all">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded">
                          Round 2
                        </span>
                        <span className="text-[9px] font-mono font-bold text-slate-500">Gemini 2.5 Pro</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">Question Generator R2</h4>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        Formulates complex system integration and optimization problems for candidates shortlisted past Round 1.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-900/60 text-[9px] font-mono text-slate-500">
                      Mode: Advanced Integration
                    </div>
                  </div>

                  {/* Agent 4 */}
                  <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col justify-between hover:border-fuchsia-500/30 transition-all">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded">
                          Round 2
                        </span>
                        <span className="text-[9px] font-mono font-bold text-slate-500">Gemini 2.5 Pro</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">Strict Manager R2</h4>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        Triggers real-time chaos tests, conducts safety scanning of inputs, enforces compiler rules, and validates overall security integrity.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-900/60 text-[9px] font-mono text-slate-500">
                      Mode: Strict Security & Chaos
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: PROFILE PAGE */}
        {activeTab === "profile" && (
          <div className="px-6 md:px-10 py-6 md:py-8 w-full flex flex-col gap-6 pb-20">
            <div className="flex flex-col gap-1 text-left shrink-0">
              <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                Qualifications & Resume Profile
              </h1>
              <p className="text-xs text-slate-450 leading-normal font-sans font-medium">
                Keep details synchronized to calibrate matching engines and assessment difficulties automatically.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5 font-sans shrink-0">
              
              {/* Personal fields */}
              <div className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl shadow-sm flex flex-col gap-3">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-fuchsia-500" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-slate-500 uppercase">Contact Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-slate-500 uppercase">Location / Region</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-slate-500 uppercase">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none text-slate-350"
                    />
                  </div>
                </div>
              </div>

              {/* Education and Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-3 text-left">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-fuchsia-500" />
                    Academic Credentials
                  </h3>
                  
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase">Degree program</label>
                      <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="Bachelor of Science in CS"
                        className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase">School / University</label>
                      <input
                        type="text"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="Stanford University"
                        className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase">Graduation Year</label>
                      <input
                        type="text"
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        placeholder="2024"
                        className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-3 text-left">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-fuchsia-500" />
                    Engineering Experience
                  </h3>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase">Company Name</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Stripe Solutions"
                        className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase">Job Title / Role</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Junior Fullstack Architect"
                        className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-slate-500 uppercase">Duration (Months/Years)</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="18 months"
                        className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Preferences and skills */}
              <div className="bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl shadow-sm flex flex-col gap-3">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-fuchsia-500" />
                  Target Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-slate-500 uppercase">Primary Skills</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React, Next.js, WebSockets"
                      className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-slate-500 uppercase">Preferred Role Track</label>
                    <input
                      type="text"
                      value={preferredRole}
                      onChange={(e) => setPreferredRole(e.target.value)}
                      placeholder="Fullstack Web Architect"
                      className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-slate-500 uppercase">Expected Salary ($ / Year)</label>
                    <input
                      type="text"
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      placeholder="$120,000"
                      className="px-3 py-2 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-655"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-1">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="py-2.5 px-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-extrabold font-outfit text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    "Save and Sync Credentials"
                  )}
                </button>

                {profileSyncStatus && (
                  <span className="text-xs text-lime-400 font-mono font-medium animate-pulse">
                    Profile successfully updated and synced.
                  </span>
                )}
              </div>

            </form>
          </div>
        )}

        {/* TAB 6: RESULTS PANEL */}
        {activeTab === "results" && (
          <div className="px-6 md:px-10 py-6 md:py-8 w-full flex flex-col gap-6 pb-20">
            <div className="flex flex-col gap-1 text-left shrink-0">
              <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                Career Results & Rejection Feedback
              </h1>
              <p className="text-xs text-slate-400 leading-normal font-sans font-medium">
                View scores, structured rejection reports, and round 2 scheduling details.
              </p>
            </div>

            {/* Assessment results lists */}
            <div className="flex flex-col gap-6 shrink-0">
                  {/* Django Backend Challenge Details */}
              <div className="flex flex-col gap-4">
                <div className="p-5 bg-amber-500/[0.02] border border-amber-500/20 rounded-2xl relative overflow-hidden flex flex-col gap-2 shadow-xs">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/[0.02] rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-white text-xs font-outfit uppercase tracking-wider">
                      Django Backend Challenge: Shortlisted for Round 2
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed max-w-xl font-sans font-medium text-left">
                    You have successfully cleared the Round 1 screening criteria for the Django Backend Challenge. The employer has scheduled your Round 2 assessment. Your strict evaluator prompt is active.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 border border-slate-900 p-3.5 rounded-xl text-left mt-1">
                    <div>
                      <span className="text-[8px] font-mono text-slate-550 uppercase">Assessment ID</span>
                      <div className="text-[10px] font-mono font-bold text-fuchsia-400 truncate">590aa3f8-20e1-4d0d...</div>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-slate-550 uppercase">Duration</span>
                      <div className="text-[10px] font-mono font-bold text-slate-300">90 minutes</div>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-slate-550 uppercase">Test Mode</span>
                      <div className="text-[10px] font-mono font-bold text-slate-300">Online IDE Sandbox</div>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-slate-550 uppercase">AI Evaluator</span>
                      <div className="text-[10px] font-mono font-bold text-amber-500">Gemini 2.5 Pro</div>
                    </div>
                  </div>
                </div>

                {/* Status progression bar flow */}
                <div className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-3 font-sans shadow-xs">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest text-left">Application Progress Pipeline</span>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-[9px] text-lime-400 font-bold">✓</div>
                      <span className="text-[11px] font-bold text-slate-200">Applied</span>
                    </div>
                    <div className="h-px bg-slate-800 flex-1 hidden md:block" />
                    
                    <div className="flex items-center gap-1.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-[9px] text-lime-400 font-bold">✓</div>
                      <span className="text-[11px] font-bold text-slate-200">Round 1 Assessment</span>
                    </div>
                    <div className="h-px bg-slate-800 flex-1 hidden md:block" />

                    <div className="flex items-center gap-1.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-[9px] text-fuchsia-400 font-bold animate-pulse">●</div>
                      <span className="text-[11px] font-bold text-slate-200">Round 2 Scheduled</span>
                    </div>
                    <div className="h-px bg-slate-800 flex-1 hidden md:block" />

                    <div className="flex items-center gap-1.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[9px] text-slate-550 font-bold">○</div>
                      <span className="text-[11px] font-bold text-slate-500">HR Interview</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-fuchsia-950/10 border border-fuchsia-900/25 rounded-xl text-left leading-relaxed mt-1">
                    <span className="text-[10px] font-extrabold text-fuchsia-400 uppercase tracking-wider block mb-1">
                      Next Step: HR Interview Coordinates
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                      <div>
                        <span className="text-[8px] font-mono text-slate-550 uppercase">Venue Coordinates</span>
                        <div className="text-[10px] font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-fuchsia-450" />
                          12th Floor, Tech Hub Tower, San Francisco, CA (or Zoom link)
                        </div>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-slate-550 uppercase">Status / Mode</span>
                        <div className="text-[10px] font-bold text-lime-400 mt-0.5">
                          Offline / Onsite (Travel voucher provided in mail)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Integration Assessment Details (Rejected) */}
              <div className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] rounded-xl flex flex-col gap-3 font-sans shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest font-mono">
                      System Integration Assessment: Status: Rejected
                    </h3>
                    <p className="text-[9px] text-slate-500">Why your score was below threshold (First Round screening)</p>
                  </div>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                    Rejected
                  </span>
                </div>

                <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-left leading-relaxed text-xs">
                  <span className="text-[10px] font-extrabold text-rose-450 text-rose-400 uppercase tracking-wider block mb-1">
                    Improvement Advice by Ambient AI Assistant
                  </span>
                  <p className="text-slate-300 leading-normal font-medium">
                    "Assessment screening flagged lower metrics in **Collaboration & dialogue act contribution** and **Chaos Resilience**. While the logic compilation executed with 90% correctness, the candidate made 0 chat messages and did not respond to teammate requests or chaos errors triggered on active nodes. Telemetry logs indicate silent coding profiles, which reduces soft-skill matching indexes. Focus on actively communicating architecture patterns and recovery actions during team tasks."
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1 text-left">
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono text-slate-550 uppercase">Correctness</span>
                    <div className="text-xs font-bold text-lime-400">92% (Passed)</div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono text-slate-550 uppercase">Keystroke Integrity</span>
                    <div className="text-xs font-bold text-lime-400">98% (Authentic)</div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono text-slate-550 uppercase">Team Collaboration</span>
                    <div className="text-xs font-bold text-rose-400">42% (Below 60% threshold)</div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono text-slate-550 uppercase">Chaos Resilience</span>
                    <div className="text-xs font-bold text-rose-400">35% (Below 60% threshold)</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 7: NEWS HUB */}
        {activeTab === "news" && (
          <div className="px-6 md:px-10 py-6 md:py-8 w-full flex flex-col gap-6 pb-20">
            <div className="flex flex-col gap-1 text-left shrink-0">
              <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                Platform News & Job Market Releases
              </h1>
              <p className="text-xs text-slate-400 leading-normal font-sans font-medium">
                Stay updated on company layoffs, mass recruitment programs, and upcoming sandbox challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
              
              <div className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] hover:border-fuchsia-500/25 rounded-2xl flex flex-col gap-2 relative transition-colors text-left font-sans shadow-xs">
                <div className="text-[8px] font-mono font-bold text-fuchsia-400 uppercase tracking-widest">Hiring Campaign</div>
                <h3 className="text-xs font-bold text-white font-outfit leading-snug">
                  Redrob Corp Announces 500+ Position Campaign for Q3 Agentic Pipelines
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Hiring managers are launching fresh assessment pools looking for junior to senior-level candidates. Scored sandboxes will bypass manual screening phases automatically.
                </p>
                <span className="text-[8px] font-mono text-slate-550 mt-1">Published: 2 days ago</span>
              </div>

              <div className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] hover:border-fuchsia-500/25 rounded-2xl flex flex-col gap-2 relative transition-colors text-left font-sans shadow-xs">
                <div className="text-[8px] font-mono font-bold text-rose-400 uppercase tracking-widest">Industry Shift</div>
                <h3 className="text-xs font-bold text-white font-outfit leading-snug">
                  Mass Layoffs Cool Down in Major Systems Labs as AI Integrations Stabilize
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Industry reports indicate systems engineers are shifting core expertise from simple code writing to high-frequency WebSocket and API workflow design.
                </p>
                <span className="text-[8px] font-mono text-slate-550 mt-1">Published: 1 week ago</span>
              </div>

              <div className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] hover:border-fuchsia-500/25 rounded-2xl flex flex-col gap-2 relative transition-colors text-left font-sans shadow-xs">
                <div className="text-[8px] font-mono font-bold text-fuchsia-400 uppercase tracking-widest">Telemetry Release</div>
                <h3 className="text-xs font-bold text-white font-outfit leading-snug">
                  Ambient Sandbox Engine Deploys Keystroke Dynamics to Block AI Impersonation
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Next-generation platforms are incorporating flight and dwell timing analytics to verify candidate authenticity while matching candidates to high-quality project cohorts.
                </p>
                <span className="text-[8px] font-mono text-slate-550 mt-1">Published: June 15, 2026</span>
              </div>

              <div className="p-5 bg-[#0a0f1d]/45 backdrop-blur-xl border border-white/[0.06] hover:border-fuchsia-500/25 rounded-2xl flex flex-col gap-2 relative transition-colors text-left font-sans shadow-xs">
                <div className="text-[8px] font-mono font-bold text-amber-500 uppercase tracking-widest">Platform Update</div>
                <h3 className="text-xs font-bold text-white font-outfit leading-snug">
                  Razorpay and Stripe Multi-currency Sandboxes Deployed to Facilitate Premium Gating
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Subscribing to candidate channels is now facilitated via mock transaction pipelines verifying bank triggers without charging real assets.
                </p>
                <span className="text-[8px] font-mono text-slate-550 mt-1">Published: June 10, 2026</span>
              </div>

            </div>
          </div>
        )}

        </main>
      </div>

      {/* MOCK PAYMENT OVERLAY MODAL (GATEWAY) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d]/80 backdrop-blur-2xl max-w-md w-full p-8 border border-white/[0.06] rounded-3xl shadow-2xl flex flex-col gap-6 relative animate-in fade-in zoom-in duration-200 text-left">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mx-auto mb-4">
                <CreditCard className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-lg font-black font-outfit text-white uppercase tracking-wider mb-2">
                Premium Assessment Portal
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto font-sans">
                Unlock monthly or annual subscription matching options. Gain access to scanned resume matching and team sandbox assessments.
              </p>
            </div>

            {/* Toggle Plan */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-900 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`py-3 text-xs font-bold rounded-xl font-outfit transition-all cursor-pointer ${
                  selectedPlan === "monthly"
                    ? "bg-[#131924] text-white border border-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                Monthly ($19.99/mo)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlan("annual")}
                className={`py-3 text-xs font-bold rounded-xl font-outfit transition-all cursor-pointer ${
                  selectedPlan === "annual"
                    ? "bg-[#131924] text-white border border-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                Annual ($149.99/yr)
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1 font-sans">
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Stripe/Razorpay Mock Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-850 focus:border-fuchsia-500/50 rounded-xl text-xs text-white placeholder-slate-655 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-sans">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Expiration</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-855 focus:border-fuchsia-500/50 rounded-xl text-xs text-white placeholder-slate-655 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">CVC / CVV</label>
                  <input
                    type="password"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="•••"
                    className="w-full px-4 py-3 bg-slate-955 border border-slate-855 focus:border-fuchsia-500/50 rounded-xl text-xs text-white placeholder-slate-655 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={paymentProcessing}
                className="w-full mt-2 py-3 bg-fuchsia-600 hover:bg-fuchsia-750 text-white font-extrabold font-outfit text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                    Connecting secure sandbox gateway...
                  </>
                ) : (
                  <>
                    Pay Securely with Gateway
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              Secure 255-bit encrypted checkout
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
