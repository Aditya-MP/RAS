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
    <div className="relative min-h-screen bg-[#050814] text-slate-200 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Dynamic Background Network Particles */}
      <CanvasParticles />

      {/* Floating Header */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <Hero />

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
