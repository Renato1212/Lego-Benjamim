"use client";

import { motion } from "framer-motion";

interface ComplianceRingProps {
  score: number; // 0-100
  size?: number;
}

export function ComplianceRing({ score, size = 140 }: ComplianceRingProps) {
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const color = score >= 90 ? "#0E9F8A" : score >= 70 ? "#F59E0B" : "#DC2626";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tracking-tight text-navy">
          {score}%
        </span>
        <span className="text-[11px] font-medium text-slate-500">conforme</span>
      </div>
    </div>
  );
}
