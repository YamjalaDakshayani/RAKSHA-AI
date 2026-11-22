"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, AlertCircle, Sparkles } from "lucide-react";
import { SupportedLanguage } from "@/config/app";
import { useAccessibility } from "@/lib/accessibilityContext";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language: SupportedLanguage;
  disabled?: boolean;
}

export function VoiceInput({
  onTranscript,
  language,
  disabled = false,
}: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { announce } = useAccessibility();

  const langCodeMap: Record<SupportedLanguage, string> = {
    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const handleToggleRecord = () => {
    if (disabled) return;

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      announce("Microphone turned off.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langCodeMap[language] || "en-IN";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        announce(`Listening in ${language.toUpperCase()}. Speak into your microphone now.`);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          onTranscript(currentTranscript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        announce("Voice recognition stopped.");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  if (!isSupported) {
    return (
      <div
        role="note"
        className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2"
      >
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        <span>
          Voice dictation is not supported in this browser. For voice input in Hindi, Telugu, Tamil, or English, we suggest using <strong>Google Chrome</strong>.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleToggleRecord}
        disabled={disabled}
        aria-pressed={isRecording}
        aria-label={
          isRecording
            ? "Stop microphone recording"
            : `Speak document in ${langCodeMap[language]}`
        }
        className={`min-h-touch min-w-touch px-4 py-2.5 rounded-xl font-semibold text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-2 shadow-sm ${
          isRecording
            ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isRecording ? (
          <>
            <MicOff className="w-4 h-4" aria-hidden="true" />
            <span>Stop Speaking</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" aria-hidden="true" />
            <span>Speak Document</span>
          </>
        )}
      </button>

      {isRecording && (
        <span
          role="status"
          className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5 animate-pulse"
        >
          <span className="w-2 h-2 rounded-full bg-rose-600" />
          Listening now... speak clearly into your mic
        </span>
      )}
    </div>
  );
}
