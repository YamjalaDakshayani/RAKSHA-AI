"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { isSupabaseBrowserConfigured, createBrowserSupabaseClient } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    setIsSupabaseConfigured(isSupabaseBrowserConfigured());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured) {
      setError(
        "Supabase credentials are not connected in environment variables. You can continue instantly in Demonstration Mode below."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client failed to initialize.");
      }

      if (mode === "signup") {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signupError) throw signupError;

        if (data.session) {
          router.push("/dashboard");
        } else {
          setMessage(
            "Account created! Please check your email inbox to confirm your registration."
          );
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;

        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    // Continue in demo mode to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="cyber-bg min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 glass-panel-glow p-8 rounded-3xl animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" withTagline={true} />
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-4">
            {mode === "login" ? "Access Guardian Console" : "Create Guardian Account"}
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to synchronize scan histories, threat telemetry, and personalized defense logs.
          </p>
        </div>

        {/* Supabase Connection State Notice */}
        {!isSupabaseConfigured ? (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Supabase Not Configured in .env</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              Add your Supabase URL and anon key to `.env.local` to enable PostgreSQL cloud sync.
              You can explore all features right now in <strong>Demonstration Mode</strong>.
            </p>
            <button
              type="button"
              onClick={handleDemoBypass}
              className="w-full mt-1 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continue in Demonstration Mode</span>
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Supabase Cloud Authentication Active</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              mode === "login"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              mode === "signup"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Notification Feedback */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber-primary w-full py-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === "login" ? "Authenticate" : "Register Guardian Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Demo link */}
        <div className="text-center pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleDemoBypass}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
          >
            <span>Skip to Dashboard in Guest Mode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
