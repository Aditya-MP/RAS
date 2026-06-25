"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Star,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface Teammate {
  id: string;
  email: string;
  full_name: string;
}

export default function PeerReviewPage() {
  const { teamId } = useParams() as { teamId: string };
  const { profile, token, apiFetch } = useAuth();
  const router = useRouter();

  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [loading, setLoading] = useState(true);

  // Review states per teammate
  const [reviews, setReviews] = useState<{
    [teammateId: string]: {
      technicalContribution: number;
      communicationRigor: number;
      problemSolvingSupport: number;
      comments: string;
      submitting: boolean;
      submitted: boolean;
      error: string | null;
    };
  }>({});

  const hasFetched = useRef(false);

  const fetchTeamMembers = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      const res = await apiFetch(`/api/teams/${teamId}`);
      if (res.ok) {
        const data = await res.json();
        const membersList = data.team.members || [];
        
        // Filter out current candidate
        const others = membersList
          .map((m: any) => m.candidate)
          .filter((c: any) => c && c.id !== profile?.id);

        setTeammates(others);

        // Initialize review form state
        const initialReviews: Record<string, {
          technicalContribution: number;
          communicationRigor: number;
          problemSolvingSupport: number;
          comments: string;
          submitting: boolean;
          submitted: boolean;
          error: string | null;
        }> = {};
        others.forEach((c: Teammate) => {
          initialReviews[c.id] = {
            technicalContribution: 5,
            communicationRigor: 5,
            problemSolvingSupport: 5,
            comments: "",
            submitting: false,
            submitted: false,
            error: null,
          };
        });
        setReviews(initialReviews);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      hasFetched.current = false; // Allow retry on error
    } finally {
      setLoading(false);
    }
  }, [teamId, profile, apiFetch]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }
    if (profile) {
      fetchTeamMembers();
    }
  }, [profile, token, router, fetchTeamMembers]);

  const handleRatingChange = (teammateId: string, criterion: "technicalContribution" | "communicationRigor" | "problemSolvingSupport", val: number) => {
    setReviews((prev) => ({
      ...prev,
      [teammateId]: {
        ...prev[teammateId],
        [criterion]: val,
      },
    }));
  };

  const handleCommentChange = (teammateId: string, comments: string) => {
    setReviews((prev) => ({
      ...prev,
      [teammateId]: {
        ...prev[teammateId],
        comments,
      },
    }));
  };

  const submitPeerReview = async (teammateId: string) => {
    setReviews((prev) => ({
      ...prev,
      [teammateId]: { ...prev[teammateId], submitting: true, error: null },
    }));

    const reviewData = reviews[teammateId];

    try {
      const res = await apiFetch("/api/peerreview/submit", {
        method: "POST",
        body: JSON.stringify({
          teamId,
          targetId: teammateId,
          technicalContribution: reviewData.technicalContribution,
          communicationRigor: reviewData.communicationRigor,
          problemSolvingSupport: reviewData.problemSolvingSupport,
          comments: reviewData.comments,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Review submission failed");
      }

      setReviews((prev) => ({
        ...prev,
        [teammateId]: { ...prev[teammateId], submitting: false, submitted: true },
      }));
    } catch (err: any) {
      setReviews((prev) => ({
        ...prev,
        [teammateId]: {
          ...prev[teammateId],
          submitting: false,
          error: err.message || "Failed to submit review",
        },
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col relative overflow-x-hidden">
      <div className="grid-bg absolute inset-0 opacity-5 pointer-events-none z-0" />

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-16 w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-black font-outfit text-sm">
              R
            </div>
            <span className="font-extrabold font-outfit text-white text-base">
              Redrob <span className="text-accent">Sandbox</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-[90%] lg:max-w-[1450px] w-full mx-auto px-6 py-12 relative z-10 flex flex-col gap-8">
        
        <div>
          <span className="text-[10px] font-mono font-bold bg-accent/10 border border-accent/20 px-2.5 py-1 rounded text-accent uppercase tracking-widest">
            Calibration Phase
          </span>
          <h1 className="text-2xl font-bold font-outfit text-white mt-4 mb-2 flex items-center gap-2">
            <Users className="w-6.5 h-6.5 text-accent" />
            Teammate Peer Review
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xl">
            Evaluate your teammates on their technical contribution, communication rigor, and support. Ratings are calibrated by our bias engine to discount overly positive/negative reviews.
          </p>
        </div>

        {teammates.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center gap-4">
            <Users className="w-10 h-10 text-slate-600" />
            <div>
              <h3 className="text-md font-bold text-white mb-1">No Teammates Found</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                You were the only candidate inside this team assessment sandbox. No peer reviews are required.
              </p>
            </div>
            <Link
              href="/candidate/dashboard"
              className="mt-2 py-2.5 px-4 bg-accent hover:bg-accent-hover text-black font-bold font-outfit text-xs rounded-xl shadow transition-all"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {teammates.map((cand) => {
              const review = reviews[cand.id];
              if (!review) return null;

              return (
                <div
                  key={cand.id}
                  className="glass-card p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-md font-bold text-white font-outfit">
                        {cand.full_name}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{cand.email}</span>
                    </div>

                    {review.submitted && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Submitted
                      </span>
                    )}
                  </div>

                  {review.error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{review.error}</span>
                    </div>
                  )}

                  {!review.submitted ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Sliders */}
                      <div className="flex flex-col gap-5">
                        {/* technicalContribution */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                            <span>Technical Contribution</span>
                            <span className="text-accent font-bold font-mono">{review.technicalContribution} / 5</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={review.technicalContribution}
                            onChange={(e) => handleRatingChange(cand.id, "technicalContribution", parseInt(e.target.value))}
                            className="w-full accent-accent bg-slate-900 border border-white/5 rounded-lg h-2"
                          />
                        </div>

                        {/* communicationRigor */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                            <span>Communication Rigor</span>
                            <span className="text-accent font-bold font-mono">{review.communicationRigor} / 5</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={review.communicationRigor}
                            onChange={(e) => handleRatingChange(cand.id, "communicationRigor", parseInt(e.target.value))}
                            className="w-full accent-accent bg-slate-900 border border-white/5 rounded-lg h-2"
                          />
                        </div>

                        {/* problemSolvingSupport */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                            <span>Problem Solving Support</span>
                            <span className="text-accent font-bold font-mono">{review.problemSolvingSupport} / 5</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={review.problemSolvingSupport}
                            onChange={(e) => handleRatingChange(cand.id, "problemSolvingSupport", parseInt(e.target.value))}
                            className="w-full accent-accent bg-slate-900 border border-white/5 rounded-lg h-2"
                          />
                        </div>
                      </div>

                      {/* Text Comment */}
                      <div className="flex flex-col gap-4 justify-between">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Written Feedback
                          </label>
                          <textarea
                            rows={4}
                            value={review.comments}
                            onChange={(e) => handleCommentChange(cand.id, e.target.value)}
                            placeholder="Detail how they collaborated during the session..."
                            className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-2xl text-white placeholder-slate-600 focus:outline-none transition-all font-sans text-xs resize-none leading-relaxed"
                          />
                        </div>

                        <button
                          onClick={() => submitPeerReview(cand.id)}
                          disabled={review.submitting}
                          className="py-3 px-4 bg-accent hover:bg-accent-hover text-black font-extrabold font-outfit text-xs rounded-xl shadow-lg shadow-accent/15 hover:shadow-accent/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 mt-2"
                        >
                          {review.submitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              Submit Review
                              <Sparkles className="w-3.5 h-3.5 text-black" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-500 italic">
                      Review completed. Thank you for your feedback!
                    </div>
                  )}
                </div>
              );
            })}

            {/* Back to dashboard footer */}
            <div className="flex justify-end mt-4">
              <Link
                href="/candidate/dashboard"
                className="py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold font-outfit text-xs rounded-2xl flex items-center gap-1.5 transition-all shadow"
              >
                Return to Candidate Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
