"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BotMessageSquare,
  Send,
  User,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  AlertTriangle,
  Info,
  RotateCcw,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
}

const PRESET_QUESTIONS = [
  "Someone asked me for an OTP to claim a prize. What should I do?",
  "How does the 'Scan QR to receive money' scam actually work?",
  "Received a Google/Amazon job offer asking for a Rs. 2,999 deposit. Is it real?",
  "How can I protect my elderly parents from WhatsApp & SMS scams?",
  "What is the difference between HTTP and HTTPS?",
];

export default function SafetyCoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-coach-greeting",
      role: "model",
      content: `Hello! I am your **RAKSHA AI Safety Coach** 🛡️.

I am here to help you navigate digital risks, avoid scams, and protect yourself online. You can ask me anything about:
- Suspicious calls, SMS, or WhatsApp messages
- UPI, OTP, and banking safety rules
- Fake job and scholarship offers
- Emergency steps if you or a family member clicked a malicious link

What question can I help you with today?`,
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reach AI Safety Coach");
      }

      const botMsg: ChatMessage = {
        id: "coach-" + Date.now(),
        role: "model",
        content: data.reply,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsDemoMode(Boolean(data.isLocalDemo));
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "model",
          content:
            "⚠️ Unable to reach AI servers right now. In case of an active financial scam, immediately call the National Cybercrime Helpline at **1930** or visit **cybercrime.gov.in**.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "initial-coach-greeting",
        role: "model",
        content: `Hello! I am your **RAKSHA AI Safety Coach** 🛡️. Ask me anything about scams, phishing, or cybersecurity emergency defense.`,
      },
    ]);
  };

  return (
    <div className="cyber-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
              <BotMessageSquare className="w-3.5 h-3.5" />
              <span>AI Cyber Safety Coach</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Talk with Your Digital Guardian
            </h1>
          </div>

          <button
            onClick={handleResetChat}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>

        {/* Emergency Hotkey Notice */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-cyan-400" />
            <span>
              National Cybercrime Helpline:{" "}
              <strong className="text-white font-mono bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40">
                1930
              </strong>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">Free, Immediate Fund Freezing Assistance</span>
        </div>

        {/* Demo Mode Indicator */}
        {isDemoMode && (
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Demonstration Knowledge Base active (Configure GEMINI_API_KEY for dynamic generative responses).</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-amber-900/60 px-2 py-0.5 rounded">
              Demo Mode
            </span>
          </div>
        )}

        {/* Chat Window */}
        <div className="glass-panel rounded-2xl flex flex-col h-[520px] overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isUser
                        ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                        : "bg-purple-950 border border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? "bg-cyan-600/20 text-cyan-100 border border-cyan-500/40 rounded-tr-none"
                        : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-md"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center flex-shrink-0">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                  <span className="text-xs text-slate-400 ml-1">Analyzing safety recommendations...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick preset chips */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] text-slate-500 font-semibold uppercase flex-shrink-0">
              Suggestions:
            </span>
            {PRESET_QUESTIONS.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                disabled={loading}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs transition flex-shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a cybersecurity question or describe a suspicious situation..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="btn-cyber-primary p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
