import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ShieldCheck, PhoneCall, Globe, AlertTriangle, ExternalLink } from "lucide-react";
import { APP_CONFIG } from "@/config/app";

export function Footer() {
  return (
    <footer className="w-full border-t border-cyan-500/20 bg-[#050810] text-slate-400 mt-auto">
      {/* Top Banner: Emergency Cyber Help */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <PhoneCall className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>National Cybercrime Helpline:</span>
            <span className="text-white bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 font-mono text-sm">
              {APP_CONFIG.contact.helpline}
            </span>
            <span className="hidden sm:inline text-slate-400">(Toll-free 24x7 India)</span>
          </div>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Official Portal: cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Logo size="md" withTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              {APP_CONFIG.subheadline}
            </p>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Storage Password Protection</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Security Scanners
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/scan/message" className="hover:text-cyan-400 transition">
                  Message Detective
                </Link>
              </li>
              <li>
                <Link href="/scan/link" className="hover:text-cyan-400 transition">
                  Link Scanner
                </Link>
              </li>
              <li>
                <Link href="/scan/qr" className="hover:text-cyan-400 transition">
                  QR Guard
                </Link>
              </li>
              <li>
                <Link href="/tools/password" className="hover:text-cyan-400 transition">
                  Password Guardian
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Assistance & Intelligence */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Protection & Intelligence
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/coach" className="hover:text-cyan-400 transition">
                  AI Safety Coach
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition">
                  Security Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-cyan-400 transition">
                  Scan History
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition">
                  Threat Awareness Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Hackathon Badge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Responsible AI Standard
            </h4>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Security Notice</span>
              </div>
              RAKSHA AI provides threat assessments based on heuristics and Gemini intelligence. It is not an absolute warranty. Always verify through authoritative primary channels.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 RAKSHA AI — Your Digital Safety Guardian. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="hover:text-cyan-400 transition">
              About & Threat Library
            </Link>
            <Link href="/login" className="hover:text-cyan-400 transition">
              Login / Guest Mode
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
