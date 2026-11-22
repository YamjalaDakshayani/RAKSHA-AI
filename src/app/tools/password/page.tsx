"use client";

import React, { useState, useMemo } from "react";
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Lock,
  Cpu,
} from "lucide-react";

const COMMON_PASSWORDS = new Set([
  "password",
  "123456",
  "12345678",
  "123456789",
  "qwerty",
  "admin",
  "welcome",
  "iloveyou",
  "secret",
  "pass123",
  "google",
  "facebook",
  "monkey",
  "football",
  "dragon",
  "master",
  "sunshine",
  "princess",
  "superman",
  "starwars",
]);

export default function PasswordGuardianPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generator State
  const [genLength, setGenLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  // 100% Client-side evaluation
  const analysis = useMemo(() => {
    if (!password) {
      return null;
    }

    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    // Common pattern & dictionary check
    const lower = password.toLowerCase();
    const isCommon = COMMON_PASSWORDS.has(lower);
    const hasSequentialDigits = /(?:012|123|234|345|456|567|678|789)/.test(password);
    const hasRepeatedChars = /(.)\1{2,}/.test(password);

    // Pool size for entropy calculation
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSpecial) poolSize += 33;
    if (poolSize === 0) poolSize = 1;

    // Shannon entropy = L * log2(poolSize)
    const entropy = Math.floor(length * (Math.log(poolSize) / Math.LN2));

    let score = 0;
    if (length >= 8) score += 20;
    if (length >= 12) score += 20;
    if (length >= 16) score += 15;
    if (hasLower && hasUpper) score += 15;
    if (hasNumber) score += 15;
    if (hasSpecial) score += 15;

    // Deductions for weaknesses
    if (isCommon) score = Math.min(10, score - 50);
    if (hasSequentialDigits) score = Math.max(5, score - 15);
    if (hasRepeatedChars) score = Math.max(5, score - 10);
    if (length < 8) score = Math.min(25, score);

    score = Math.min(100, Math.max(0, score));

    // Crack time estimation based on 10 billion guesses/sec
    let crackTime = "Instantly (< 1 second)";
    if (entropy > 80) crackTime = "Over 10,000 centuries";
    else if (entropy > 65) crackTime = "Several centuries";
    else if (entropy > 50) crackTime = "Approx. 5 to 10 years";
    else if (entropy > 40) crackTime = "Approx. 3 weeks";
    else if (entropy > 30) crackTime = "A few hours";
    else if (entropy > 20) crackTime = "Under 2 minutes";

    // Rating
    let rating: "Critical" | "Weak" | "Moderate" | "Strong" | "Fortified" = "Weak";
    let colorClass = "text-red-400";
    let barColor = "bg-red-500";

    if (score >= 90) {
      rating = "Fortified";
      colorClass = "text-emerald-400";
      barColor = "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
    } else if (score >= 70) {
      rating = "Strong";
      colorClass = "text-cyan-400";
      barColor = "bg-cyan-500 shadow-[0_0_12px_rgba(0,240,255,0.4)]";
    } else if (score >= 50) {
      rating = "Moderate";
      colorClass = "text-amber-400";
      barColor = "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]";
    } else {
      rating = "Critical";
      colorClass = "text-red-400";
      barColor = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]";
    }

    // Improvement tips
    const tips: string[] = [];
    if (length < 12) tips.push("Increase length to at least 14–16 characters for exponential resistance.");
    if (!hasUpper) tips.push("Add uppercase letters (A–Z).");
    if (!hasLower) tips.push("Add lowercase letters (a–z).");
    if (!hasNumber) tips.push("Add numbers (0–9).");
    if (!hasSpecial) tips.push("Include symbols or punctuation (!@#$%^&*).");
    if (isCommon) tips.push("CRITICAL: This is an extremely common dictionary password found in known leak databases.");
    if (hasSequentialDigits) tips.push("Avoid sequential numbers like 123 or 456.");
    if (hasRepeatedChars) tips.push("Avoid repeated consecutive characters (e.g. 'aaa').");

    return {
      score,
      rating,
      colorClass,
      barColor,
      entropy,
      crackTime,
      tips,
      hasLower,
      hasUpper,
      hasNumber,
      hasSpecial,
      isCommon,
      length,
    };
  }, [password]);

  // Client-side secure password generation
  const generatePassword = () => {
    let charset = "";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const randomValues = new Uint32Array(genLength);
    window.crypto.getRandomValues(randomValues);

    let result = "";
    for (let i = 0; i < genLength; i++) {
      result += charset[randomValues[i] % charset.length];
    }

    setPassword(result);
  };

  const handleCopyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Password Guardian</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Client-Side Password Strength & Entropy Meter
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
            Evaluate password resilience against brute-force attacks and credential stuffing.
          </p>
        </div>

        {/* Absolute Privacy Guarantee Banner */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs text-slate-300 flex items-start gap-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-emerald-300">100% In-Browser Privacy Guarantee:</strong> Your
            passwords are evaluated completely in your browser&apos;s local JavaScript runtime. Passwords
            are <strong>NEVER</strong> sent to Gemini, our backend API, or any database. Zero
            network packets leave your device.
          </div>
        </div>

        {/* Password Input Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Enter or Generate a Password to Evaluate:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type a password (e.g., MySecureP@ssw0rd2026!)..."
                className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-4 py-3.5 pr-24 font-mono text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-slate-400 hover:text-cyan-400 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {password && (
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="p-2 text-slate-400 hover:text-emerald-400 transition"
                    title="Copy password"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Real-Time Strength Meter */}
          {analysis ? (
            <div className="space-y-6 pt-4 border-t border-slate-800 animate-fadeIn">
              {/* Strength Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Strength Rating:</span>
                  <span className={`uppercase font-bold tracking-wider ${analysis.colorClass}`}>
                    {analysis.rating} ({analysis.score}/100)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${analysis.barColor}`}
                    style={{ width: `${analysis.score}%` }}
                  />
                </div>
              </div>

              {/* Entropy & Crack Time Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Estimated Brute-Force Time
                  </div>
                  <div className="text-sm font-extrabold text-white mt-1 font-mono">
                    {analysis.crackTime}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Shannon Entropy
                  </div>
                  <div className="text-sm font-extrabold text-cyan-400 mt-1 font-mono">
                    ~{analysis.entropy} bits
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Character Count
                  </div>
                  <div className="text-sm font-extrabold text-sky-400 mt-1 font-mono">
                    {analysis.length} chars
                  </div>
                </div>
              </div>

              {/* Character Variety Checks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div
                  className={`p-2.5 rounded-lg border text-center font-semibold ${
                    analysis.length >= 12
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  Length (12+)
                </div>
                <div
                  className={`p-2.5 rounded-lg border text-center font-semibold ${
                    analysis.hasUpper && analysis.hasLower
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  Mixed Case (aA)
                </div>
                <div
                  className={`p-2.5 rounded-lg border text-center font-semibold ${
                    analysis.hasNumber
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  Numbers (0-9)
                </div>
                <div
                  className={`p-2.5 rounded-lg border text-center font-semibold ${
                    analysis.hasSpecial
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  Symbols (#$%)
                </div>
              </div>

              {/* Improvement Tips */}
              {analysis.tips.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Recommendations to Fortify:
                  </div>
                  <ul className="space-y-1.5">
                    {analysis.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              Start typing above or click &quot;Generate Fortified Password&quot; below to test strength.
            </div>
          )}
        </div>

        {/* Cryptographically Secure Password Generator */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>Cryptographic Password Generator</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generates high-entropy passwords using Web Crypto API (window.crypto.getRandomValues).
              </p>
            </div>

            <button
              type="button"
              onClick={generatePassword}
              className="btn-cyber-primary px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-2">
                Length: <span className="font-mono text-cyan-400">{genLength}</span> characters
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={genLength}
                onChange={(e) => setGenLength(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Symbols (!@#)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
