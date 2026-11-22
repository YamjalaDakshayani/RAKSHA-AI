"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShieldAlert,
  Search,
  QrCode,
  KeyRound,
  BotMessageSquare,
  History,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Info,
  ExternalLink,
} from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { ScanRecord } from "@/lib/schemas";
import { loadScans } from "@/lib/scanStorage";

export default function SecurityDashboardPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [isSupabase, setIsSupabase] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans().then(({ scans: loaded, isSupabase: supabaseActive }) => {
      setScans(loaded);
      setIsSupabase(supabaseActive);
      setLoading(false);
    });
  }, []);

  // Compute telemetry metrics
  const totalScans = scans.length;
  const criticalCount = scans.filter((s) => s.risk_level === "Critical").length;
  const highCount = scans.filter((s) => s.risk_level === "High").length;
  const mediumCount = scans.filter((s) => s.risk_level === "Medium").length;
  const lowCount = scans.filter((s) => s.risk_level === "Low").length;
  const threatsDetected = criticalCount + highCount;

  const avgRiskScore = totalScans
    ? Math.round(scans.reduce((acc, curr) => acc + curr.risk_score, 0) / totalScans)
    : 0;

  return (
    <div className="cyber-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Cyber Threat Operations Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Security Telemetry Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time threat detection telemetry, risk distribution, and tool monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/scan/message"
              className="btn-cyber-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Security Scan</span>
            </Link>
          </div>
        </div>

        {/* Database Connection State Banner */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isSupabase ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"
              }`}
            />
            <span className="text-slate-300">
              {isSupabase ? (
                <>
                  <strong className="text-emerald-400">Cloud Connected:</strong> Telemetry synchronized with Supabase PostgreSQL scans table.
                </>
              ) : (
                <>
                  <strong className="text-cyan-400">Local Telemetry Mode:</strong> Scans stored in browser local state. Connect Supabase for multi-device sync.
                </>
              )}
            </span>
          </div>

          <Link href="/history" className="text-xs text-cyan-400 hover:underline font-semibold">
            View Complete Log ({totalScans})
          </Link>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Scans Run
              </span>
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-white font-mono">{totalScans}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Across messages, links & QR</span>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Threats Neutralized
              </span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-red-400 font-mono">
              {threatsDetected}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Critical & High severity traps</span>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Clean Items Verified
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-emerald-400 font-mono">
              {lowCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Passed baseline heuristic checks</span>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Avg Threat Index
              </span>
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-sky-400 font-mono">
              {avgRiskScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Composite danger score</span>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Threat Severity Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono">{totalScans} events mapped</span>
          </div>

          {/* Visual Stacked Progress Bar */}
          <div className="w-full h-4 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
            {totalScans > 0 ? (
              <>
                <div
                  style={{ width: `${(criticalCount / totalScans) * 100}%` }}
                  className="bg-red-500 h-full transition-all"
                  title={`Critical: ${criticalCount}`}
                />
                <div
                  style={{ width: `${(highCount / totalScans) * 100}%` }}
                  className="bg-orange-500 h-full transition-all"
                  title={`High: ${highCount}`}
                />
                <div
                  style={{ width: `${(mediumCount / totalScans) * 100}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`Medium: ${mediumCount}`}
                />
                <div
                  style={{ width: `${(lowCount / totalScans) * 100}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`Low/Safe: ${lowCount}`}
                />
              </>
            ) : (
              <div className="w-full bg-slate-800 h-full" />
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
              <div>
                <span className="text-slate-400">Critical Threat:</span>{" "}
                <strong className="text-red-400 font-mono">{criticalCount}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
              <div>
                <span className="text-slate-400">High Risk:</span>{" "}
                <strong className="text-orange-400 font-mono">{highCount}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
              <div>
                <span className="text-slate-400">Medium Caution:</span>{" "}
                <strong className="text-amber-400 font-mono">{mediumCount}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
              <div>
                <span className="text-slate-400">Low / Clean:</span>{" "}
                <strong className="text-emerald-400 font-mono">{lowCount}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
            Quick Tool Launch
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Link
              href="/scan/message"
              className="glass-card p-4 rounded-xl flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
                  Message Detective
                </div>
                <div className="text-[10px] text-slate-400">SMS & WhatsApp</div>
              </div>
            </Link>

            <Link
              href="/scan/link"
              className="glass-card p-4 rounded-xl flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition">
                  Link Scanner
                </div>
                <div className="text-[10px] text-slate-400">URL Dissector</div>
              </div>
            </Link>

            <Link
              href="/scan/qr"
              className="glass-card p-4 rounded-xl flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-sky-950/80 border border-sky-500/40 text-sky-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-sky-400 transition">
                  QR Guard
                </div>
                <div className="text-[10px] text-slate-400">Quishing Blocker</div>
              </div>
            </Link>

            <Link
              href="/tools/password"
              className="glass-card p-4 rounded-xl flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                  Password Guardian
                </div>
                <div className="text-[10px] text-slate-400">Client-Side Meter</div>
              </div>
            </Link>

            <Link
              href="/coach"
              className="glass-card p-4 rounded-xl flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-400">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-purple-400 transition">
                  Safety Coach
                </div>
                <div className="text-[10px] text-slate-400">24/7 AI Mentor</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Scan Activity Stream */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Threat Interceptions</span>
            </h3>
            <Link
              href="/history"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
            >
              <span>Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {scans.slice(0, 5).map((scan) => (
              <div
                key={scan.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 px-2 rounded-lg transition"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {scan.scan_type}
                    </span>
                    <RiskBadge level={scan.risk_level} size="sm" />
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 truncate">
                    {scan.submitted_content}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Score: <span className="text-white">{scan.risk_score}</span>/100
                  </span>
                  <Link
                    href={`/history`}
                    className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                    title="View details"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
