import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  QrCode,
  KeyRound,
  BotMessageSquare,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Eye,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app";

export default function LandingPage() {
  const features = [
    {
      title: "Message Detective",
      tagline: "Scam & Phishing Analysis",
      description:
        "Paste suspicious WhatsApp messages, fake internship offers, SMS, scholarship links, or emails. AI dissects linguistic urgency and detects advance-fee fraud.",
      href: "/scan/message",
      icon: Search,
      badge: "Gemini Powered",
      color: "border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400",
    },
    {
      title: "Link Scanner",
      tagline: "Heuristic URL Dissector",
      description:
        "Inspects deceptive domains, typosquatting, URL shorteners, raw IP hosts, and punycode tricks. Never blindly click an unverified address.",
      href: "/scan/link",
      icon: ShieldAlert,
      badge: "Deep Heuristics",
      color: "border-blue-500/30 text-blue-400 group-hover:border-blue-400",
    },
    {
      title: "QR Guard",
      tagline: "Quishing & Payload Inspector",
      description:
        "Scan physical or digital QR codes with your camera or file upload. Extracts the embedded destination and inspects safety without auto-navigating.",
      href: "/scan/qr",
      icon: QrCode,
      badge: "Camera & Upload",
      color: "border-sky-500/30 text-sky-400 group-hover:border-sky-400",
    },
    {
      title: "Password Guardian",
      tagline: "Zero-Knowledge Strength Meter",
      description:
        "100% in-browser evaluation of length, entropy, dictionary patterns, and crack time. Passwords are NEVER sent across any network or saved.",
      href: "/tools/password",
      icon: KeyRound,
      badge: "100% Client-Side",
      color: "border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400",
    },
    {
      title: "AI Safety Coach",
      tagline: "Interactive Scam Mentor",
      description:
        "Ask questions about suspicious requests, OTP rules, UPI scams, and receive friendly, immediate step-by-step counter-measures.",
      href: "/coach",
      icon: BotMessageSquare,
      badge: "24/7 Guidance",
      color: "border-purple-500/30 text-purple-400 group-hover:border-purple-400",
    },
    {
      title: "Security Dashboard",
      tagline: "Threat Analytics & History",
      description:
        "Track scan volumes, monitor threat risk distributions, review archived findings, and export incident logs to share with cyber authorities.",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "Live Telemetry",
      color: "border-indigo-500/30 text-indigo-400 group-hover:border-indigo-400",
    },
  ];

  const threatScenarios = [
    {
      victim: "College Students & Job Seekers",
      scenario: "Fake Amazon / Google Remote Internship",
      tactic:
        "Claims high stipend of Rs. 45,000/month, demands 'Rs. 2,999 refundable documentation fee via UPI' within 2 hours.",
      impact: "Financial loss, theft of identity documents and resumes.",
      rakshaDefense: "Message Detective identifies advance fee fraud & unofficial domains.",
    },
    {
      victim: "Students Seeking Financial Aid",
      scenario: "PM Merit Scholarship Disbursement Trap",
      tactic:
        "Urgent SMS alleging Rs. 50,000 scholarship approved, directing victims to bit.ly link asking for Aadhaar OTP.",
      impact: "Account takeover and unauthorized bank debits via Aadhaar OTP.",
      rakshaDefense: "Link Scanner & QR Guard flag shortened link & credential phishing.",
    },
    {
      victim: "Parents & Senior Citizens",
      scenario: "Electricity Power Disconnection Panic",
      tactic:
        "Nighttime SMS threatening power disconnection at 9:30 PM unless a bill is paid or remote support APK is downloaded.",
      impact: "Remote phone takeover via spyware APKs, empty bank accounts.",
      rakshaDefense: "AI detects artificial urgency and warns against APK downloads.",
    },
    {
      victim: "Online Sellers & Everyday Users",
      scenario: "UPI 'Scan QR to Receive Money' Trap",
      tactic:
        "Scammer sends a QR code stating: 'Scan this code to receive advance payment for your item.'",
      impact: "Victim enters UPI PIN thinking they are getting money, but funds are debited.",
      rakshaDefense: "AI Safety Coach clarifies that QR codes & PINs are NEVER used to receive funds.",
    },
  ];

  return (
    <div className="cyber-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Cyber Alert Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-8 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Digital Safety Guardian • Powered by Gemini AI</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Think Before <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              You Click.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed mb-10">
            {APP_CONFIG.subheadline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/scan/message"
              className="btn-cyber-primary w-full sm:w-auto px-8 py-4 rounded-xl text-sm sm:text-base font-bold inline-flex items-center justify-center gap-2 group"
            >
              <span>Start Security Scan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#features"
              className="btn-cyber-secondary w-full sm:w-auto px-8 py-4 rounded-xl text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              <span>Explore Protection</span>
            </Link>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">0-100</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                Forensic Threat Score
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-extrabold text-sky-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                Client Password Privacy
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">24/7</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                AI Cyber Safety Coach
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-extrabold text-purple-400 font-mono">1930</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                National Cyber Helpline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
            Complete Threat Defense Suite
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built to Outsmart Modern Scams
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            From deceptive WhatsApp forward messages to lookalike domains and malicious QR codes,
            RAKSHA AI arms you with actionable cyber intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group glass-card p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-slate-900/80 border ${item.color} transition-colors`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-cyan-300 font-semibold mb-2">{item.tagline}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-950/60 border-y border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Three-Tier Protection Pipeline
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              How RAKSHA AI Protects You
            </h3>
            <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
              A military-grade evaluation process distilled into three simple steps for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 relative">
              <div className="text-3xl font-extrabold text-cyan-400 font-mono mb-3">01</div>
              <h4 className="text-lg font-bold text-white mb-2">Submit Suspicious Content</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste any text message, suspicious job offer, email, web URL, or scan a suspicious QR
                code. No technical expertise required.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 relative">
              <div className="text-3xl font-extrabold text-sky-400 font-mono mb-3">02</div>
              <h4 className="text-lg font-bold text-white mb-2">Dual Intelligence Evaluation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Heuristic rules instantly check protocol, typosquatting, shorteners, and IP hosts,
                while Gemini neural analysis detects psychological pressure tactics and fraud.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 relative">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono mb-3">03</div>
              <h4 className="text-lg font-bold text-white mb-2">Clear Verdict & Action Plan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive a 0–100 risk score, highlighted warning phrases, plain English explanation,
                and concrete steps: block, report, or proceed with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Threat Awareness Section: Real Scams Tackled */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
            Real Scams in 2026
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Common Traps RAKSHA AI Neutralizes
          </h3>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
            Cybercriminals constantly refine their social engineering tricks. Here is how RAKSHA AI
            protects the most vulnerable groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {threatScenarios.map((scen, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-0.5 rounded">
                  {scen.victim}
                </span>
                <span className="text-xs text-red-400 font-semibold inline-flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Threat
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">{scen.scenario}</h4>
              <p className="text-xs text-slate-300 mb-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 italic">
                &quot;{scen.tactic}&quot;
              </p>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div>
                  <strong className="text-slate-300">Potential Impact:</strong> {scen.impact}
                </div>
                <div className="text-emerald-400 font-semibold">
                  <strong>RAKSHA AI Defense:</strong> {scen.rakshaDefense}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1527] to-slate-900 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.1)]">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Protect Yourself and Your Loved Ones Today
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Scan suspicious messages, inspect suspicious links, check passwords, and talk to our AI
            Safety Coach. Free, secure, and built to defend digital citizens.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scan/message"
              className="btn-cyber-primary px-8 py-3.5 rounded-xl text-sm font-bold w-full sm:w-auto"
            >
              Analyze Suspicious Message
            </Link>
            <Link
              href="/scan/link"
              className="btn-cyber-secondary px-8 py-3.5 rounded-xl text-sm font-semibold w-full sm:w-auto"
            >
              Scan a Link
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
