import React from "react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}

export function Logo({ size = "md", withTagline = false }: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
    >
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-cyan-500/30 blur-md rounded-full group-hover:bg-cyan-400/50 transition-all duration-300" />
        
        {/* Shield Icon container */}
        <div className="relative z-10 p-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:border-cyan-400 transition-colors">
          <ShieldAlert className={`${iconSizes[size]} text-cyan-400`} />
        </div>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent ${textSizes[size]}`}
        >
          RAKSHA <span className="text-white">AI</span>
        </span>
        {withTagline && (
          <span className="text-[10px] tracking-widest uppercase text-cyan-400/80 font-semibold -mt-1">
            Digital Safety Guardian
          </span>
        )}
      </div>
    </Link>
  );
}
