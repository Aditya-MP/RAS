"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Loader2, Sparkles, UserCheck, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"candidate" | "employer">("candidate");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await signUp(email, password, fullName, role);
      setSuccess("Account registered successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative py-12 px-6 overflow-hidden bg-[#050814]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="grid-bg absolute inset-0 opacity-10 pointer-events-none" />

      {/* SignUp Card */}
      <div className="w-full max-w-md relative z-10 glass-card p-10 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="flex items-center gap-2 mb-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-black group-hover:scale-105 transition-transform font-outfit shadow-lg shadow-accent/25">
              R
            </div>
            <span className="font-extrabold font-outfit text-white tracking-tight text-xl">
              Redrob <span className="text-accent">Sandbox</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-outfit text-white">Create account</h1>
          <p className="text-sm text-slate-400">
            Join the ambient hiring revolution
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center leading-relaxed font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Segmented switcher for Role */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
              Account Type
            </label>
            <div className="grid grid-cols-2 p-1.5 bg-slate-950/50 border border-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole("candidate")}
                className={`py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === "candidate"
                    ? "bg-accent text-black shadow-md shadow-accent/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === "employer"
                    ? "bg-accent text-black shadow-md shadow-accent/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Employer
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-sm focus:shadow-[0_0_15px_rgba(132,204,22,0.1)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@lovelace.org"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-sm focus:shadow-[0_0_15px_rgba(132,204,22,0.1)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-sm focus:shadow-[0_0_15px_rgba(132,204,22,0.1)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 bg-accent hover:bg-accent-hover text-black font-extrabold font-outfit rounded-2xl transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <Sparkles className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-accent hover:underline font-semibold ml-1">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
