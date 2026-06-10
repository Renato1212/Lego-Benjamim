"use client";

import { useState } from "react";
import { CircleCheck, Clock, FileText, Send } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { INE_REPORTS, formatDatePT } from "@/lib/mock-data";

export default function RelatoriosPage() {
  const [submitted, setSubmitted] = useState(false);
  const current = INE_REPORTS[0];
  const history = INE_REPORTS.slice(1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Relatórios INE
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Inquérito mensal à permanência na hotelaria e outros alojamentos —
          pré-preenchido a partir das suas reservas
        </p>
      </div>

      {/* Relatório do mês corrente */}
      <Card className="overflow-hidden">
        <CardHeader
          title={`Relatório de ${current.mes}`}
          subtitle="Pronto a submeter · prazo: 8 de julho"
          action={
            submitted ? (
              <Badge tone="success">✓ Submetido</Badge>
            ) : (
              <Badge tone="warning">Por submeter</Badge>
            )
          }
        />
        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Dormidas</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-navy">
              {current.dormidas}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Hóspedes</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-navy">
              {current.hospedes}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Estadia média</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-navy">
              {current.estadiaMedia.toLocaleString("pt-PT")}{" "}
              <span className="text-base font-semibold text-slate-400">
                noites
              </span>
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Principais mercados
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {current.paisesTop.map((p) => (
                <div
                  key={p.pais}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-700">
                    {p.bandeira} {p.pais}
                  </span>
                  <span className="font-bold text-navy">{p.percentagem}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-md text-xs leading-relaxed text-slate-500">
            Os valores foram calculados automaticamente a partir das reservas
            das suas 2 propriedades. Reveja e submeta com um clique.
          </p>
          {submitted ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <CircleCheck size={16} />
              Submetido ao INE (demonstração)
            </p>
          ) : (
            <Button onClick={() => setSubmitted(true)}>
              <Send size={16} />
              Submeter ao INE
            </Button>
          )}
        </div>
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader
          title="Histórico de relatórios"
          subtitle="Relatórios entregues nos últimos meses"
        />
        <ul className="divide-y divide-slate-100">
          {history.map((report) => (
            <li
              key={report.id}
              className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10 text-teal">
                  <FileText size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{report.mes}</p>
                  <p className="text-xs text-slate-400">
                    {report.dormidas} dormidas · {report.hospedes} hóspedes ·
                    estadia média {report.estadiaMedia.toLocaleString("pt-PT")}{" "}
                    noites
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-12 sm:pl-0">
                {report.dataSubmissao && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    {formatDatePT(report.dataSubmissao)}
                  </span>
                )}
                <Badge tone="success">✓ Submetido</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
