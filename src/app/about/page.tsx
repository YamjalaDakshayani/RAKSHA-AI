import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Info,
  PhoneCall,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app";

export default function AboutAwarenessPage() {
  const attackVectors = [
    {
      title: "Quishing (QR Code Phishing)",
      description:
        "Replacing legitimate QR codes at payment stalls, metro parking, or in emails with malicious QR codes that lead to credential harvesting or UPI drain portals.",
      counter: "Scan with RAKSHA AI QR Guard to inspect destination before browser opens it.",
    },
    {
      title: "Smishing & WhatsApp Phishing",
      description:
        "Urgent SMS messages pretending to be your bank, electricity board, or courier asking you to click a link or download an APK to avoid disconnection/freeze.",
      counter: "Paste text into Message Detective to identify urgency manipulation & fake domains.",
    },
    {
      title: "Fake Remote Job & Internship Offers",
      description:
        "Fraudsters masquerading as Google, Amazon, or TCS HR managers offer high stipends but demand advance registration, training, or laptop dispatch fees.",
      counter: "Legitimate tech firms never charge registration fees. RAKSHA AI flags advance-fee fraud.",
    },
    {
      title: "UPI Collect Request Traps",
      description:
        "Scammers tell victims: 'Enter your UPI PIN to claim 50,000 lottery or buyer advance'. Entering a PIN always deducts money from your account.",
      counter: "Golden Rule: You NEVER enter a PIN or scan a QR code to receive money.",
    },
  ];

  const emergencyChecklist = [
    {
      step: "01",
      title: "Immediate Bank & Card Freeze",
      action: "Call your bank's 24x7 emergency helpline or use mobile banking app to temporarily lock debit cards, UPI, and netbanking.",
    },
    {
      step: "02",
      title: "Dial Cybercrime Helpline 1930",
      action: "If financial loss occurred in India, immediately dial 1930. The National Cybercrime Reporting Portal coordinates with banks to freeze money in transit.",
    },
    {
      step: "03",
      title: "Disconnect Device from Internet",
      action: "If you downloaded an APK or file from a suspicious link, immediately enable Airplane Mode to sever remote-control attacker access.",
    },
    {
      step: "04",
      title: "Reset Critical Passwords",
      action: "From a separate clean device, change passwords for primary email, Google/Apple ID, and netbanking. Enable Authenticator App 2FA.",
    },
    {
      step: "05",
      title: "File Formal Complaint Online",
      action: "Lodge an official cyber complaint at cybercrime.gov.in (India) or ic3.gov (USA) with transaction IDs, screenshots, and phone numbers.",
    },
  ];

  return (
    <div className="cyber-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cyber Threat Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Digital Safety Guardian & Threat Guide
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Understanding the psychological manipulation and technical tactics scammers use is your
            first line of defense. Here is your actionable manual for staying secure online.
          </p>
        </div>

        {/* Emergency Helpline Highlight Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>National 24x7 Emergency Contact</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Have you been targeted by a financial scam?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every minute counts. Reporting within the first &quot;Golden Hour&quot; allows cyber authorities
              to freeze fraudulent transactions across intermediate bank accounts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-auto text-center px-6 py-4 rounded-xl bg-cyan-950 border border-cyan-500/60">
              <span className="text-[10px] uppercase font-bold text-cyan-300 block">Dial Helpline</span>
              <span className="text-3xl font-black font-mono text-white">1930</span>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber-primary w-full sm:w-auto px-6 py-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Attack Vectors */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Scam Taxonomy
            </h2>
            <h3 className="text-2xl font-bold text-white mt-1">
              Common Cyber Attack Tactics in 2026
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attackVectors.map((vec, i) => (
              <div key={i} className="glass-card p-6 rounded-xl space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span>{vec.title}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{vec.description}</p>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-emerald-400 font-semibold flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{vec.counter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Response Checklist */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Incident Response Protocol
            </h2>
            <h3 className="text-2xl font-bold text-white mt-1">
              &quot;I Clicked a Suspicious Link — What Do I Do Right Now?&quot;
            </h3>
          </div>

          <div className="space-y-3">
            {emergencyChecklist.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Product Philosophy */}
        <div className="glass-panel p-8 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white">About RAKSHA AI</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong>RAKSHA AI</strong> was created with a clear mission:{" "}
            <em>Detect threats. Prevent scams. Protect people.</em>
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Too often, cybersecurity tools are built exclusively for enterprise IT administrators,
            leaving ordinary people, students, seniors, and non-technical families exposed to
            predatory scams. RAKSHA AI bridges this divide by putting forensic-grade threat
            intelligence directly into consumer hands with simple English explanations, instant
            quishing protection, zero-knowledge password auditing, and Gemini-powered situational coaching.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/scan/message"
              className="btn-cyber-primary px-5 py-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Launch Message Detective</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/coach"
              className="btn-cyber-secondary px-5 py-2.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <span>Ask AI Safety Coach</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
