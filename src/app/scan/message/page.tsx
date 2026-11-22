"use client";

import React, { useState } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Copy,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import { RiskBadge } from "@/components/RiskBadge";
import { RiskScoreMeter } from "@/components/RiskScoreMeter";
import { ThreatAnalysis } from "@/lib/schemas";
import { storeScan } from "@/lib/scanStorage";

export default function MessageDetectivePage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleScams = APP_CONFIG.sampleScams;

  const handleSelectSample = (sampleKey: keyof typeof sampleScams) => {
    setInputText(sampleScams[sampleKey].text);
    setAnalysis(null);
    setError(null);
  };

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setIsDemoMode(false);

    try {
      const res = await fetch("/api/scan/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze message");
      }

      setAnalysis(data.analysis);
      setIsDemoMode(Boolean(data.isLocalDemo));

      // Save to client/cloud scan storage
      await storeScan({
        scan_type: "message",
        submitted_content: inputText.slice(0, 300),
        risk_level: data.analysis.risk_level,
        risk_score: data.analysis.risk_score,
        findings: {
          summary: data.analysis.summary,
          suspicious_indicators: data.analysis.suspicious_indicators,
          suspicious_phrases: data.analysis.suspicious_phrases,
          warning_signs: data.analysis.warning_signs,
          explanation: data.analysis.explanation,
          recommended_actions: data.analysis.recommended_actions,
        },
        recommendation: data.analysis.recommended_actions[0] || "Review warnings carefully",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const textToCopy = `[RAKSHA AI Threat Report]\nRisk Level: ${analysis.risk_level} (Score: ${analysis.risk_score}/100)\nSummary: ${analysis.summary}\nExplanation: ${analysis.explanation}\nAction: ${analysis.recommended_actions.join("; ")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Search className="w-3.5 h-3.5" />
            <span>AI Message Detective</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Analyze Suspicious Messages & Offers
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
            Paste any suspicious WhatsApp message, SMS alert, fake job offer, scholarship letter, or
            UPI payment request. Gemini AI examines pressure keywords, advance-fee tactics, and brand
            impersonation.
          </p>
        </div>

        {/* Sample Loaders for Quick Hackathon Testing */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click to Test Real-World Demo Scenarios (Clearly Labelled Test Data):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleSelectSample("internship")}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs transition group"
            >
              <div className="font-semibold text-cyan-400 group-hover:text-cyan-300">
                Fake Google Internship
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                demands Rs. 2,999 UPI fee
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample("scholarship")}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs transition group"
            >
              <div className="font-semibold text-cyan-400 group-hover:text-cyan-300">
                PM Scholarship Phish
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                Rs. 50k grant via bit.ly link
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample("electricity")}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs transition group"
            >
              <div className="font-semibold text-cyan-400 group-hover:text-cyan-300">
                Electricity Power Cut
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                disconnects tonight panic
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample("legitimate")}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-xs transition group"
            >
              <div className="font-semibold text-emerald-400 group-hover:text-emerald-300">
                Legitimate Notice
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                Official university circular
              </div>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleScan} className="space-y-4">
          <div className="relative">
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste suspicious SMS, WhatsApp message, email, job letter, or scholarship text here..."
              className="w-full rounded-2xl bg-slate-900/80 border border-slate-700/80 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              required
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText("")}
                className="absolute top-3 right-3 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              <span className="font-mono text-cyan-400">{inputText.length}</span> characters entered
              (Max 10,000)
            </div>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="btn-cyber-primary w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Detect Threat</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Demonstration Mode:</strong> Analyzed via local heuristic engine (Configure
                GEMINI_API_KEY for live neural reasoning).
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-amber-900/60 px-2 py-0.5 rounded border border-amber-500/40">
              Demo Fallback
            </span>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysis && (
          <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-8 animate-fadeIn">
            {/* Top Verdict Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Forensic Assessment Verdict
                </span>
                <div className="mt-1 flex items-center gap-3">
                  <RiskBadge level={analysis.risk_level} size="lg" />
                  {analysis.is_likely_scam ? (
                    <span className="text-xs font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-2.5 py-1 rounded">
                      Scam Pattern Confirmed
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded">
                      No Overt Scam Triggers
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied Report" : "Copy Report"}</span>
              </button>
            </div>

            {/* Score & Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1 flex justify-center">
                <RiskScoreMeter score={analysis.risk_score} level={analysis.risk_level} />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    Executive Threat Summary
                  </h3>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                {/* Plain English Explanation */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Plain English Explanation
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Interaction Safeguards: Should user click links or send money? */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className={`p-3.5 rounded-xl border ${
                  analysis.should_avoid_interaction
                    ? "bg-red-950/40 border-red-500/40 text-red-300"
                    : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider">
                  Contact / Reply
                </div>
                <div className="text-sm font-extrabold mt-0.5">
                  {analysis.should_avoid_interaction ? "DO NOT REPLY" : "Standard Reply OK"}
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${
                  analysis.should_avoid_payment || analysis.risk_score >= 50
                    ? "bg-red-950/40 border-red-500/40 text-red-300"
                    : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider">
                  Send Money / UPI
                </div>
                <div className="text-sm font-extrabold mt-0.5">
                  {analysis.should_avoid_payment || analysis.risk_score >= 50
                    ? "NEVER SEND MONEY"
                    : "Verify Before Paying"}
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${
                  analysis.should_avoid_links || analysis.risk_score >= 40
                    ? "bg-red-950/40 border-red-500/40 text-red-300"
                    : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider">
                  Click Links in Message
                </div>
                <div className="text-sm font-extrabold mt-0.5">
                  {analysis.should_avoid_links || analysis.risk_score >= 40
                    ? "DO NOT CLICK LINKS"
                    : "Safe To Inspect"}
                </div>
              </div>
            </div>

            {/* Suspicious Phrases & Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Suspicious Indicators */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Suspicious Indicators Detected ({analysis.suspicious_indicators.length})</span>
                </h4>
                <ul className="space-y-2">
                  {analysis.suspicious_indicators.map((ind, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Recommended Action Plan</span>
                </h4>
                <ul className="space-y-2">
                  {analysis.recommended_actions.map((act, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suspicious Highlighted Phrases */}
            {analysis.suspicious_phrases && analysis.suspicious_phrases.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Flagged Phishing & Urgency Phrases:
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.suspicious_phrases.map((phrase, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono bg-red-950/80 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-md"
                    >
                      &quot;{phrase}&quot;
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
