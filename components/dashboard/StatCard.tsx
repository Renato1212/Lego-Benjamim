import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "warning" | "success";
}

export function StatCard({ label, value, icon: Icon, hint, tone = "default" }: StatCardProps) {
  const valueColor =
    tone === "warning"
      ? "text-amber"
      : tone === "success"
        ? "text-teal"
        : "text-navy";
  const iconStyles =
    tone === "warning"
      ? "bg-amber-50 text-amber"
      : tone === "success"
        ? "bg-teal/10 text-teal"
        : "bg-navy/5 text-navy";

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          <p className={`mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl ${valueColor}`}>
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyles}`}>
          <Icon size={20} />
        </span>
      </div>
    </Card>
  );
}
