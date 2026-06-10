import { TriangleAlert, Clock } from "lucide-react";
import type { UrgentAlert } from "@/lib/mock-data";

export function AlertsList({ alerts }: { alerts: UrgentAlert[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {alerts.map((alert) => {
        const alta = alert.severidade === "alta";
        return (
          <li
            key={alert.id}
            className={`flex items-start gap-3 rounded-xl border p-3.5 ${
              alta
                ? "border-red-200 bg-red-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <span
              className={`mt-0.5 shrink-0 ${alta ? "text-danger" : "text-amber"}`}
            >
              {alta ? <TriangleAlert size={18} /> : <Clock size={18} />}
            </span>
            <div>
              <p
                className={`text-sm font-semibold ${
                  alta ? "text-red-800" : "text-amber-800"
                }`}
              >
                {alert.titulo}
              </p>
              <p
                className={`mt-0.5 text-xs ${
                  alta ? "text-red-700/80" : "text-amber-700/80"
                }`}
              >
                {alert.detalhe}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
