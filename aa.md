@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Outfit:wght@100..900&family=Inter:wght@100..900&display=swap');
@import "tailwindcss";
@theme {
  --color-primary: #6366F1;
  --color-secondary: #8B5CF6;
  --color-accent: #F43F5E;
  --color-accent: #84cc16;
  --color-highlight: #FCD34D;
  --color-success: #10B981;
  
  --color-bg-light: #F8FAFC;
  --color-bg-card: #FFFFFF;
  --color-border-light: #E2E8F0;
  --color-bg-light: #050814;
  --color-bg-card: #0A0F1D;
  --color-border-light: rgba(255, 255, 255, 0.08);
  
  --font-sans: 'Inter', sans-serif;
  --font-outfit: 'Outfit', sans-serif;
  --font-mono: 'Fira Code', monospace;
}
:root {
  --background: #F8FAFC;
  --foreground: #0F172A;
  --card: #FFFFFF;
  --border: #E2E8F0;
  --background: #050814;
  --foreground: #F8FAFC;
  --card: #0A0F1D;
  --border: rgba(255, 255, 255, 0.08);
  --primary: #6366F1;
  --secondary: #8B5CF6;
  --accent: #F43F5E;
  --accent: #84cc16;
  --highlight: #FCD34D;
  --success: #10B981;
}
body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  overflow-x: hidden;
}
/* Custom Scrollbars */
/* Custom Scrollbars for Dark Theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #F8FAFC;
  background: #050814;
}
::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 4px;
  background: #1E293B;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
  background: #334155;
}
/* Glassmorphism Classes for Light Mode */
/* Dark Mode Glassmorphism Classes */
.glass {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(10, 15, 29, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.glass-nav {
  background: rgba(248, 250, 252, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  background: rgba(5, 8, 20, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.glass-card {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(10, 15, 29, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.glass-card:hover {
  border-color: rgba(99, 102, 241, 0.25);
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.1);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15), 0 0 20px rgba(13, 148, 136, 0.05);
  transform: translateY(-5px);
}
/* Neumorphism Subtle Soft Depth */
/* Neumorphism/Sleek Tech Card */
.soft-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
  background: #0A0F1D;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
  transition: all 0.25s ease;
}
.soft-card:hover {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08);
  box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}
/* Neon Text Shadow Adaptations for Light Mode */
/* Neon Text Shadow Adaptations */
.neon-text-indigo {
  text-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
  text-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}
.neon-text-lime {
  text-shadow: 0 0 15px rgba(132, 204, 22, 0.45);
}
.neon-text-teal {
  text-shadow: 0 0 15px rgba(13, 148, 136, 0.4);
}
.neon-text-rose {
  text-shadow: 0 0 15px rgba(244, 63, 94, 0.15);
  text-shadow: 0 0 15px rgba(244, 63, 94, 0.4);
}
/* Background Grids */
/* Dark Cyber Background Grid */
.grid-bg {
  background-image: 
    linear-gradient(rgba(15, 23, 42, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.015) 1px, transparent 1px);
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}
"use client";
import React, { useState, useEffect } from "react";
import { Cpu, Menu, X, ArrowRight } from "lucide-react";
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
          ? "glass-nav py-3 shadow-sm shadow-slate-100"
          ? "glass-nav py-3 shadow-lg shadow-slate-950/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2.5 bg-gradient-to-tr from-primary via-secondary to-accent rounded-xl shadow-md shadow-primary/20 group-hover:rotate-6 transition-transform duration-300">
            <Cpu className="w-5 h-5 text-white" />
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-xl shadow-md shadow-accent/5 group-hover:rotate-6 transition-transform duration-300">
            <Cpu className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Redrob <span className="text-primary group-hover:text-accent transition-colors duration-300">Sandbox</span>
          <span className="text-xl font-bold font-outfit tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Redrob <span className="text-accent transition-colors duration-500">Sandbox</span>
          </span>
        </div>
        </Link>
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 relative group"
              className="text-sm font-medium text-slate-350 hover:text-white transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
              <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 px-4 py-2">
            Login
          </button>
          <button className="text-sm font-semibold text-white px-5 py-2.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl shadow-md shadow-primary/25 hover:shadow-accent/35 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] transition-all duration-300 flex items-center gap-1.5 group">
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-250" />
          </button>
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
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            className="p-2 text-slate-350 hover:text-white transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass border-t border-slate-100 py-6 px-6 transition-all duration-300 transform origin-top ${
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
              className="text-base font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
              className="text-base font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
          <div className="h-[1px] bg-slate-100 my-2" />
          <div className="h-[1px] bg-white/5 my-2" />
          <div className="flex flex-col gap-3">
            <button className="w-full text-center text-slate-600 hover:text-slate-900 py-2.5 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Login
            </button>
            <button className="w-full text-center py-2.5 font-semibold text-white bg-gradient-to-r from-primary via-secondary to-accent rounded-xl shadow-lg shadow-primary/20">
              Get Started
            </button>
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
hero.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { ArrowRight, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = [
    "Beyond the Resume.",
    "AI Collaboration Fluency.",
    "Real-world Chaos Resilience.",
    "System Debugging Integrity.",
  ];
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Typing animation effect
  // Auto-play fix for background video
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 30 : 70;
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText === currentWord) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
        } else {
          timer = setTimeout(handleTyping, typingSpeed);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          timer = setTimeout(handleTyping, 300);
        } else {
          timer = setTimeout(handleTyping, typingSpeed);
        }
      }
    };
    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);
  // 3D Rotating Sphere Visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let width = (canvas.width = 450);
    let height = (canvas.height = 450);
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }
    const points: Point3D[] = [];
    const numPoints = 80;
    const radius = 150;
    // Distribute points on a sphere using Fibonacci lattice
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * i) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      points.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
    if (bgVideoRef.current) {
      bgVideoRef.current.muted = true;
      bgVideoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
      });
    }
  }, []);
    let angleX = 0.003;
    let angleY = 0.003;
    // Mouse interactive rotation speed offset
    let targetSpeedX = 0.003;
    let targetSpeedY = 0.003;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - width / 2;
      const my = e.clientY - rect.top - height / 2;
      targetSpeedX = my * 0.00003;
      targetSpeedY = mx * 0.00003;
    };
    const handleMouseLeave = () => {
      targetSpeedX = 0.003;
      targetSpeedY = 0.003;
    };
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    const project = (point: Point3D) => {
      const distance = 300;
      const scale = distance / (distance + point.z);
      return {
        x: width / 2 + point.x * scale,
        y: height / 2 + point.y * scale,
        scale,
      };
    };
    const rotateX = (point: Point3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = point.y * cos - point.z * sin;
      const z = point.y * sin + point.z * cos;
      return { ...point, y, z };
    };
    const rotateY = (point: Point3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = point.x * cos + point.z * sin;
      const z = -point.x * sin + point.z * cos;
      return { ...point, x, z };
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Smoothly interpolate rotation speed
      angleX += (targetSpeedX - angleX) * 0.1;
      angleY += (targetSpeedY - angleY) * 0.1;
      // Rotate points
      for (let i = 0; i < points.length; i++) {
        points[i] = rotateY(rotateX(points[i], angleX), angleY);
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVideoOpen(false);
      }
      const projected = points.map(project);
      // Draw connections (slightly darker for light background visibility)
      ctx.strokeStyle = "rgba(99, 102, 241, 0.12)";
      ctx.lineWidth = 0.9;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.hypot(dx, dy);
          // Connect points close to each other in 3D
          const zDist = Math.abs(points[i].z - points[j].z);
          if (dist < 70 && zDist < 60) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw node points with depth coloring
      projected.forEach((p, idx) => {
        const pt = points[idx];
        const isFront = pt.z < 0;
        const color = isFront ? "#8B5CF6" : "#6366F1";
        const opacity = Math.max(0.25, (radius - pt.z) / (2 * radius));
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.scale * 2.2), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = isFront ? 6 : 0;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (canvas) canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/5 to-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="grid-bg absolute inset-0 opacity-40 z-0 pointer-events-none" />
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden bg-[#050814]">
      {/* Background Video aligned to the right half */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0 pointer-events-none select-none overflow-hidden">
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-75"
        >
          <source src="/Hero_Section_Background_Videos.mp4" type="video/mp4" />
        </video>
        {/* Horizontal Gradient Mask to blend video to the dark background on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050814] via-[#050814]/40 to-transparent z-10" />
        {/* Top/Bottom masks for smooth vertical integration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-transparent to-[#050814] z-10" />
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left Side Content */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-slate-200/50 shadow-sm animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs font-semibold text-slate-600 font-outfit uppercase tracking-wider">
              Ambient Collaboration Engine
            </span>
          </div>
      {/* Cyber Mesh Overlay */}
      <div className="grid-bg absolute inset-0 opacity-15 z-0 pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-outfit leading-[1.1] text-slate-900">
            Hire{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              {displayText}
            </span>
            <span className="text-primary animate-pulse">|</span>
          </h1>
      <div className="max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center items-start relative z-10 w-full">
        {/* Main Split Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8">
            {/* New Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full shadow-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-mono">
                Now: Multiplayer Sandboxes
              </span>
            </motion.div>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            Evaluate developer candidates in multiplayer, cloud-hosted sandboxes. Measure real-time human-AI orchestration, collaboration flow, and software engineering resilience.
          </p>
            {/* Title (matches Hera.ai styling with Serif Lime highlight) */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-outfit leading-[1.1] text-white tracking-tight"
            >
              Hire the right developer. <br />
              <span className="text-accent italic font-serif font-medium text-4xl sm:text-5xl md:text-6xl tracking-wide block mt-2">
                10x faster.
              </span>
            </motion.h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
            <button className="w-full sm:w-auto text-sm font-semibold text-white px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl shadow-lg shadow-primary/25 hover:shadow-accent/35 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="w-full sm:w-auto text-sm font-semibold text-slate-600 hover:text-slate-900 px-7 py-3.5 glass rounded-xl border border-slate-200/50 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2.5">
              <div className="p-1.5 bg-slate-100 rounded-lg">
                <Play className="w-3.5 h-3.5 text-slate-600 fill-slate-600" />
              </div>
              Watch Sandbox Demo
            </button>
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-sans"
            >
              Redrob Sandbox is the AI recruiter that screens, interviews, and shortlists candidates for your team—without the spreadsheet chaos or biased guesswork.
            </motion.p>
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto text-sm font-bold text-slate-950 px-8 py-4 bg-accent hover:bg-accent/90 rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-1.5 group cursor-pointer">
                Start hiring with Redrob
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="w-full sm:w-auto text-sm font-semibold text-slate-200 hover:text-white px-7 py-4 glass rounded-full border border-white/10 hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-slate-300 fill-slate-300 mr-1.5" />
                Watch 90-sec demo
              </button>
            </motion.div>
            {/* Badges / Security Checkmarks */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2 text-slate-400 text-xs font-semibold font-sans"
            >
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                SOC 2 Secured
              </span>
            </motion.div>
          </div>
        </div>
        {/* Right Side Rotating Sphere Globe */}
        <div className="lg:col-span-5 flex justify-center items-center relative select-none">
          <div className="relative p-2 glass rounded-full border border-slate-200/50 shadow-lg shadow-slate-100">
            <canvas ref={canvasRef} className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]" />
        {/* Brand/Trust Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 w-full pt-8 border-t border-white/5 relative z-10"
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4 font-mono">
            Trusted by talent teams at
          </span>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-sm font-semibold text-slate-400 font-sans">
            {["Northwind", "Acme Labs", "Lumen", "Helix", "Forma", "Vanta.io"].map((brand) => (
              <span key={brand} className="hover:text-slate-200 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
          {/* Decorative network nodes */}
          <div className="absolute top-[15%] right-[15%] p-3 glass border border-slate-200/50 rounded-2xl shadow-md animate-bounce-slow pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-mono text-slate-600">TCI: 0.96</span>
            </div>
          </div>
          <div className="absolute bottom-[20%] left-[10%] p-3 glass border border-slate-200/50 rounded-2xl shadow-md animate-pulse-slow pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-slate-600">git branch: main</span>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
      {/* Video Overlay Modal (Hera.ai Amber Glow style) */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setIsVideoOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Glowing Video Frame Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(220,80,0,0.55),_0_0_80px_rgba(220,80,0,0.25)] border border-orange-500/35"
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking the video
            >
              {/* Layered inner glow from CSS */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_30px_rgba(220,80,0,0.45)] z-10" />
              {/* Video Element */}
              <video
                src="/Hero_Section_Background_Videos.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
feature.tsx
"use client";
import React from "react";
import React, { useState, useRef } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
const featuresData = [
  {
    icon: Sparkles,
    iconColor: "text-secondary",
    iconColor: "text-accent",
    title: "AI Socratic Tech Lead",
    description:
      "A state-driven agent (ATL) that stalk-monitors candidate sessions and intervenes with Socratic hints, guiding logic without writing code.",
      "A state-driven agent (ATL) that monitors candidate sessions and intervenes with Socratic hints, guiding logic without writing code.",
    metric: "Powered by Gemini 2.5 Pro",
    colSpan: "lg:col-span-2",
  },
  {
    icon: TrendingUp,
    iconColor: "text-primary",
    title: "Multidimensional Scoring",
    description:
      "Compiles passing test ratios, AI collaboration fluency indices, KDA keystroke rhythms, and peer calibration into a percentile rank.",
    metric: "7 weighted vectors",
    colSpan: "lg:col-span-1",
  },
  {
    icon: AlertTriangle,
    iconColor: "text-accent",
    iconColor: "text-rose-500",
    title: "Real-world Chaos Injects",
    description:
      "Injects DB pool starvation, stale caches, deadlocks, and OOM terminations to test candidate adaptability under pressure.",
    metric: "10 cataloged failures",
    colSpan: "lg:col-span-1",
  },
  {
    icon: GitBranch,
    iconColor: "text-indigo-600",
    iconColor: "text-violet-400",
    title: "Architectural PageRank",
    description:
      "Parses AST import relationships to compute architectural influence. Rewards developers who build foundational dependencies.",
    metric: "PageRank influence graph",
    colSpan: "lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-success",
    iconColor: "text-emerald-400",
    title: "Hybrid Cascade Scan (HCD)",
    description:
      "Strips hidden visual & semantic prompt injections from candidate resumes, logging security bypass attempts for recruiters.",
    metric: "11 injection rules parsed",
    colSpan: "lg:col-span-2",
  },
  {
    icon: Activity,
    iconColor: "text-indigo-400",
    title: "Biometric Keystroke Dynamics",
    description:
      "Measures dwell times and release-to-press flight times. Classifies human composition vs. automated macro scripts.",
    metric: "1ms sampling resolution",
    colSpan: "lg:col-span-1",
  },
];
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};
function BentoCard({ feat }: { feat: typeof featuresData[0] }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
    const width = rect.width;
    const height = rect.height;
    const rotateY = ((x - width / 2) / (width / 2)) * 8; // Max 8 deg rotation
    const rotateX = -((y - height / 2) / (height / 2)) * 8; // Max 8 deg rotation
    setRotate({ x: rotateX, y: rotateY });
  };
  const IconComponent = feat.icon;
  const tiltTransform = isHovered
    ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
    : "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCoords({ x: 0, y: 0 });
        setRotate({ x: 0, y: 0 });
      }}
      variants={cardVariants}
      style={{
        transform: tiltTransform,
        transition: isHovered ? "none" : "transform 0.5s ease, y 0.5s ease",
      }}
      whileHover={{ y: -6 }}
      className={`glass-card p-8 rounded-3xl relative overflow-hidden group select-none cursor-pointer flex flex-col justify-between min-h-[300px] border border-white/5 ${feat.colSpan}`}
    >
      {/* Cursor Glow Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(132, 204, 22, 0.12), transparent 80%)`,
        }}
      />
      <div className="relative z-10">
        <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl w-fit mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10 shadow-lg shadow-black/20">
          <IconComponent className={`w-6 h-6 ${feat.iconColor}`} />
        </div>
        <h3 className="text-xl font-bold font-outfit text-white mb-3 group-hover:text-accent transition-colors duration-250">
          {feat.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed font-sans">
          {feat.description}
        </p>
      </div>
      <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-6 relative z-10">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Metrics Scope
        </span>
        <span className="text-xs font-semibold text-slate-350 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 shadow-md shadow-black/10">
          {feat.metric}
        </span>
      </div>
    </motion.div>
  );
}
export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-slate-50/50">
      {/* Background decoration */}
      <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
    <section id="features" className="py-28 relative overflow-hidden bg-[#050814]/40">
      {/* Ambient decoration */}
      <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest font-outfit px-3 py-1.5 glass rounded-full border border-slate-200/50">
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-semibold text-accent uppercase tracking-widest font-outfit px-3.5 py-1.5 glass rounded-full border border-white/5 shadow-lg shadow-black/20"
          >
            Engineered Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 tracking-tight">
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight"
          >
            Designed for the Future of Technical Hiring
          </h2>
          <p className="text-slate-600">
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 leading-relaxed font-sans"
          >
            A complete collaborative evaluation engine that replaces generic algorithm questions with actual, live engineering behavior.
          </p>
          </motion.p>
        </div>
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group select-none cursor-pointer flex flex-col justify-between"
              >
                {/* Glow overlay */}
                <div className="absolute -inset-px bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                <div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl w-fit mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-slate-100">
                    <IconComponent className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3 group-hover:text-primary transition-colors duration-200">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-650 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Metrics Scope
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/50">
                    {feat.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Features Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresData.map((feat, idx) => (
            <BentoCard key={idx} feat={feat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
CTA.tsx
"use client";
import React from "react";
import { ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";
export default function CTA() {
  return (
    <footer className="relative overflow-hidden pt-32 pb-16 bg-slate-50">
    <footer className="relative overflow-hidden pt-32 pb-16 bg-[#050814]">
      {/* Background glowing gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-r from-primary/5 via-secondary/10 to-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-r from-primary/5 via-secondary/15 to-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Banner Card */}
        <div className="glass p-12 sm:p-16 rounded-3xl border border-slate-200/50 relative overflow-hidden flex flex-col items-center text-center gap-8 shadow-xl shadow-slate-100">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="glass p-12 sm:p-16 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col items-center text-center gap-8 shadow-2xl shadow-black/40"
        >
          {/* Inner mesh decoration */}
          <div className="absolute inset-0 grid-bg opacity-[0.05] pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />
          <div className="absolute top-[10%] left-[10%] w-[120px] h-[120px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[15%] right-[10%] w-[120px] h-[120px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <span className="flex items-center gap-2 text-xs font-semibold text-accent bg-accent/5 border border-accent/15 px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono">
          <span className="flex items-center gap-2 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full uppercase tracking-widest font-mono">
            <Terminal className="w-3.5 h-3.5" />
            Integrity First Assessments
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-outfit text-slate-900 tracking-tight max-w-3xl leading-[1.15]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-outfit text-white tracking-tight max-w-3xl leading-[1.15]">
            Ready to Discover Your Next Engineering Star?
          </h2>
          <p className="text-slate-600 max-w-xl leading-relaxed">
          <p className="text-slate-450 max-w-xl leading-relaxed font-sans">
            Configure custom stack sandboxes, invite candidate cohorts, and receive fully calibrated collaboration assessments within 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
            <button className="w-full sm:w-auto text-sm font-semibold text-white px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl shadow-lg shadow-primary/25 hover:shadow-accent/35 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
            <button className="w-full sm:w-auto text-sm font-bold text-slate-950 px-8 py-4 bg-accent hover:bg-accent/90 rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
              Launch Sandbox Session
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="w-full sm:w-auto text-sm font-semibold text-slate-600 hover:text-slate-900 px-7 py-3.5 glass border border-slate-200/50 hover:bg-slate-100 rounded-xl transition-all duration-200">
            <button className="w-full sm:w-auto text-sm font-semibold text-slate-200 hover:text-white px-7 py-3.5 glass border border-white/10 hover:bg-white/5 rounded-full transition-all duration-200 cursor-pointer">
              Schedule Consultation
            </button>
          </div>
        </div>
        </motion.div>
        {/* Footer Links & Credits */}
        <div className="mt-32 pt-12 border-t border-slate-200/50 grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-500">
        <div className="mt-32 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-400">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-bold font-outfit text-slate-900">
              Redrob <span className="text-primary">Sandbox</span>
            <span className="text-lg font-bold font-outfit text-white">
              Redrob <span className="text-accent">Sandbox</span>
            </span>
            <p className="text-xs leading-relaxed max-w-xs text-slate-600">
            <p className="text-xs leading-relaxed max-w-xs text-slate-400 font-sans">
              Futuristic recruitment reimagined. The ambient platform that identifies hidden engineering talents through multiplayer developer sandboxes.
            </p>
          </div>
            },
          ].map((col, idx) => (
            <div key={idx} className="flex flex-col gap-4 select-none">
              <span className="text-sm font-bold text-slate-900 font-outfit">
              <span className="text-sm font-bold text-white font-outfit">
                {col.title}
              </span>
              <ul className="flex flex-col gap-2.5">
              <ul className="flex flex-col gap-2.5 font-sans">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-slate-500 hover:text-slate-900 transition-colors duration-150"
                      className="text-xs text-slate-400 hover:text-white transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-mono">
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
          <span>&copy; {new Date().getFullYear()} Redrob Sandbox Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
page.tsx
import React from "react";
import Navbar from "@/components/shared/Navbar";
import CanvasParticles from "@/components/shared/CanvasParticles";
import Hero from "@/components/shared/Hero";
import HiringPipeline from "@/components/shared/HiringPipeline";
import Features from "@/components/shared/Features";
import TelemetryTicker from "@/components/shared/TelemetryTicker";
import CTA from "@/components/shared/CTA";
export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg-dark text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
    <div className="relative min-h-screen bg-[#050814] text-slate-200 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Dynamic Background Network Particles */}
      <CanvasParticles />
      {/* Floating Header */}
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <Hero />
        {/* Features Section */}
        {/* Hiring Pipeline Section (How it Works) */}
        <HiringPipeline />
        {/* Features Bento Grid Section */}
        <Features />
        {/* Live Placement Telemetry Log Section */}
        <TelemetryTicker />
        {/* CTA & Footer Section */}
        <CTA />
      </main>
    </div>
  );
}
layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/shared/AuthContext";
export const metadata: Metadata = {
  title: "Redrob Sandbox – Futuristic Collaborative Technical Assessment Platform",
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-bg-light text-foreground">{children}</body>
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#050814] text-slate-100" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
telemetryticket.tsx
"use client";
import React from "react";
import { Terminal, Shield, Cpu, Activity } from "lucide-react";
const mockPlacements = [
  { role: "Senior Frontend Engineer", company: "Astro Labs", score: "98th", tci: "0.98", chaos: "95%" },
  { role: "DevOps Architect", company: "Vanta.io", score: "99th", tci: "0.99", chaos: "99%" },
  { role: "Django Backend Lead", company: "Acme Labs", score: "96th", tci: "0.96", chaos: "92%" },
  { role: "Fullstack JS Developer", company: "Lumen Corp", score: "95th", tci: "0.95", chaos: "94%" },
  { role: "Systems Engineer", company: "Helix Inc", score: "97th", tci: "0.97", chaos: "98%" },
  { role: "Site Reliability Specialist", company: "Forma Tech", score: "98th", tci: "0.98", chaos: "96%" },
  { role: "Python Core Developer", company: "Oryzo AI", score: "96th", tci: "0.96", chaos: "91%" },
];
export default function TelemetryTicker() {
  // Double the array for seamless infinite looping scroll
  const doubledPlacements = [...mockPlacements, ...mockPlacements, ...mockPlacements];
  return (
    <section className="py-24 relative bg-[#050814]/20 border-t border-white/5 overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-semibold text-accent uppercase tracking-widest font-outfit px-3.5 py-1.5 glass rounded-full border border-white/5 shadow-md">
            Telemetry Feed
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
            Live Candidate Placement Telemetry
          </h2>
          <p className="text-slate-400 leading-relaxed font-sans">
            Monitor real-time sandbox matches, collaboration scores (TCI), and chaos resilience index levels globally.
          </p>
        </div>
        {/* Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left stats panel */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-xl text-accent">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                    Verified Calibration
                  </h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Every sandbox calibration index is cryptographic-hash locked using telemetry verification standards.
                </p>
              </div>
              <div className="mt-12 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-outfit text-white">4,819</span>
                <span className="text-xs text-accent font-semibold">Matched Developers</span>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                    Compute Latency
                  </h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Serverless Monaco Sandbox execution instances compile and start up under gVisor in under 850ms.
                </p>
              </div>
              <div className="mt-12 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-outfit text-white">82ms</span>
                <span className="text-xs text-indigo-400 font-semibold">Avg Sandbox Exec</span>
              </div>
            </div>
          </div>
          {/* Right scrolling terminal */}
          <div className="lg:col-span-8">
            <div className="h-full bg-slate-950/70 border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
              {/* Terminal Window Header */}
              <div className="px-6 py-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  <Terminal className="w-3 h-3" />
                  redrob@sandbox:~ telemetry-logs
                </div>
                <div className="w-12" /> {/* spacer */}
              </div>
              {/* Scrolling Content viewport */}
              <div className="p-6 flex-1 h-[320px] relative overflow-hidden font-mono text-xs select-none">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none z-10" />
                {/* Inline CSS animation injection to make it self-contained */}
                <style>{`
                  @keyframes ticker-scroll {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-33.33%); }
                  }
                  .animate-ticker {
                    animation: ticker-scroll 25s linear infinite;
                  }
                  .animate-ticker:hover {
                    animation-play-state: paused;
                  }
                `}</style>
                {/* Log Line Ticker Container */}
                <div className="animate-ticker flex flex-col gap-3">
                  {doubledPlacements.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-4 bg-white/[0.01] border border-white/[0.03] rounded-xl hover:bg-white/[0.03] transition-colors gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <Activity className="w-3.5 h-3.5 text-accent animate-pulse shrink-0" />
                        <span className="text-slate-400">
                          <span className="text-accent font-semibold">{item.role}</span> matched at{" "}
                          <span className="text-white font-semibold">{item.company}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-500 shrink-0">
                        <span>Rank: <span className="text-yellow-400 font-bold">{item.score}</span></span>
                        <span>TCI: <span className="text-indigo-400 font-semibold">{item.tci}</span></span>
                        <span>Chaos Index: <span className="text-rose-400 font-semibold">{item.chaos}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
hiring pipeline.tsx
"use client";
import React from "react";
import { Upload, GitBranch, Terminal, LineChart } from "lucide-react";
import { motion } from "framer-motion";
const nodes = [
  {
    step: "01",
    icon: Upload,
    title: "Secure PDF Ingestion",
    description: "HCD stripping strips hidden visual/semantic prompt injections, outputting clean structured profile metadata.",
  },
  {
    step: "02",
    icon: GitBranch,
    title: "AST PageRank Scan",
    description: "Evaluates dependency architecture import links to quantify candidate framework and code organization design patterns.",
  },
  {
    step: "03",
    icon: Terminal,
    title: "Multiplayer Sandbox IDE",
    description: "Candidates solve real-world tickets collaboratively under state-driven AI Socratic Tech Lead steering.",
  },
  {
    step: "04",
    icon: LineChart,
    title: "Telemetry Ranking",
    description: "Calibrates biometric keystroke dynamics, AI collaboration fluency, and chaos resilience into final hiring index.",
  },
];
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};
const nodeVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};
export default function HiringPipeline() {
  return (
    <section className="py-28 relative overflow-hidden bg-[#050814]/10 border-t border-white/5">
      <div className="grid-bg absolute inset-0 opacity-[0.08] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-24">
          <span className="text-[10px] font-semibold text-accent uppercase tracking-widest font-outfit px-3.5 py-1.5 glass rounded-full border border-white/5">
            Functional Stream
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
            How The Redrob Evaluation Funnel Works
          </h2>
          <p className="text-slate-400 leading-relaxed font-sans">
            From resume upload to final placement: a fully automated, integrity-locked candidate mapping system.
          </p>
        </div>
        {/* Pipeline Graphic */}
        <div className="relative">
          {/* Connecting SVG Path Line for desktop layout */}
          <div className="absolute top-[60px] left-[10%] right-[10%] h-[2px] hidden lg:block z-0">
            <svg className="w-full h-full" fill="none">
              <motion.line
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="url(#lime-indigo-grad)"
                strokeWidth="2"
                strokeDasharray="8 6"
                initial={{ strokeDashoffset: 100 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <defs>
                <linearGradient id="lime-indigo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Node Grid Layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10"
          >
            {nodes.map((node, idx) => {
              const IconComponent = node.icon;
              return (
                <motion.div
                  key={idx}
                  variants={nodeVariants}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 group cursor-default"
                >
                  {/* Step Circular Node */}
                  <div className="relative flex items-center justify-center">
                    {/* Ring Pulse outer */}
                    <div className="absolute inset-[-6px] bg-accent/5 border border-accent/10 rounded-full scale-95 group-hover:scale-105 group-hover:bg-accent/10 transition-all duration-350 z-0" />
                    
                    {/* Main Circle */}
                    <div className="w-[110px] h-[110px] rounded-full bg-slate-900 border border-white/5 flex items-center justify-center relative z-10 shadow-xl group-hover:border-accent/40 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-slate-400 group-hover:text-accent group-hover:scale-110 transition-all duration-350" />
                      
                      {/* Step float label */}
                      <span className="absolute -top-1 -right-1 text-[10px] font-mono font-bold text-slate-950 bg-accent px-2 py-0.5 rounded-full shadow-md">
                        {node.step}
                      </span>
                    </div>
                  </div>
                  {/* Descriptions */}
                  <div className="flex flex-col gap-3 max-w-xs">
                    <h3 className="text-lg font-bold font-outfit text-white group-hover:text-accent transition-colors duration-200">
                      {node.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-sans">
                      {node.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
auth.ts
import { Router } from 'express';
import { supabaseClient, supabaseAdmin } from '../config/supabase';
import { requireAuth } from '../middleware/auth';
const router = Router();
  }
});
// -------------------- LIST CANDIDATES --------------------
router.get('/candidates', requireAuth, async (req, res) => {
  try {
    const { data: candidates, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('role', 'candidate');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ candidates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
authcontext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
interface UserProfile {
  id: string;
  email: string;
  role: "candidate" | "employer" | "admin";
  full_name: string;
}
interface AuthContextType {
  token: string | null;
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string, role: "candidate" | "employer") => Promise<any>;
  signOut: () => Promise<void>;
  apiFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Load auth info from localStorage on mount
    const storedToken = localStorage.getItem("ras_token");
    const storedUser = localStorage.getItem("ras_user");
    const storedProfile = localStorage.getItem("ras_profile");
    if (storedToken && storedUser && storedProfile) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setProfile(JSON.parse(storedProfile));
    }
    setIsLoading(false);
  }, []);
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }
      const tokenValue = data.session.access_token;
      const userValue = data.user;
      
      // Get the profile details
      const profileResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`
        }
      });
      const profileData = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error(profileData.error || "Failed to get user profile");
      }
      const profileValue = profileData.profile;
      setToken(tokenValue);
      setUser(userValue);
      setProfile(profileValue);
      localStorage.setItem("ras_token", tokenValue);
      localStorage.setItem("ras_user", JSON.stringify(userValue));
      localStorage.setItem("ras_profile", JSON.stringify(profileValue));
      if (profileValue.role === "employer") {
        router.push("/employer/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }
      return data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const signUp = async (email: string, password: string, fullName: string, role: "candidate" | "employer") => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };
  const signOut = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/signout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Signout API error:", error);
    } finally {
      setToken(null);
      setUser(null);
      setProfile(null);
      localStorage.removeItem("ras_token");
      localStorage.removeItem("ras_user");
      localStorage.removeItem("ras_profile");
      setIsLoading(false);
      router.push("/auth/signin");
    }
  };
  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      ...options,
      headers,
    });
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        apiFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
page.tsx

"use client";
import React, { useState } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import Link from "next/link";
import { Lock, Mail, Loader2, Sparkles } from "lucide-react";
export default function SignInPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative py-12 px-6 overflow-hidden bg-[#050814]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="grid-bg absolute inset-0 opacity-10 pointer-events-none" />
      {/* Login Card */}
      <div className="w-full max-w-md relative z-10 glass-card p-10 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="flex items-center gap-2 mb-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-black font-outfit shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="font-extrabold font-outfit text-white tracking-tight text-xl">
              Redrob <span className="text-accent">Sandbox</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-outfit text-white">Welcome back</h1>
          <p className="text-sm text-slate-400">
            Sign in to access your assessment workspace
          </p>
        </div>
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center leading-relaxed">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                placeholder="developer@company.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-sm focus:shadow-[0_0_15px_rgba(132,204,22,0.1)]"
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
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-sm focus:shadow-[0_0_15px_rgba(132,204,22,0.1)]"
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
                Access Assessment Chamber
                <Sparkles className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
        <div className="text-center text-xs text-slate-500">
          New to Redrob Sandbox?{" "}
          <Link href="/auth/signup" className="text-accent hover:underline font-semibold ml-1">
            Register Account
          </Link>
        </div>
      </div>
    </main>
  );
}
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
teams.ts

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../config/supabase';
import {
  create,
  getOne,
// POST /api/teams – create (employer only)
router.post('/', requireAuth, requireRole(['employer', 'admin']), create);
// GET /api/teams/my-teams – list teams for the logged-in candidate
router.get('/my-teams', requireAuth, async (req, res) => {
  try {
    const candidateId = req.user!.id;
    const { data: memberships, error } = await supabaseAdmin
      .from('team_members')
      .select(`
        team:teams(
          id,
          status,
          session_start,
          session_end,
          assessment:assessments(id, title, tech_track, seniority_level)
        )
      `)
      .eq('candidate_id', candidateId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    const teams = memberships ? memberships.map((m: any) => m.team).filter(Boolean) : [];
    res.json({ teams });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
// GET /api/teams/:id – get team details (any authenticated user)
router.get('/:id', requireAuth, getOne);
router.get('/assessment/:assessmentId', requireAuth, requireRole(['employer', 'admin']), listByAssessment);
export default router;
page tsx
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
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative z-10 w-full">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 border-r border-slate-800 bg-[#070b16]/65 p-4 flex flex-col gap-2 shrink-0 h-full overflow-y-auto">
          <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 hidden md:block">
            Main Menu
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
          <div className="mt-auto border-t border-slate-800 pt-4 flex flex-col gap-2 mb-10">
            <div className="px-3 py-2 bg-slate-950/40 rounded-xl border border-slate-850 text-left">
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">Database Engine</div>
              <div className="text-[9px] font-mono text-lime-450 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-ping shrink-0" />
                Supabase Connected
              </div>
            </div>
          </div>
        </aside>
        {/* MAIN VIEWPORT CONTAINER */}
        <div className="flex-1 overflow-hidden relative h-full">
          
          {/* TAB 1: HOME PANEL */}
          {activeTab === "home" && (
            <div className="h-full overflow-y-auto px-6 py-6 md:py-8 max-w-6xl mx-auto w-full flex flex-col gap-6 pb-20 scrollbar-thin">
            
            {/* Profile welcome */}
            <div className="bg-[#090d16]/80 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-fuchsia-500/30 transition-all duration-300">
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
              <div className="p-4 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-2 relative shadow-2xs hover:border-fuchsia-500/25 transition-all">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/15 flex items-center justify-center text-fuchsia-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Applied</div>
                <div className="text-xl font-black font-outfit text-white">{12 + appliedJobs.length}</div>
              </div>
              <div className="p-4 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-2 shadow-2xs hover:border-fuchsia-500/25 transition-all">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/15 flex items-center justify-center text-fuchsia-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Active Jobs</div>
                <div className="text-xl font-black font-outfit text-white">5</div>
              </div>
              <div className="p-4 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-2 shadow-2xs hover:border-fuchsia-500/25 transition-all">
                <div className="w-8 h-8 rounded-lg bg-lime-500/5 border border-lime-500/15 flex items-center justify-center text-lime-400">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Shortlisted</div>
                <div className="text-xl font-black font-outfit text-white">2</div>
              </div>
              <div className="p-4 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-2 shadow-2xs hover:border-fuchsia-500/25 transition-all">
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
              <div className="lg:col-span-7 bg-[#090d16]/90 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 shadow-sm text-left hover:border-fuchsia-500/30 transition-all">
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
                  <div className="min-h-[110px] flex items-center justify-center bg-[#090d16] border border-slate-800 rounded-xl">
                    <Loader2 className="w-5 h-5 animate-spin text-fuchsia-500" />
                  </div>
                ) : teams.length === 0 ? (
                  <div className="p-4 text-center bg-[#090d16] border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <p className="text-[9px] text-slate-500 font-sans">
                      No active workspace invitations. Verify UID in the Assessment tab.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {teams.slice(0, 2).map(team => (
                      <div key={team.id} className="p-3 bg-[#090d16] border border-slate-800 hover:border-fuchsia-500/30 rounded-xl flex items-center justify-between gap-3 transition-all">
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
                <div className="bg-[#090d16] border border-slate-800 p-3 rounded-xl flex flex-col gap-2 shadow-2xs text-left">
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
                  <div key={job.id} className="bg-[#090d16] border border-slate-800 hover:border-lime-500/30 p-4 rounded-xl flex flex-col justify-between min-h-[180px] transition-all shadow-sm group">
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
          <div className="h-full overflow-y-auto px-6 py-6 md:py-8 max-w-6xl mx-auto w-full flex flex-col gap-6 pb-20 scrollbar-thin">
            <div className="flex flex-col gap-1 text-left shrink-0">
              <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                Job Market Analytics & Timing Hotspots
              </h1>
              <p className="text-xs text-slate-400 leading-normal font-medium">
                Real-time engineering job demand tracking, timing advantages, and automated skill-gap analysis.
              </p>
            </div>
            {/* Line Graph block */}
            <div className="bg-[#090d16] border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col gap-4 text-left shrink-0 hover:border-lime-500/25 transition-all">
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
              <div className="md:col-span-6 p-5 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-3 text-left">
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
              <div className="md:col-span-6 p-5 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-3 text-left">
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
          <div className="h-full overflow-y-auto px-6 py-6 md:py-8 max-w-6xl mx-auto w-full flex flex-col gap-6 pb-20 scrollbar-thin">
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
                <div key={job.id} className="p-5 bg-[#090d16] border border-slate-800 hover:border-fuchsia-500/25 rounded-2xl flex flex-col justify-between min-h-[220px] transition-all relative group">
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
          <div className="h-full overflow-y-auto px-6 py-6 md:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 pb-20 scrollbar-thin">
            <button
              onClick={() => setActiveTab("jobs")}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 text-left font-bold cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-500" />
              Cancel Application
            </button>
            <div className="bg-[#090d16] border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col gap-5">
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
          <div className="h-full overflow-y-auto px-6 py-6 md:py-8 max-w-6xl mx-auto w-full flex flex-col gap-6 pb-20 scrollbar-thin">
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
                <div className="bg-[#090d16] border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col gap-3 text-left">
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
                <div className="bg-[#090d16] border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col gap-4 text-left">
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
              <div className="lg:col-span-12 bg-[#090d16] border border-slate-800 p-6 rounded-2xl shadow-sm text-left hover:border-fuchsia-500/20 transition-all flex flex-col gap-4 mt-2">
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
          <div className="h-full overflow-y-auto px-6 py-6 md:py-8 max-w-6xl mx-auto w-full flex flex-col gap-6 pb-20 scrollbar-thin">
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
              <div className="bg-[#090d16] border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col gap-3">
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
                
                <div className="p-5 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-3 text-left">
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
                <div className="p-5 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-3 text-left">
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
              <div className="bg-[#090d16] border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col gap-3">
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
          <div className="h-full overflow-y-auto px-6 py-6 md:py-8 max-w-6xl mx-auto w-full flex flex-col gap-6 pb-20 scrollbar-thin">
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
                <div className="p-5 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-3 font-sans shadow-xs">
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
              <div className="p-5 bg-[#090d16] border border-slate-800 rounded-xl flex flex-col gap-3 font-sans shadow-xs">
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
          <div className="h-full overflow-y-auto px-6 py-6 md:py-8 max-w-6xl mx-auto w-full flex flex-col gap-6 pb-20 scrollbar-thin">
            <div className="flex flex-col gap-1 text-left shrink-0">
              <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                Platform News & Job Market Releases
              </h1>
              <p className="text-xs text-slate-400 leading-normal font-sans font-medium">
                Stay updated on company layoffs, mass recruitment programs, and upcoming sandbox challenges.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
              
              <div className="p-5 bg-[#090d16] border border-slate-800 hover:border-fuchsia-500/25 rounded-2xl flex flex-col gap-2 relative transition-colors text-left font-sans shadow-xs">
                <div className="text-[8px] font-mono font-bold text-fuchsia-400 uppercase tracking-widest">Hiring Campaign</div>
                <h3 className="text-xs font-bold text-white font-outfit leading-snug">
                  Redrob Corp Announces 500+ Position Campaign for Q3 Agentic Pipelines
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Hiring managers are launching fresh assessment pools looking for junior to senior-level candidates. Scored sandboxes will bypass manual screening phases automatically.
                </p>
                <span className="text-[8px] font-mono text-slate-550 mt-1">Published: 2 days ago</span>
              </div>
              <div className="p-5 bg-[#090d16] border border-slate-800 hover:border-fuchsia-500/25 rounded-2xl flex flex-col gap-2 relative transition-colors text-left font-sans shadow-xs">
                <div className="text-[8px] font-mono font-bold text-rose-400 uppercase tracking-widest">Industry Shift</div>
                <h3 className="text-xs font-bold text-white font-outfit leading-snug">
                  Mass Layoffs Cool Down in Major Systems Labs as AI Integrations Stabilize
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Industry reports indicate systems engineers are shifting core expertise from simple code writing to high-frequency WebSocket and API workflow design.
                </p>
                <span className="text-[8px] font-mono text-slate-550 mt-1">Published: 1 week ago</span>
              </div>
              <div className="p-5 bg-[#090d16] border border-slate-800 hover:border-fuchsia-500/25 rounded-2xl flex flex-col gap-2 relative transition-colors text-left font-sans shadow-xs">
                <div className="text-[8px] font-mono font-bold text-fuchsia-400 uppercase tracking-widest">Telemetry Release</div>
                <h3 className="text-xs font-bold text-white font-outfit leading-snug">
                  Ambient Sandbox Engine Deploys Keystroke Dynamics to Block AI Impersonation
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Next-generation platforms are incorporating flight and dwell timing analytics to verify candidate authenticity while matching candidates to high-quality project cohorts.
                </p>
                <span className="text-[8px] font-mono text-slate-550 mt-1">Published: June 15, 2026</span>
              </div>
              <div className="p-5 bg-[#090d16] border border-slate-800 hover:border-fuchsia-500/25 rounded-2xl flex flex-col gap-2 relative transition-colors text-left font-sans shadow-xs">
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
        </div>
      </div>
      {/* MOCK PAYMENT OVERLAY MODAL (GATEWAY) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d16] max-w-md w-full p-8 border border-slate-800 rounded-3xl shadow-2xl flex flex-col gap-6 relative animate-in fade-in zoom-in duration-200 text-left">
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
pages.tsx
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
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  Home,
  TrendingUp,
  Briefcase,
  Shield,
  User,
  Award,
  FileText,
  AlertTriangle,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  Loader2,
  Terminal,
  LogOut,
  FolderOpen,
  Award
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
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [uidInput, setUidInput] = useState("");
  const [uidError, setUidError] = useState<string | null>(null);
  const [verifyingUid, setVerifyingUid] = useState(false);
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
        // Don't set Content-Type header so the browser sets it automatically with multipart boundaries
        headers: {},
        headers: {}, // Let browser set boundary
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload resume");
        throw new Error(data.error || "Failed to parse resume");
      }
      if (data.resume.has_injection) {
        setUploadStatus({
          success: true,
          hasInjection: true,
          message: "Prompt injection attempt detected inside PDF! Malicious commands stripped automatically. Scored report will flag security integrity metrics.",
          message: "Prompt injection payloads stripped from PDF! The Hybrid Cascade Detector (HCD) neutralized scripting logs. Scored metrics will flag security integrity logs."
        });
      } else {
        setUploadStatus({
          success: true,
          hasInjection: false,
          message: "Resume processed successfully! Semantic credentials scanned and synced with scoring engines.",
          message: "Resume processed successfully! Semantic credentials scanned and synchronized with matching models."
        });
      }
      if (selectedJobToApply) {
        const updated = [...appliedJobs, selectedJobToApply.id];
        setAppliedJobs(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("ras_applied_jobs", JSON.stringify(updated));
        }
        // Add team invitation simulation after successful apply!
        setTimeout(() => {
          setNotifications(prev => [
            {
              id: `notif-${Date.now()}`,
              text: `Team sandbox formed for ${selectedJobToApply.title}! Recruiter assigned Test UID: ${teams[0]?.id || "d9777164-52eb-4fd2-a5e0-252e31930558"}. Join now.`,
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
        message: err.message || "Resume upload failed. Please try again.",
        message: err.message || "Resume upload failed. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };
  // Join Team by ID code
  const handleJoinTeam = async (e: React.FormEvent) => {
  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setSavingProfile(true);
    setProfileSyncStatus(null);
    setJoining(true);
    setJoinError(null);
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
      setProfileSyncStatus("Profile metadata successfully synced with scoring models.");
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
      const res = await apiFetch(`/api/teams/${joinCode.trim()}`);
      const res = await apiFetch(`/api/teams/${uidInput.trim()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Team chamber not found or unauthorized");
        throw new Error(data.error || "Sandbox chamber not found or unauthorized ID.");
      }
      // Check if user is in members list
      const isMember = data.team.members.some(
        (m: any) => m.candidate?.id === profile?.id
      );
      if (!isMember) {
        throw new Error("You are not registered in this assessment sandbox team. Contact your employer.");
      }
      router.push(`/candidate/workspace/${data.team.id}`);
      setUidError(null);
      // Auto success - unlock checkboxes
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
      setJoinError(err.message || "Failed to enter sandbox");
      setUidError(err.message || "UID verification failed.");
    } finally {
      setJoining(false);
      setVerifyingUid(false);
    }
  };
  const handleStartTest = () => {
    if (!uidInput.trim() || !proceedChecked) return;
    router.push(`/candidate/workspace/${uidInput.trim()}`);
  };
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }
  // Active stats counts
  const statCompletedTests = teams.filter(t => t.status === "completed").length;
  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative">
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative font-sans">
      <div className="grid-bg absolute inset-0 opacity-5 pointer-events-none z-0" />
      
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10 flex items-center justify-between">
      {/* HEADER BAR */}
      <header className="px-6 py-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-black font-outfit text-sm">
            R
          </div>
          <span className="font-extrabold font-outfit text-white text-base">
            Redrob <span className="text-accent">Sandbox</span>
          </span>
          <span className="text-[9px] font-mono font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest ml-2">
            Candidate Deck
          <span className="text-[9px] font-mono font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest ml-2 hidden sm:inline-block">
            Developer Console
          </span>
        </div>
        <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          {/* Premium status badge */}
          {isPremium ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Premium Access</span>
            </div>
          ) : (
            <button
              onClick={() => { setSelectedPlan("monthly"); setShowPaymentModal(true); }}
              className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-[10px] font-bold text-slate-300 cursor-pointer"
            >
              <CreditCard className="w-3 h-3 text-accent" />
              <span>Upgrade to Premium</span>
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent font-mono">
              {profile.full_name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left">
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none">{profile.full_name}</span>
              <span className="text-[10px] font-mono text-slate-400 mt-1">{profile.email}</span>
              <span className="text-[9px] font-mono text-slate-400 mt-1">{profile.email}</span>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* DASHBOARD GRID CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        
        {/* Left Side: Upload & Join Code */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Resume Upload Box */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold font-outfit text-white mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Resume Scan (HCD)
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Upload your resume PDF. The Hybrid Cascade Detector extracts engineering skills while stripping prompt-injection payloads.
              </p>
            </div>
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 border-r border-white/5 bg-slate-950/20 p-4 flex flex-col gap-2 shrink-0">
          <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 hidden md:block">
            Main Menu
          </div>
            <form onSubmit={handleResumeUpload} className="flex flex-col gap-4">
              <div className="border border-dashed border-white/10 hover:border-accent/40 bg-slate-950/40 rounded-2xl p-6 transition-all flex flex-col items-center justify-center cursor-pointer text-center relative group">
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-accent transition-colors mb-3" />
                <span className="text-xs font-bold text-slate-300">
                  {resumeFile ? resumeFile.name : "Drag & drop PDF here"}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  PDF maximum size 5MB
                </span>
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard Home</span>
          </button>
          <button
            onClick={() => setActiveTab("analysis")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "analysis"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Market Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "jobs" || activeTab === "jobs-upload"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Find Jobs</span>
          </button>
          <button
            onClick={() => setActiveTab("assessment")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "assessment"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Assessment Center</span>
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "results"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Career Results</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "news"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>News Hub</span>
          </button>
          <div className="mt-auto border-t border-white/5 pt-4 flex flex-col gap-2">
            <div className="px-3 py-2 bg-slate-900/40 rounded-xl border border-white/5 text-left">
              <div className="text-[10px] font-bold text-slate-400">Database Engine</div>
              <div className="text-[9px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Supabase Connected
              </div>
            </div>
          </div>
        </aside>
              {resumeFile && (
        {/* MAIN TAB SPACE */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full text-left">
          
          {/* TAB 1: HOME PANEL */}
          {activeTab === "home" && (
            <div className="flex flex-col gap-8">
              
              {/* Profile welcome */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl md:text-2xl font-black font-outfit text-white tracking-tight">
                    Welcome back, <span className="text-accent">{profile.full_name}</span>
                  </h1>
                  <p className="text-xs text-slate-400 leading-normal max-w-lg font-sans">
                    Your candidate portal is connected to active assessment workflows. Scanned resumes match semantic hiring channels directly.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-accent hover:bg-accent-hover text-black font-bold font-outfit rounded-xl transition-all shadow-md shadow-accent/10 hover:shadow-accent/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  onClick={() => setActiveTab("profile")}
                  className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold font-outfit text-white transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scanning Payload...
                    </>
                  Edit Profile
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-accent/5 border border-accent/15 flex items-center justify-center text-accent">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Applications</div>
                  <div className="text-2xl font-black font-outfit text-white">{12 + appliedJobs.length}</div>
                </div>
                <div className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Active Jobs</div>
                  <div className="text-2xl font-black font-outfit text-white">5</div>
                </div>
                <div className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/5 border border-amber-500/15 flex items-center justify-center text-amber-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Shortlists</div>
                  <div className="text-2xl font-black font-outfit text-white">2</div>
                </div>
                <div className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Completed Tests</div>
                  <div className="text-2xl font-black font-outfit text-white">{statCompletedTests}</div>
                </div>
              </div>
              {/* Grid content: Assessments + Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Active Assessments */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black font-outfit text-white uppercase tracking-wider">
                      Your Active Assessments
                    </h2>
                    <button onClick={fetchTeams} className="text-[10px] font-mono font-bold text-accent hover:underline flex items-center gap-1">
                      Refresh logs
                    </button>
                  </div>
                  {loadingTeams ? (
                    <div className="min-h-[200px] flex items-center justify-center glass-card rounded-2xl">
                      <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    </div>
                  ) : teams.length === 0 ? (
                    <div className="p-8 text-center glass-card rounded-2xl flex flex-col items-center justify-center gap-3">
                      <Shield className="w-6 h-6 text-slate-600" />
                      <p className="text-xs text-slate-500 font-sans">
                        No team sandbox invitations currently. Verify a workspace UID in the Assessment Center tab.
                      </p>
                    </div>
                  ) : (
                    <>
                      Verify and Upload Resume
                      <ArrowRight className="w-4 h-4" />
                    </>
                    <div className="flex flex-col gap-4">
                      {teams.map(team => (
                        <div key={team.id} className="p-5 bg-[#0A0F1D]/60 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
                          <div className="flex flex-col gap-1.5 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 capitalize">
                                {team.assessment?.tech_track}
                              </span>
                              <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest ${
                                team.status === "active" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 animate-pulse" :
                                team.status === "completed" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              }`}>
                                {team.status}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-white font-outfit mt-0.5">
                              {team.assessment?.title}
                            </h3>
                            <div className="text-[10px] text-slate-500 font-mono">
                              UID: {team.id}
                            </div>
                          </div>
                          <div className="shrink-0">
                            {team.status === "active" ? (
                              <Link
                                href={`/candidate/workspace/${team.id}`}
                                className="py-2 px-3.5 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                              >
                                Enter Workspace
                                <Play className="w-3 h-3 fill-black text-black" />
                              </Link>
                            ) : team.status === "completed" ? (
                              <div className="flex gap-2">
                                <Link
                                  href={`/candidate/workspace/${team.id}/review`}
                                  className="py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold font-outfit text-[10px] rounded-lg transition-all cursor-pointer"
                                >
                                  Peer Review
                                </Link>
                                <Link
                                  href={`/candidate/reports/${profile.id}`}
                                  className="py-1.5 px-3 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-[10px] rounded-lg transition-all cursor-pointer"
                                >
                                  Scorecard
                                </Link>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setUidInput(team.id); setActiveTab("assessment"); }}
                                className="py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold font-outfit text-[10px] rounded-lg transition-all cursor-pointer"
                              >
                                Enter UID in Assessment
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              )}
            </form>
                </div>
            {uploadStatus && (
              <div
                className={`p-4 border rounded-xl flex items-start gap-3 text-xs leading-relaxed ${
                  !uploadStatus.success
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    : uploadStatus.hasInjection
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}
              >
                {!uploadStatus.success ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : uploadStatus.hasInjection ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400 animate-pulse" />
                ) : (
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                )}
                <span>{uploadStatus.message}</span>
                {/* Right: Notifications Feed */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <h2 className="text-sm font-black font-outfit text-white uppercase tracking-wider text-left">
                    System Alerts & Inbox
                  </h2>
                  <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col gap-4">
                    {notifications.map(n => (
                      <div key={n.id} className="text-left pb-3 border-b border-white/5 last:border-b-0 last:pb-0 flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {n.type === "alert" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          ) : n.type === "success" ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Bell className="w-3.5 h-3.5 text-indigo-400" />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] text-slate-300 font-medium font-sans leading-relaxed">
                            {n.text}
                          </p>
                          <span className="text-[9px] font-mono text-slate-500">{n.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Quick Join Team */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold font-outfit text-white mb-2 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent" />
                Enter Sandbox
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Assigned an assessment ID? Enter the workspace code below to connect to your live collaboration room.
              </p>
            </div>
          )}
            <form onSubmit={handleJoinTeam} className="flex flex-col gap-4">
              <input
                type="text"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter Team UUID..."
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all font-mono text-xs focus:shadow-[0_0_12px_rgba(132,204,22,0.1)]"
              />
          {/* TAB 2: MARKET ANALYTICS */}
          {activeTab === "analysis" && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                  Job Market Analytics & Timing Hotspots
                </h1>
                <p className="text-xs text-slate-400 leading-normal">
                  Real-time engineering job demand tracking, timing advantages, and automated skill-gap analysis.
                </p>
              </div>
              {/* Line Graph block (SVG Custom-built) */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">Engineering Job Demand Trend (2025 - 2026)</h3>
                    <p className="text-[10px] text-slate-500">Aggregate volume of recruitment searches in agentic fullstack layers</p>
                  </div>
                  <div className="text-[10px] font-mono font-bold bg-accent/15 border border-accent/20 px-2 py-0.5 rounded text-accent uppercase">
                    Hiring Surge Predicted
                  </div>
                </div>
                {/* SVG Graph */}
                <div className="w-full h-48 mt-4 relative">
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#84cc16" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                    {/* Area fill */}
                    <path
                      d="M 0,200 L 0,160 Q 120,130 200,90 T 400,60 Q 500,70 600,30 L 600,200 Z"
                      fill="url(#chartGrad)"
                    />
                    {/* Line path */}
                    <path
                      d="M 0,160 Q 120,130 200,90 T 400,60 Q 500,70 600,30"
                      fill="none"
                      stroke="#84cc16"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Dots */}
                    <circle cx="200" cy="90" r="4.5" fill="#84cc16" stroke="#050814" strokeWidth="1.5" />
                    <circle cx="400" cy="60" r="4.5" fill="#84cc16" stroke="#050814" strokeWidth="1.5" />
                    <circle cx="600" cy="30" r="5" fill="#84cc16" stroke="#050814" strokeWidth="1.5" className="animate-ping" />
                  </svg>
                  
                  {/* Tooltip Simulation */}
                  <div className="absolute top-[20px] right-[20px] bg-slate-950/80 border border-white/10 p-2.5 rounded-lg text-left backdrop-blur pointer-events-none">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Current Month (June 2026)</span>
                    <div className="text-xs font-black text-white font-outfit mt-0.5">Peak Volume: +42% YoY</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-white/5 pt-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500">Q3 2025</span>
                    <div className="text-xs font-bold text-slate-300 mt-0.5">Stable</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500">Q4 2025</span>
                    <div className="text-xs font-bold text-slate-300 mt-0.5">Moderate</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500">Q1 2026</span>
                    <div className="text-xs font-bold text-slate-300 mt-0.5">Growth</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500">Q2 2026 (Now)</span>
                    <div className="text-xs font-bold text-accent mt-0.5">Peak Surge</div>
                  </div>
                </div>
              </div>
              {/* Timing, heatmap and company insights */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Hot skills heatmap list */}
                <div className="md:col-span-6 p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-4 text-left">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-accent" />
                    Demand Heatmap by Tech Skill
                  </h3>
                  
                  <div className="flex flex-col gap-3.5 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-slate-300">AI Agents & System Architecture</span>
                        <span className="font-mono text-accent font-bold">98% volume</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "98%" }} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-slate-300">Next.js & Serverless UI</span>
                        <span className="font-mono text-accent font-bold">88% volume</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "88%" }} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-slate-300">WebSocket / Telemetry Systems</span>
                        <span className="font-mono text-accent font-bold">75% volume</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "75%" }} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-slate-300">WebGL & Canvas Graphics</span>
                        <span className="font-mono text-accent font-bold">62% volume</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "62%" }} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Timing Advantage Analysis */}
                <div className="md:col-span-6 p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-3 text-left">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-accent" />
                    Hiring Timing Hotspots
                  </h3>
                  
                  <div className="p-4 bg-accent/5 border border-accent/15 rounded-xl text-xs leading-relaxed text-slate-300 mt-2">
                    <span className="font-extrabold text-white block mb-1">Timing Hotspot Alert: Q3 Surge</span>
                    Historical statistics show candidates submitting applications in Q3 (July - August) experience a **3.4x higher rate** of team sandboxing. Corporate hiring teams allocate fresh assessment pools during this cycle. 
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Recruitment Insights</h4>
                    <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
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
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                  Personalized Job Listings
                </h1>
                <p className="text-xs text-slate-400 leading-normal font-sans">
                  Active roles compiled based on matching parameters. Standard applications require a premium gateway validation.
                </p>
              </div>
              {/* Job listings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map(job => (
                  <div key={job.id} className="p-6 bg-slate-900/40 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col justify-between min-h-[250px] transition-all relative group">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1 text-left">
                          <h3 className="text-sm font-black font-outfit text-white group-hover:text-accent transition-colors">
                            {job.title}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400">{job.company}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-mono font-bold text-accent bg-accent/15 border border-accent/20 px-2 py-0.5 rounded">
                            {job.match}% match
                          </span>
                          {appliedJobs.includes(job.id) && (
                            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              Applied
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {job.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-mono font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 leading-normal font-sans text-left mt-2">
                        {job.description}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{job.location}</span>
                      </div>
                      {appliedJobs.includes(job.id) ? (
                        <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1 font-sans">
                          <Check className="w-3.5 h-3.5" />
                          Reviewing Status
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJobApplyClick(job)}
                          className="py-2 px-3.5 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-xs rounded-xl shadow-lg shadow-accent/10 transition-all cursor-pointer flex items-center gap-1"
                        >
                          Apply Position
                          <ArrowRight className="w-3.5 h-3.5" />
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
            <div className="flex flex-col gap-6">
              <button
                type="submit"
                disabled={joining}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold font-outfit rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={() => setActiveTab("jobs")}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 text-left font-bold"
              >
                {joining ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Enter Workspace
                    <Play className="w-3.5 h-3.5" />
                  </>
                )}
                <X className="w-4 h-4" />
                Cancel Application
              </button>
            </form>
            {joinError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                <span>{joinError}</span>
              </div>
            )}
          </div>
        </div>
              <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-6">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-accent uppercase">
                    Step 2: Resume Scanning
                  </span>
                  <h2 className="text-lg font-bold font-outfit text-white mt-3 mb-1">
                    Apply to: {selectedJobToApply.title} ({selectedJobToApply.company})
                  </h2>
                  <p className="text-xs text-slate-400 leading-normal max-w-xl">
                    Our Hybrid Cascade Detector (HCD) parses skills while scanning the document structures to intercept malicious exploit injections. Select an authentic PDF resume format.
                  </p>
                </div>
        {/* Right Side: Active Assessments */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2.5">
              <FolderOpen className="w-5.5 h-5.5 text-accent" />
              Assigned Assessments
            </h2>
            <button
              onClick={fetchTeams}
              className="text-xs font-bold font-mono text-accent hover:underline flex items-center gap-1.5"
            >
              Refresh Logs
            </button>
          </div>
                <form onSubmit={handleResumeUpload} className="flex flex-col gap-4 max-w-md">
                  <div className="border border-dashed border-white/10 hover:border-accent/40 bg-slate-950/40 rounded-2xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer text-center relative group">
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileText className="w-10 h-10 text-slate-500 group-hover:text-accent transition-colors mb-3" />
                    <span className="text-xs font-bold text-slate-300">
                      {resumeFile ? resumeFile.name : "Select or drag PDF resume here"}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1">
                      PDF formats only (Max size 5MB)
                    </span>
                  </div>
          {loadingTeams ? (
            <div className="flex-1 min-h-[400px] flex items-center justify-center glass-card rounded-3xl border border-white/5">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : teams.length === 0 ? (
            <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass-card rounded-3xl border border-white/5 gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                <FolderOpen className="w-6 h-6" />
                  {resumeFile && (
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full py-3 bg-accent hover:bg-accent-hover text-black font-bold font-outfit rounded-xl transition-all shadow-md shadow-accent/10 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Neutralizing payloads...
                        </>
                      ) : (
                        <>
                          Upload and Submit Application
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </form>
                {uploadStatus && (
                  <div className="max-w-md">
                    <div
                      className={`p-4 border rounded-xl flex items-start gap-3 text-xs leading-relaxed ${
                        !uploadStatus.success
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          : uploadStatus.hasInjection
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {!uploadStatus.success ? (
                        <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-rose-400" />
                      ) : uploadStatus.hasInjection ? (
                        <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-400 animate-pulse" />
                      ) : (
                        <CheckCircle className="w-4.5 h-4.5 shrink-0 text-emerald-400" />
                      )}
                      <div className="flex flex-col gap-1 text-left">
                        <span className="font-extrabold uppercase text-[10px] tracking-wider font-mono">
                          {!uploadStatus.success ? "Scan Error" : uploadStatus.hasInjection ? "HCD Payload Strip alert" : "Credentials Verified"}
                        </span>
                        <span>{uploadStatus.message}</span>
                      </div>
                    </div>
                    {uploadStatus.success && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => { setActiveTab("jobs"); setSelectedJobToApply(null); }}
                          className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold font-outfit text-xs rounded-xl cursor-pointer"
                        >
                          Back to Jobs List
                        </button>
                        <button
                          onClick={() => setActiveTab("home")}
                          className="py-2.5 px-4 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-xs rounded-xl cursor-pointer"
                        >
                          View Dashboard Home
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-md font-bold text-white mb-1">No Assessments Found</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  You are not currently registered in any active assessment team. Enter a team sandbox ID or contact your recruiter.
            </div>
          )}
          {/* TAB 4: ASSESSMENT CENTER */}
          {activeTab === "assessment" && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                  Assessment Entry Chamber
                </h1>
                <p className="text-xs text-slate-400 leading-normal font-sans">
                  Register assessment IDs, read instructions checklist, and proceed directly to collaborative sandbox IDEs.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-6 rounded-3xl border border-white/5 shadow-lg flex flex-col justify-between min-h-[220px] hover:border-white/15 transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-slate-900 border border-white/5 text-slate-400 capitalize">
                        {item.assessment?.tech_track}
                      </span>
                      <span
                        className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          item.status === "active"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 animate-pulse"
                            : item.status === "completed"
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Form: Enter UID */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4 text-left">
                    <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-accent" />
                      Verify Sandbox UID
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-sans">
                      Recruiters generate assessment UIDs upon forming sandbox teams. Enter or paste your registered workspace UID below.
                    </p>
                    {/* Quick fill section if candidate has assigned team */}
                    {teams.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">My Active Assessment IDs</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {teams.map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setUidInput(t.id)}
                              className="text-[9px] font-mono px-2.5 py-1 bg-[#0A0F1D] hover:bg-slate-900 border border-white/5 rounded text-accent hover:text-accent-hover transition-colors font-bold"
                            >
                              {t.assessment?.title} ({t.id.substring(0,8)}...)
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleVerifyUid} className="flex flex-col gap-3.5 mt-1">
                      <input
                        type="text"
                        required
                        value={uidInput}
                        onChange={(e) => setUidInput(e.target.value)}
                        placeholder="Enter 36-char Team UUID..."
                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all font-mono text-[11px]"
                      />
                      <button
                        type="submit"
                        disabled={verifyingUid}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold font-outfit text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {item.status}
                      </span>
                        {verifyingUid ? (
                          <Loader2 className="w-4.5 h-4.5 animate-spin text-accent" />
                        ) : (
                          "Verify Registration"
                        )}
                      </button>
                    </form>
                    {uidError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{uidError}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Right Area: Instructions Checklist */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-5 text-left">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Instructions, Dos & Don'ts Checklist
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl text-left">
                        <span className="font-extrabold text-emerald-400 text-xs font-outfit uppercase tracking-wider block mb-2 font-sans">Chamber Dos</span>
                        <ul className="text-[11px] text-slate-400 space-y-2 list-inside list-disc font-sans">
                          <li>Communicate with teammates inside the chat pane.</li>
                          <li>Explain architectural patterns clearly in dialogue feeds.</li>
                          <li>Run code execution cycles frequently to verify snapshots.</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-rose-500/[0.02] border border-rose-500/10 rounded-xl text-left">
                        <span className="font-extrabold text-rose-400 text-xs font-outfit uppercase tracking-wider block mb-2 font-sans">Chamber Don'ts</span>
                        <ul className="text-[11px] text-slate-400 space-y-2 list-inside list-disc font-sans">
                          <li>Avoid external copy-paste cycles. (Paste telemetry matches hashes).</li>
                          <li>Avoid tab blur cycles. External window blurs trigger logs.</li>
                          <li>Bypassing scoring constraints fails grading criteria.</li>
                        </ul>
                      </div>
                    </div>
                    <h3 className="text-md font-bold text-white group-hover:text-accent transition-colors font-outfit mt-1">
                      {item.assessment?.title}
                    <div className="border-t border-white/5 pt-4 flex flex-col gap-4">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={proceedChecked}
                          onChange={(e) => setProceedChecked(e.target.checked)}
                          className="mt-0.5 rounded border-white/10 bg-slate-950 focus:ring-accent text-accent cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-400 leading-normal font-sans">
                          I agree to enable keyboard biometrics tracking (keystroke flight & dwell durations), window focus monitors, and Socratic assistant logging.
                        </span>
                      </label>
                      <button
                        onClick={handleStartTest}
                        disabled={!uidInput.trim() || !proceedChecked}
                        className="py-3 bg-accent hover:bg-accent-hover disabled:bg-slate-800 disabled:text-slate-600 disabled:opacity-50 text-black font-extrabold font-outfit text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-accent/5 hover:shadow-accent/15"
                      >
                        Start Test / Proceed to IDE
                        <Play className="w-3.5 h-3.5 fill-black text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* TAB 5: PROFILE PAGE */}
          {activeTab === "profile" && (
            <div className="flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                  Qualifications & Resume Profile
                </h1>
                <p className="text-xs text-slate-400 leading-normal font-sans">
                  Keep details synchronized to calibrate matching engines and assessment difficulties automatically.
                </p>
              </div>
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 font-sans">
                
                {/* Personal fields */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Contact Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600 focus:shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Location / Region</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="San Francisco, CA"
                        className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                {/* Education and Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="p-6 bg-[#0A0F1D]/60 border border-white/5 rounded-2xl flex flex-col gap-4 text-left">
                    <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-accent" />
                      Academic Credentials
                    </h3>
                    
                    <div className="flex items-center gap-3 text-slate-400 text-xs mt-1">
                      <span className="capitalize">{item.assessment?.seniority_level} Level</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        ID: {item.id.substring(0, 8)}...
                      </span>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Degree program</label>
                        <input
                          type="text"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          placeholder="Bachelor of Science in Computer Science"
                          className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">School / University</label>
                        <input
                          type="text"
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                          placeholder="Stanford University"
                          className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Graduation Year</label>
                        <input
                          type="text"
                          value={gradYear}
                          onChange={(e) => setGradYear(e.target.value)}
                          placeholder="2024"
                          className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    {item.status === "active" ? (
                      <Link
                        href={`/candidate/workspace/${item.id}`}
                        className="py-2.5 px-4 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-accent/10"
                      >
                        Enter Sandbox
                        <Play className="w-3 h-3 fill-black text-black" />
                      </Link>
                    ) : item.status === "completed" ? (
                      <div className="flex items-center gap-2 w-full justify-between">
                        <span className="text-[10px] font-mono text-slate-500">
                          Ended: {item.session_end ? new Date(item.session_end).toLocaleDateString() : ""}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/candidate/workspace/${item.id}/review`}
                            className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold font-outfit text-[11px] rounded-lg transition-all"
                          >
                            Peer Review
                          </Link>
                          
                          <Link
                            href={`/candidate/reports/${profile.id}`}
                            className="py-2 px-3 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-[11px] rounded-lg transition-all flex items-center gap-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            Report
                          </Link>
                        </div>
                  <div className="p-6 bg-[#0A0F1D]/60 border border-white/5 rounded-2xl flex flex-col gap-4 text-left">
                    <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-accent" />
                      Engineering Experience
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Company Name</label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Stripe Solutions"
                          className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Job Title / Role</label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Junior Fullstack Architect"
                          className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Duration (Months/Years)</label>
                        <input
                          type="text"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="18 months"
                          className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Preferences and skills */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    Target Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Primary Skills (Comma separated)</label>
                      <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="React, Next.js, WebSockets, Postgres"
                        className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Preferred Role Track</label>
                      <input
                        type="text"
                        value={preferredRole}
                        onChange={(e) => setPreferredRole(e.target.value)}
                        placeholder="Fullstack Web Architect"
                        className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Expected Salary ($ / Year)</label>
                      <input
                        type="text"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        placeholder="$120,000"
                        className="px-3.5 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="py-3 px-6 bg-accent hover:bg-accent-hover text-black font-extrabold font-outfit text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500 leading-none">
                        Waiting for host command...
                      </span>
                      "Save and Sync Credentials"
                    )}
                  </button>
                  {profileSyncStatus && (
                    <span className="text-xs text-emerald-400 font-mono font-medium animate-pulse">
                      {profileSyncStatus}
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
          {/* TAB 6: RESULTS PANEL */}
          {activeTab === "results" && (
            <div className="flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                  Career Results & Rejection Feedback
                </h1>
                <p className="text-xs text-slate-400 leading-normal font-sans font-sans">
                  View scores, structured rejection reports, and round 2 scheduling details.
                </p>
              </div>
              {/* Assessment results lists */}
              <div className="flex flex-col gap-6">
                
                {/* Round 2 Shortlist Alert banner */}
                <div className="p-6 bg-amber-500/[0.02] border border-amber-500/25 rounded-3xl relative overflow-hidden flex flex-col gap-3">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-white text-sm font-outfit uppercase tracking-wider">
                      Shortlisted for Round 2 (Senior assessment)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal max-w-xl font-sans font-sans">
                    You have successfully cleared the Round 1 screening criteria. The employer has scheduled your Round 2 assessment. Your strict evaluator prompt is active.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/40 p-4 border border-white/5 rounded-xl text-left mt-1">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Assessment ID</span>
                      <div className="text-xs font-mono font-bold text-accent">590aa3f8-20e1-4d0d...</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Duration</span>
                      <div className="text-xs font-mono font-bold text-white">90 minutes</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Test Mode</span>
                      <div className="text-xs font-mono font-bold text-white">Online IDE Sandbox</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">AI Evaluator</span>
                      <div className="text-xs font-mono font-bold text-amber-400">Gemini 2.5 Pro</div>
                    </div>
                  </div>
                </div>
              ))}
                {/* Scorecard rejection analysis (example) */}
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-4 font-sans">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                      Feedback Reports (Anonymized)
                    </h3>
                    <p className="text-[10px] text-slate-500">Why your previous score was below threshold (First Round screening)</p>
                  </div>
                  <div className="p-4 bg-rose-500/[0.01] border border-rose-500/10 rounded-xl text-left leading-relaxed">
                    <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider block mb-1">
                      Improvement Advice by Ambient AI Assistant
                    </span>
                    <span className="text-xs text-slate-300 leading-normal">
                      "Assessment screening flagged lower metrics in **Collaboration & dialogue act contribution**. While the logic compilation executed with 90% correctness, the candidate made 0 chat messages and did not respond to teammate requests. Telemetry logs indicate silent coding profiles, which reduces soft-skill matching indexes. Focus on actively communicating architecture patterns during assessment team tasks."
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="p-4 bg-[#0A0F1D] border border-white/5 rounded-xl text-left flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Correctness</span>
                      <div className="text-sm font-bold text-emerald-400">92% (High)</div>
                    </div>
                    <div className="p-4 bg-[#0A0F1D] border border-white/5 rounded-xl text-left flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Keystroke Dynamic Integrity</span>
                      <div className="text-sm font-bold text-emerald-400">98% (Authentic)</div>
                    </div>
                    <div className="p-4 bg-[#0A0F1D] border border-white/5 rounded-xl text-left flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Team Collaboration Act</span>
                      <div className="text-sm font-bold text-rose-400">42% (Low threshold)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* TAB 7: NEWS HUB */}
          {activeTab === "news" && (
            <div className="flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                  Platform News & Job Market Releases
                </h1>
                <p className="text-xs text-slate-400 leading-normal font-sans font-sans font-sans">
                  Stay updated on company layoffs, mass recruitment programs, and upcoming sandbox challenges.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-3 relative hover:border-white/10 transition-colors text-left font-sans">
                  <div className="text-[9px] font-mono font-bold text-accent uppercase tracking-widest">Hiring Campaign</div>
                  <h3 className="text-sm font-bold text-white font-outfit leading-snug">
                    Redrob Corp Announces 500+ Position Campaign for Q3 Agentic Pipelines
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Hiring managers are launching fresh assessment pools looking for junior to senior-level candidates. Scored sandboxes will bypass manual screening phases automatically.
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 mt-2">Published: 2 days ago</span>
                </div>
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-3 relative hover:border-white/10 transition-colors text-left font-sans">
                  <div className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest">Industry Shift</div>
                  <h3 className="text-sm font-bold text-white font-outfit leading-snug">
                    Mass Layoffs Cool Down in Major Systems Labs as AI Integrations Stabilize
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Industry reports indicate systems engineers are shifting core expertise from simple code writing to high-frequency WebSocket and API workflow design.
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 mt-2">Published: 1 week ago</span>
                </div>
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-3 relative hover:border-white/10 transition-colors text-left font-sans">
                  <div className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">Telemetry Release</div>
                  <h3 className="text-sm font-bold text-white font-outfit leading-snug">
                    Ambient Sandbox Engine Deploys Keystroke Dynamics to Block AI Impersonation
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Next-generation platforms are incorporating flight and dwell timing analytics to verify candidate authenticity while matching candidates to high-quality project cohorts.
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 mt-2">Published: June 15, 2026</span>
                </div>
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-3 relative hover:border-white/10 transition-colors text-left font-sans">
                  <div className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest">Platform Update</div>
                  <h3 className="text-sm font-bold text-white font-outfit leading-snug">
                    Razorpay and Stripe Multi-currency Sandboxes Deployed to Facilitate Premium Gating
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Subscribing to candidate channels is now facilitated via mock transaction pipelines verifying bank triggers without charging real assets.
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 mt-2">Published: June 10, 2026</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* MOCK PAYMENT OVERLAY MODAL (GATEWAY) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-[#050814]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 border border-white/10 rounded-3xl shadow-2xl flex flex-col gap-6 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-4">
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
            <div className="grid grid-cols-2 p-1.5 bg-slate-950/60 border border-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`py-3 text-xs font-bold rounded-xl font-outfit transition-all cursor-pointer ${
                  selectedPlan === "monthly"
                    ? "bg-white/5 text-white border border-white/5 shadow-md"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Monthly ($19.99/mo)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlan("annual")}
                className={`py-3 text-xs font-bold rounded-xl font-outfit transition-all cursor-pointer ${
                  selectedPlan === "annual"
                    ? "bg-white/5 text-white border border-white/5 shadow-md"
                    : "text-slate-500 hover:text-slate-300"
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
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-600 absolute right-4 top-3.5" />
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
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none"
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
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={paymentProcessing}
                className="w-full mt-2 py-3 bg-accent hover:bg-accent-hover text-black font-extrabold font-outfit text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    Connecting secure sandbox gateway...
                  </>
                ) : (
                  <>
                    Pay Securely with Gateway
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase">
              <Shield className="w-3.5 h-3.5" />
              Secure 256-bit encrypted checkout
            </div>
          </div>
        </div>
      </main>
      )}
    </div>
  );
}


