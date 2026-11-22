"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Globe,
  Server,
  Layers,
  Sparkles,
  Info,
  Check,
  ShieldCheck,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import { RiskBadge } from "@/components/RiskBadge";
import { RiskScoreMeter } from "@/components/RiskScoreMeter";
import { LinkAnalysis } from "@/lib/schemas";
import { storeScan } from "@/lib/scanStorage";

export default function LinkScannerPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LinkAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleLinks = APP_CONFIG.sampleLinks;

  const handleSelectSample = (key: keyof typeof sampleLinks) => {
    setInputUrl(sampleLinks[key].url);
    setAnalysis(null);
    setError(null);
  };

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scan/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl, scanType: "link" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze link");
      }

      setAnalysis(data.analysis);

      // Save to client/cloud scan storage
      await storeScan({
        scan_type: "link",
        submitted_content: inputUrl.slice(0, 300),
        risk_level: data.analysis.risk_level,
        risk_score: data.analysis.risk_score,
        findings: {
          domain: data.analysis.domain,
          protocol: data.analysis.protocol,
          is_https: data.analysis.is_https,
          is_shortener: data.analysis.is_shortener,
          is_ip_address: data.analysis.is_ip_address,
          is_suspicious_tld: data.analysis.is_suspicious_tld,
          warnings: data.analysis.warnings,
          explanation: data.analysis.explanation,
          recommendations: data.analysis.recommendations,
        },
        recommendation: data.analysis.recommendations[0] || "Review link before visiting",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during link inspection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCleanUrl = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Forensic Link Scanner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Inspect Suspicious URLs & Phishing Domains
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
            Detect typosquatting, URL shorteners, deceptive subdomains, raw IP hosts, and unencrypted
            protocols. RAKSHA AI dissects links safely in an isolated environment without ever
            visiting or executing malicious scripts.
          </p>
        </div>

        {/* Security Rule Warning Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-cyan-300">RAKSHA AI Security Principle:</strong> HTTPS only
            encrypts transmission between your browser and the server—it does{" "}
            <strong>NOT</strong> prove the destination is safe. Scammers routinely obtain free SSL
            certificates. We never auto-navigate to submitted links.
          </div>
        </div>

        {/* Sample Links for Hackathon Demo */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click to Test Real Scenarios (Clearly Labelled Test Data):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleSelectSample("typosquat")}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-red-500/40 text-xs transition group"
            >
              <div className="font-semibold text-red-400 group-hover:text-red-300">
                Typosquat Lookalike
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                goog1e-verify.xyz
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample("shortener")}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 text-xs transition group"
            >
              <div className="font-semibold text-orange-400 group-hover:text-orange-300">
                Obfuscated Shortener
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                bit.ly/recharge-2026
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample("ipPhish")}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-red-500/40 text-xs transition group"
            >
              <div className="font-semibold text-red-400 group-hover:text-red-300">
                Raw IP Banking Phish
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                192.168.1.105:8080/sbi
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample("legit")}
              className="text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-xs transition group"
            >
              <div className="font-semibold text-emerald-400 group-hover:text-emerald-300">
                Safe Official Domain
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                google.com
              </div>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleScan} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste URL here (e.g., https://goog1e-verify-security.xyz/login)..."
              className="w-full rounded-2xl bg-slate-900/80 border border-slate-700/80 pl-12 pr-24 py-4 text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              required
            />
            {inputUrl && (
              <button
                type="button"
                onClick={() => setInputUrl("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !inputUrl.trim()}
              className="btn-cyber-primary w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Structure...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Scan Link</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysis && (
          <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-8 animate-fadeIn">
            {/* Top Verdict Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Domain Forensic Verdict
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <RiskBadge level={analysis.risk_level} size="lg" />
                  <span className="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1 rounded border border-slate-700">
                    {analysis.domain}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyCleanUrl}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Address Copied" : "Copy URL"}</span>
              </button>
            </div>

            {/* Score & Structural Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1 flex justify-center">
                <RiskScoreMeter score={analysis.risk_score} level={analysis.risk_level} />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    Forensic Link Verdict
                  </h3>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {analysis.explanation}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Safe To Visit in Browser?
                    </div>
                    <div
                      className={`text-sm font-extrabold mt-0.5 ${
                        analysis.safe_to_visit ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {analysis.safe_to_visit
                        ? "PASSED CHECKS — PROCEED WITH ROUTINE CAUTION"
                        : "HIGH THREAT DETECTED — DO NOT OPEN"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Checklist Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Security Characteristic Inspection Matrix:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Protocol */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {analysis.is_https ? (
                      <Lock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-xs text-slate-300">Transport Security</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      analysis.is_https ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {analysis.is_https ? "HTTPS (Encrypted)" : "HTTP (Insecure)"}
                  </span>
                </div>

                {/* 2. URL Shortener */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-300">URL Shortener</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      analysis.is_shortener ? "text-orange-400" : "text-emerald-400"
                    }`}
                  >
                    {analysis.is_shortener ? "Obfuscated" : "Standard Domain"}
                  </span>
                </div>

                {/* 3. Raw IP Address */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-sky-400" />
                    <span className="text-xs text-slate-300">Host Type</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      analysis.is_ip_address ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {analysis.is_ip_address ? "Raw IP Host" : "Named FQDN"}
                  </span>
                </div>

                {/* 4. Typosquatting */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-300">Brand Impersonation</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      analysis.typosquatting_detected ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {analysis.typosquatting_detected
                      ? `Mimics ${analysis.detected_brand}`
                      : "None Detected"}
                  </span>
                </div>

                {/* 5. Suspicious TLD */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-300">Top Level Domain</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      analysis.is_suspicious_tld ? "text-orange-400" : "text-emerald-400"
                    }`}
                  >
                    {analysis.is_suspicious_tld ? "High-Risk TLD" : "Standard TLD"}
                  </span>
                </div>

                {/* 6. Punycode / IDN */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-400" />
                    <span className="text-xs text-slate-300">Punycode / Homograph</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      analysis.has_punycode ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {analysis.has_punycode ? "Homograph Detected" : "Standard ASCII"}
                  </span>
                </div>
              </div>
            </div>

            {/* Warnings and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warnings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Detected Technical Red Flags ({analysis.warnings.length})</span>
                </h4>
                {analysis.warnings.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.warnings.map((warn, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-emerald-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    No high-risk technical red flags detected in heuristic checks.
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Safety Recommendations</span>
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
