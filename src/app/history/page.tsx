"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  History,
  Trash2,
  Download,
  Filter,
  Search,
  ExternalLink,
  AlertTriangle,
  ShieldCheck,
  Check,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { RiskScoreMeter } from "@/components/RiskScoreMeter";
import { ScanRecord, RiskLevel } from "@/lib/schemas";
import { loadScans, removeScan, clearAllLocalScans } from "@/lib/scanStorage";

export default function ScanHistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadScans().then(({ scans: loaded }) => {
      setScans(loaded);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await removeScan(id);
    if (success) {
      setScans((prev) => prev.filter((s) => s.id !== id));
      if (selectedScan?.id === id) {
        setSelectedScan(null);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear your local scan history?")) {
      await clearAllLocalScans();
      setScans([]);
      setSelectedScan(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scans, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `raksha_ai_scans_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered scans
  const filteredScans = scans.filter((s) => {
    if (typeFilter !== "all" && s.scan_type !== typeFilter) return false;
    if (riskFilter !== "all" && s.risk_level !== riskFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = s.submitted_content.toLowerCase().includes(q);
      const matchRec = s.recommendation.toLowerCase().includes(q);
      if (!matchContent && !matchRec) return false;
    }
    return true;
  });

  return (
    <div className="cyber-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Audit Trail & Records</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Scan History & Threat Archive
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review, inspect, or export all previous forensic threat scans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {scans.length > 0 && (
              <>
                <button
                  onClick={handleExportJSON}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/40 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content or recommendations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Type:</span>
            {["all", "message", "link", "qr"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition ${
                  typeFilter === t
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {t}
              </button>
            ))}

            <span className="text-slate-400 uppercase font-bold text-[10px] ml-2">Risk:</span>
            {["all", "Critical", "High", "Medium", "Low"].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  riskFilter === r
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* List of Scans */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading scan archive...</div>
        ) : filteredScans.length === 0 ? (
          <div className="p-12 glass-panel rounded-2xl text-center space-y-3">
            <History className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-white">No scans match your criteria</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run a new threat scan using Message Detective, Link Scanner, or QR Guard to populate
              your security history.
            </p>
            <Link
              href="/scan/message"
              className="btn-cyber-primary px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 mt-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Message Scan</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredScans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                className="glass-card p-4 sm:p-5 rounded-xl cursor-pointer hover:border-cyan-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-slate-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                      {scan.scan_type}
                    </span>
                    <RiskBadge level={scan.risk_level} size="sm" />
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(scan.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium line-clamp-2">
                    {scan.submitted_content}
                  </p>

                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{scan.recommendation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono block">Threat Score</span>
                    <span className="text-lg font-black text-white font-mono">
                      {scan.risk_score} <span className="text-xs text-slate-400">/ 100</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(scan.id, e)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-500 hover:text-red-400 border border-slate-800 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scan Detail Modal */}
        {selectedScan && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel-glow max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase bg-cyan-950 text-cyan-400 px-2.5 py-1 rounded border border-cyan-500/40">
                    {selectedScan.scan_type} scan
                  </span>
                  <RiskBadge level={selectedScan.risk_level} size="md" />
                </div>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Submitted Content */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Inspected Content
                </span>
                <div className="mt-1 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono break-all max-h-40 overflow-y-auto">
                  {selectedScan.submitted_content}
                </div>
              </div>

              {/* Score & Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-1 flex justify-center">
                  <RiskScoreMeter score={selectedScan.risk_score} level={selectedScan.risk_level} />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Executive Finding
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {String(
                      selectedScan.findings?.summary ||
                        selectedScan.findings?.explanation ||
                        selectedScan.recommendation ||
                        ""
                    )}
                  </p>
                </div>
              </div>

              {/* Action plan */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Recommended Safe Action
                </span>
                <p className="text-xs text-white font-semibold">
                  {selectedScan.recommendation}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedScan(null)}
                  className="btn-cyber-primary px-6 py-2 rounded-lg text-xs font-bold"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
