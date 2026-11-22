"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Square,
  Sparkles,
  RotateCcw,
  Volume2,
  AlertCircle,
  HelpCircle,
  Shield,
} from "lucide-react";
import { SupportedLanguage, ReadingLevel, APP_CONFIG } from "@/config/app";
import { NovaSpeechSynthesizer } from "@/lib/speech";
import { useAccessibility } from "@/lib/accessibilityContext";

export type AssistantState = "idle" | "listening" | "thinking" | "speaking";

interface ChatMessage {
  id: string;
  role: "user" | "nova";
  content: string;
  timestamp: string;
}

export function TalkToNova() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "nova",
      content:
        "Hello! I am Nova, your college accessibility assistant. You can speak to me hands-free or type your questions. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [textInput, setTextInput] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [level, setLevel] = useState<ReadingLevel>("simple");
  const [handsFreeEnabled, setHandsFreeEnabled] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<{ title: string; context: string } | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { speechRate, preferredVoiceUri, announce } = useAccessibility();

  // Load document context from this session if analyzed on home page
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("nova_active_doc");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.title && parsed?.context) {
          setActiveDoc(parsed);
          setMessages((prev) => [
            ...prev,
            {
              id: "doc-context-msg",
              role: "nova",
              content: `I see you were reviewing "${parsed.title}". You can ask me any questions about it, or clear it if you want to discuss something else!`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
      }
    } catch {}
  }, []);

  // Scroll chat into view on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, assistantState]);

  // Clean up speech and recognition on unmount
  useEffect(() => {
    return () => {
      NovaSpeechSynthesizer.stop();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const langCodeMap: Record<SupportedLanguage, string> = {
    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
  };

  /**
   * Starts listening for user speech
   */
  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorNotice(
        "Voice input is not supported in this browser. Please use Chrome or type your question below."
      );
      announce("Voice recognition not supported. Please type your message.");
      setHandsFreeEnabled(false);
      setAssistantState("idle");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = langCodeMap[language] || "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setAssistantState("listening");
        announce("Listening now. Speak your question.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          handleSendMessage(transcript.trim());
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error !== "no-speech") {
          setErrorNotice("Microphone error. You can type your message below.");
        }
        if (handsFreeEnabled) {
          // Restart listening after brief pause
          setTimeout(() => {
            if (handsFreeEnabled) startListening();
          }, 1000);
        } else {
          setAssistantState("idle");
        }
      };

      recognition.onend = () => {
        // Handled in onresult or speaking
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setAssistantState("idle");
    }
  };

  /**
   * Stops hands-free loop immediately
   */
  const handleStopAll = () => {
    setHandsFreeEnabled(false);
    NovaSpeechSynthesizer.stop();
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setAssistantState("idle");
    announce("Conversation stopped. State is now Idle.");
  };

  /**
   * Sends user message to /api/chat and plays spoken reply
   */
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTextInput("");
    setAssistantState("thinking");
    announce("Nova is thinking...");

    try {
      // Build conversation history (last 6 turns)
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          language,
          level,
          documentContext: activeDoc?.context,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Nova could not answer.");
      }

      const novaReply = data.reply;
      const novaMsg: ChatMessage = {
        id: `msg-${Date.now()}-nova`,
        role: "nova",
        content: novaReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, novaMsg]);
      setAssistantState("speaking");
      announce(`Nova says: ${novaReply}`);

      // Speak reply
      void NovaSpeechSynthesizer.speakWithFallback({
        text: novaReply,
        langCode: language,
        rate: speechRate,
        preferredVoiceUri,
        onEnd: () => {
          if (handsFreeEnabled) {
            setAssistantState("listening");
            announce("Listening again. Speak now.");
            setTimeout(() => {
              startListening();
            }, 400);
          } else {
            setAssistantState("idle");
          }
        },
        onError: () => {
          if (handsFreeEnabled) {
            startListening();
          } else {
            setAssistantState("idle");
          }
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error getting answer";
      setErrorNotice(msg);
      setAssistantState("idle");
      announce(msg);
    }
  };

  const handleStartHandsFree = () => {
    setErrorNotice(null);
    setHandsFreeEnabled(true);
    startListening();
  };

  // State display text and colors
  const stateDisplayMap: Record<
    AssistantState,
    { label: string; description: string; badgeClass: string }
  > = {
    idle: {
      label: "Idle",
      description: "Ready. Tap Start Hands-Free or type a question below.",
      badgeClass:
        "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700",
    },
    listening: {
      label: "Listening",
      description: "Speak clearly into your microphone now...",
      badgeClass:
        "bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700 animate-pulse",
    },
    thinking: {
      label: "Thinking",
      description: "Nova is formulating a simple, clear answer...",
      badgeClass:
        "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border-indigo-400 dark:border-indigo-700 animate-pulse",
    },
    speaking: {
      label: "Speaking",
      description: "Nova is reading the reply aloud...",
      badgeClass:
        "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700",
    },
  };

  const currentState = stateDisplayMap[assistantState];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Talk to {APP_CONFIG.assistantName}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Continuous hands-free voice loop with synchronized large-text bubbles.
            </p>
          </div>

          {/* Hands-Free Start/Stop Controls */}
          <div className="flex items-center gap-2">
            {!handsFreeEnabled && assistantState === "idle" ? (
              <button
                type="button"
                onClick={handleStartHandsFree}
                className="min-h-touch px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-2"
              >
                <Mic className="w-5 h-5" aria-hidden="true" />
                <span>Start Hands-Free Voice</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopAll}
                className="min-h-touch px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-rose-600 flex items-center gap-2"
              >
                <Square className="w-4 h-4 fill-white" aria-hidden="true" />
                <span>Stop Conversation</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Document Context from current session */}
        {activeDoc && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
              <span>
                <strong>Document in context:</strong> {activeDoc.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveDoc(null);
                try {
                  sessionStorage.removeItem("nova_active_doc");
                } catch {}
                announce("Document context cleared. Nova is now in general question mode.");
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold underline shrink-0"
            >
              Clear Context
            </button>
          </div>
        )}

        {/* State Announcement Banner (Label shown as text, not color alone) */}
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${currentState.badgeClass}`}
            >
              Status: {currentState.label}
            </span>
            <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
              {currentState.description}
            </span>
          </div>

          {assistantState === "speaking" && (
            <button
              onClick={() => {
                NovaSpeechSynthesizer.stop();
                setAssistantState("idle");
              }}
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              Mute Speech
            </button>
          )}
        </div>

        {/* Language & Simplicity selectors for Voice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <label htmlFor="talk-lang" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Spoken Language
            </label>
            <select
              id="talk-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full min-h-touch px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {APP_CONFIG.languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="talk-level" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Response Simplicity
            </label>
            <select
              id="talk-level"
              value={level}
              onChange={(e) => setLevel(e.target.value as ReadingLevel)}
              className="w-full min-h-touch px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {APP_CONFIG.readingLevels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {errorNotice && (
        <div
          role="alert"
          className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Chat Messages Display (Large-Text Bubbles) */}
      <section
        aria-label="Conversation with Nova"
        className="bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 min-h-[380px] max-h-[550px] overflow-y-auto space-y-4 shadow-inner"
      >
        {messages.map((msg) => {
          const isNova = msg.role === "nova";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isNova ? "items-start" : "items-end"} space-y-1`}
            >
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 px-1">
                <span className="font-bold">{isNova ? APP_CONFIG.assistantName : "You"}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-base sm:text-lg leading-relaxed shadow-sm ${
                  isNova
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-tl-sm font-medium"
                    : "bg-indigo-600 text-white rounded-tr-sm font-medium"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {isNova && (
                  <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void NovaSpeechSynthesizer.speakWithFallback({
                          text: msg.content,
                          langCode: language,
                          rate: speechRate,
                          preferredVoiceUri,
                        });
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold min-h-touch py-1 px-1"
                      aria-label="Listen to this message again"
                    >
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Listen Again</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </section>

      {/* Manual Input Fallback (Type or Tap) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (textInput.trim() && assistantState !== "thinking") {
            handleSendMessage(textInput.trim());
          }
        }}
        className="flex gap-2"
      >
        <label htmlFor="chat-text-input" className="sr-only">
          Type your message to Nova
        </label>
        <input
          id="chat-text-input"
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Ask Nova anything about college, circulars, fees, or forms..."
          disabled={assistantState === "thinking"}
          className="flex-1 min-h-touch px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
        />

        <button
          type="submit"
          disabled={!textInput.trim() || assistantState === "thinking"}
          className="min-h-touch px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-base transition focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-2 shadow-sm"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
