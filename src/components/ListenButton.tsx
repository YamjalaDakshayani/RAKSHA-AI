"use client";

import React, { useState, useEffect } from "react";
import { Volume2, Square, AlertCircle, Pause, Play, LoaderCircle } from "lucide-react";
import { NovaSpeechSynthesizer } from "@/lib/speech";
import { useAccessibility } from "@/lib/accessibilityContext";
import { SupportedLanguage } from "@/config/app";

interface ListenButtonProps {
  text: string;
  langCode: SupportedLanguage;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ListenButton({
  text,
  langCode,
  label = "Listen",
  className = "",
  size = "md",
}: ListenButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const { speechRate, preferredVoiceUri, announce } = useAccessibility();

  useEffect(() => {
    return () => {
      NovaSpeechSynthesizer.stop();
    };
  }, []);

  const handleToggle = async () => {
    if (isPlaying) {
      NovaSpeechSynthesizer.stop();
      setIsPlaying(false);
      setIsPaused(false);
      announce("Audio playback stopped");
      return;
    }

    setVoiceNotice(null);
    setIsLoading(true);
    const res = await NovaSpeechSynthesizer.speakWithFallback({
      text,
      langCode,
      rate: speechRate,
      preferredVoiceUri,
      onStart: () => {
        setIsLoading(false);
        setIsPlaying(true);
        announce(`Reading aloud: ${label}`);
      },
      onEnd: () => {
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
      },
      onError: (err) => {
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
        setVoiceNotice(err);
        announce(err);
      },
    });

    setIsLoading(false);
    if (!res.hasVoice && res.errorMsg) {
      setVoiceNotice(res.errorMsg);
      announce(res.errorMsg);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      NovaSpeechSynthesizer.resume();
      setIsPaused(false);
      announce("Audio playback resumed");
    } else {
      NovaSpeechSynthesizer.pause();
      setIsPaused(true);
      announce("Audio playback paused");
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs min-h-touch min-w-touch gap-1.5",
    md: "px-3.5 py-2 text-sm min-h-touch min-w-touch gap-2",
    lg: "px-5 py-3 text-base min-h-touch min-w-touch gap-2.5 font-bold",
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isLoading ? `Loading ${label}` : isPlaying ? `Stop reading ${label}` : `Listen to ${label}`}
        aria-pressed={isPlaying || isLoading}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
          isPlaying
            ? "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 hover:bg-rose-200"
            : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900"
        } ${sizeClasses[size]} ${className}`}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : isPlaying ? (
          <>
            <Square className="w-4 h-4 fill-rose-600 text-rose-600" aria-hidden="true" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={handlePauseResume}
          aria-label={isPaused ? `Resume reading ${label}` : `Pause reading ${label}`}
          className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 gap-1.5"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pause</span>
            </>
          )}
        </button>
      )}

      {/* Device voice missing notification banner */}
      {voiceNotice && (
        <div
          role="alert"
          className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 rounded-md p-2 flex items-start gap-1.5 max-w-xs mt-1"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>{voiceNotice}</span>
        </div>
      )}
    </div>
  );
}
