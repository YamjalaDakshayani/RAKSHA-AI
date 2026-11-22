"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Mic, MicOff, AlertCircle } from "lucide-react";
import { ListenButton } from "./ListenButton";
import { SupportedLanguage, ReadingLevel } from "@/config/app";
import { useAccessibility } from "@/lib/accessibilityContext";

interface FollowUpBoxProps {
  documentContext: string;
  language: SupportedLanguage;
  level: ReadingLevel;
}

interface QAPair {
  question: string;
  answer: string;
}

export function FollowUpBox({
  documentContext,
  language,
  level,
}: FollowUpBoxProps) {
  const [question, setQuestion] = useState("");
  const [qaList, setQaList] = useState<QAPair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { announce } = useAccessibility();

  // Voice speech recognition for question input
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      announce("Voice recognition is not supported in this browser. Try Chrome.");
      setError("Voice recognition is not supported in this browser. Please type your question or use Chrome.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang =
        language === "hi"
          ? "hi-IN"
          : language === "te"
          ? "te-IN"
          : language === "ta"
          ? "ta-IN"
          : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        announce("Listening for your question. Speak now.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        announce(`Heard: ${transcript}`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        announce("Voice listening stopped or encountered an error.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQ = question.trim();
    if (!cleanQ || isLoading) return;

    setIsLoading(true);
    setError(null);
    announce(`Asking Nova: ${cleanQ}`);

    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentContext,
          question: cleanQ,
          language,
          level,
          history: qaList.slice(-3).flatMap((qa) => [
            { role: "user", content: qa.question },
            { role: "assistant", content: qa.answer },
          ]),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get an answer.");
      }

      setQaList((prev) => [...prev, { question: cleanQ, answer: data.answer }]);
      setQuestion("");
      announce(`Nova answered: ${data.answer}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error getting answer";
      setError(msg);
      announce(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
          Ask a Follow-Up Question
        </h3>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Still confused about a specific requirement, date, or document? Ask here. Nova only answers from the document to protect you from misinformation.
      </p>

      {/* Existing Q&A list */}
      {qaList.length > 0 && (
        <div className="space-y-3 pt-2">
          {qaList.map((qa, index) => (
            <div
              key={index}
              className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2 text-sm"
            >
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Q:</span>
                <span>{qa.question}</span>
              </div>
              <div className="text-zinc-700 dark:text-zinc-300 pl-4 border-l-2 border-indigo-500 space-y-2">
                <p className="leading-relaxed">{qa.answer}</p>
                <ListenButton
                  text={qa.answer}
                  langCode={language}
                  label="Listen to Answer"
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask Form */}
      <form onSubmit={handleAsk} className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="followup-input" className="sr-only">
            Ask a question about this document
          </label>
          <input
            id="followup-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Can I submit the income certificate later?"
            className="flex-1 min-h-touch px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            disabled={isLoading}
          />

          {/* Voice button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            aria-label={isListening ? "Stop listening" : "Speak your question"}
            className={`min-h-touch min-w-touch p-2.5 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              isListening
                ? "bg-rose-500 text-white border-rose-500 animate-pulse"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Mic className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="min-h-touch px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>{isLoading ? "Thinking..." : "Ask"}</span>
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
