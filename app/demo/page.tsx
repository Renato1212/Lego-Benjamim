import {
  CircleCheck,
  Euro,
  FileText,
  RefreshCw,
  Send,
  Smartphone,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { ComplianceRing } from "@/components/dashboard/ComplianceRing";
import { AlertsList } from "@/components/dashboard/AlertsList";
import {
  DASHBOARD_STATS,
  OCCUPANCY_CHART,
  RECENT_ACTIVITY,
  URGENT_ALERTS,
} from "@/lib/mock-data";

const activityIcons = {
  boletim: Send,
  checkin: Smartphone,
  taxa: Euro,
  ine: FileText,
  sync: RefreshCw,
} as const;

export default function PainelPage() {
  const stats = DASHBOARD_STATS;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Painel
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Visão geral da conformidade das suas propriedades — junho 2026
        </p>
      </div>

      {/* Pontuação + estatísticas */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-3 p-6 lg:row-span-2">
          <ComplianceRing score={stats.complianceScore} />
          <div className="text-center">
            <p className="text-sm font-bold text-navy">
              Pontuação de conformidade
            </p>
            <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-500">
              2 boletins pendentes impedem os 100%. Resolva os alertas abaixo
              para ficar totalmente conforme.
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatCard
            label="Hóspedes este mês"
            value={String(stats.hospedesMes)}
            icon={Users}
            hint="+12% vs. maio"
          />
          <StatCard
            label="Boletins enviados"
            value={String(stats.boletinsEnviados)}
            icon={CircleCheck}
            tone="success"
            hint="Confirmados pela AIMA"
          />
          <StatCard
            label="Boletins pendentes"
            value={String(stats.boletinsPendentes)}
            icon={TriangleAlert}
            tone="warning"
            hint="A expirar em 24–48h"
          />
          <StatCard
            label="Taxa turística acumulada"
            value="€312"
            icon={Euro}
            hint="A entregar até 15 jul"
          />
        </div>

        {/* Ocupação mensal */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Ocupação mensal"
            subtitle="Média das 2 propriedades · últimos 6 meses"
          />
          <div className="flex items-end justify-between gap-2 px-5 pb-5 pt-4 sm:gap-4 sm:px-6">
            {OCCUPANCY_CHART.map((bar) => (
              <div key={bar.mes} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold text-navy">
                  {bar.percentagem}%
                </span>
                <div className="flex h-28 w-full max-w-12 items-end rounded-lg bg-slate-100 sm:h-32">
                  <div
                    className={`w-full rounded-lg ${
                      bar.mes === "Jun" ? "bg-teal" : "bg-navy/20"
                    }`}
                    style={{ height: `${bar.percentagem}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {bar.mes}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Alertas urgentes */}
        <Card>
          <CardHeader
            title="Alertas urgentes"
            subtitle="Prazos a precisar da sua atenção"
          />
          <div className="p-5 sm:p-6">
            <AlertsList alerts={URGENT_ALERTS} />
          </div>
        </Card>

        {/* Atividade recente */}
        <Card>
          <CardHeader
            title="Atividade recente"
            subtitle="Últimas ações automáticas da Aloja"
          />
          <ul className="divide-y divide-slate-100 px-5 sm:px-6">
            {RECENT_ACTIVITY.map((item) => {
              const Icon = activityIcons[item.tipo];
              return (
                <li key={item.id} className="flex items-start gap-3 py-3.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                    <Icon size={15} />
                  </span>
                  <div>
                    <p className="text-sm text-slate-700">{item.texto}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.quando}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
