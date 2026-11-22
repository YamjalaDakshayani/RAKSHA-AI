"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Check, Send } from "lucide-react";
import { useAccessibility } from "@/lib/accessibilityContext";

interface FeedbackBoxProps {
  analysisId?: string;
}

export function FeedbackBox({ analysisId }: FeedbackBoxProps) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { announce } = useAccessibility();

  const handleRating = async (chosen: "up" | "down") => {
    setRating(chosen);
    announce(`Selected thumbs ${chosen}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });
      setSubmitted(true);
      announce("Thank you for your feedback! It helps improve Nova.");
    } catch {
      setSubmitted(true); // Treat gracefully even if offline
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center text-sm text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2">
        <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <span>Thank you! Your feedback helps make Nova more accessible for everyone.</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
          Was this explanation clear and helpful?
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRating("up")}
            aria-label="Yes, this was helpful"
            aria-pressed={rating === "up"}
            className={`min-h-touch min-w-touch p-2.5 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              rating === "up"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            }`}
          >
            <ThumbsUp className="w-4 h-4" aria-hidden="true" />
            <span>Yes</span>
          </button>

          <button
            type="button"
            onClick={() => handleRating("down")}
            aria-label="No, this was not helpful"
            aria-pressed={rating === "down"}
            className={`min-h-touch min-w-touch p-2.5 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              rating === "down"
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            }`}
          >
            <ThumbsDown className="w-4 h-4" aria-hidden="true" />
            <span>No</span>
          </button>
        </div>
      </div>

      {rating && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <label htmlFor="feedback-comment" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Tell us how we can make it even simpler (optional, max 500 characters):
          </label>
          <div className="flex gap-2">
            <input
              id="feedback-comment"
              type="text"
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g., Explain the deadline in fewer words..."
              className="flex-1 min-h-touch px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-touch px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Send</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
