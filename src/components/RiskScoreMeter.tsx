import React from "react";
import { RiskLevel } from "@/lib/schemas";

interface RiskScoreMeterProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export function RiskScoreMeter({ score, level, size = 160 }: RiskScoreMeterProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap = {
    Low: {
      stroke: "#10B981",
      glow: "rgba(16, 185, 129, 0.4)",
      label: "Safe / Minor Risk",
      textClass: "text-emerald-400",
    },
    Medium: {
      stroke: "#F59E0B",
      glow: "rgba(245, 158, 11, 0.4)",
      label: "Caution Advised",
      textClass: "text-amber-400",
    },
    High: {
      stroke: "#F97316",
      glow: "rgba(249, 115, 22, 0.4)",
      label: "High Danger",
      textClass: "text-orange-400",
    },
    Critical: {
      stroke: "#EF4444",
      glow: "rgba(239, 68, 68, 0.6)",
      label: "Severe Threat",
      textClass: "text-red-400",
    },
  };

  const current = colorMap[level] || colorMap.Low;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={current.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease",
              filter: `drop-shadow(0 0 8px ${current.glow})`,
            }}
          />
        </svg>

        {/* Inner score number and label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${current.textClass}`}>
            {score}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Risk Score
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className={`text-xs font-semibold uppercase tracking-wider ${current.textClass}`}>
          {current.label}
        </span>
      </div>
    </div>
  );
}
