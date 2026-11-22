import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldAlert } from "lucide-react";
import { RiskLevel } from "@/lib/schemas";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function RiskBadge({ level, size = "md", showIcon = true }: RiskBadgeProps) {
  const configs = {
    Low: {
      label: "Low Risk / Safe",
      bg: "bg-emerald-950/70 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
      icon: ShieldCheck,
    },
    Medium: {
      label: "Medium Risk",
      bg: "bg-amber-950/70 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      icon: AlertTriangle,
    },
    High: {
      label: "High Risk",
      bg: "bg-orange-950/70 text-orange-400 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.25)]",
      icon: AlertOctagon,
    },
    Critical: {
      label: "Critical Threat",
      bg: "bg-red-950/70 text-red-400 border-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.35)] animate-pulse",
      icon: ShieldAlert,
    },
  };

  const config = configs[level] || configs.Low;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1 border",
    md: "px-3 py-1 text-xs sm:text-sm gap-1.5 border font-semibold",
    lg: "px-4 py-1.5 text-sm sm:text-base gap-2 border font-bold",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide uppercase transition-all duration-200 ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <IconComponent className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
