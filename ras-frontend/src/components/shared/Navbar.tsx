"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Menu, X, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/shared/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { token, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!profile) return "/";
    return profile.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-nav py-3 shadow-lg shadow-slate-950/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-xl shadow-md shadow-accent/5 group-hover:rotate-6 transition-transform duration-300">
            <Cpu className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            AI <span className="text-accent transition-colors duration-500">HireHub</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-slate-350 hover:text-white transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {token && profile ? (
            <div className="flex items-center gap-4">
              <Link
                href={getDashboardLink()}
                className="text-xs font-bold text-slate-950 px-4 py-2.5 bg-accent hover:bg-accent/90 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2.5 bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-rose-400 flex items-center gap-1.5"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-slate-350 hover:text-white transition-colors duration-200 px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-bold text-slate-950 px-5 py-2.5 bg-accent hover:bg-accent/90 rounded-full shadow-md shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] transition-all duration-300 flex items-center gap-1 group cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform duration-250" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-350 hover:text-white transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass border-t border-white/5 py-6 px-6 transition-all duration-300 transform origin-top ${
          isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-5">
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
          <div className="h-[1px] bg-white/5 my-2" />
          <div className="flex flex-col gap-3">
            {token && profile ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 font-bold text-slate-950 bg-accent hover:bg-accent/90 rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                  className="w-full py-2.5 text-slate-400 hover:text-rose-400 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-500/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-slate-300 hover:text-white py-2.5 font-medium rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 font-bold text-slate-950 bg-accent hover:bg-accent/90 rounded-full shadow-lg shadow-accent/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
