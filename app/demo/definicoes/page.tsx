"use client";

import { useState } from "react";
import { Bell, CircleCheck, CreditCard, Mail, Smartphone, User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-semibold text-navy">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-teal" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function DefinicoesPage() {
  const [emailBoletins, setEmailBoletins] = useState(true);
  const [emailTaxa, setEmailTaxa] = useState(true);
  const [emailIne, setEmailIne] = useState(true);
  const [smsUrgente, setSmsUrgente] = useState(true);
  const [smsResumo, setSmsResumo] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Definições
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Conta, notificações e faturação
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Perfil */}
        <Card>
          <CardHeader title="Perfil" subtitle="Dados do anfitrião" />
          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white">
                <User size={24} />
              </span>
              <div>
                <p className="text-sm font-bold text-navy">Maria Fonseca</p>
                <p className="text-xs text-slate-500">
                  Anfitriã desde março de 2024
                </p>
              </div>
            </div>
            <Input id="perfil-nome" label="Nome" defaultValue="Maria Fonseca" />
            <Input
              id="perfil-email"
              label="Email"
              type="email"
              defaultValue="maria.fonseca@exemplo.pt"
            />
            <Input
              id="perfil-telefone"
              label="Telemóvel"
              type="tel"
              defaultValue="+351 912 345 678"
            />
            <Input
              id="perfil-nif"
              label="NIF"
              defaultValue="245 678 901"
            />
            <Button
              className="self-start"
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
            >
              Guardar alterações
            </Button>
            {saved && (
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <CircleCheck size={15} />
                Alterações guardadas (demonstração)
              </p>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          {/* Notificações */}
          <Card>
            <CardHeader
              title="Notificações"
              subtitle="Alertas antes dos prazos legais"
            />
            <div className="p-5 sm:p-6">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <Mail size={13} /> Email
              </p>
              <div className="divide-y divide-slate-100">
                <Toggle
                  checked={emailBoletins}
                  onChange={setEmailBoletins}
                  label="Boletins por enviar"
                  description="48h e 24h antes do fim do prazo de 3 dias úteis"
                />
                <Toggle
                  checked={emailTaxa}
                  onChange={setEmailTaxa}
                  label="Taxa turística"
                  description="Lembrete da entrega mensal ao município"
                />
                <Toggle
                  checked={emailIne}
                  onChange={setEmailIne}
                  label="Relatório INE"
                  description="Lembrete do inquérito mensal"
                />
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <Smartphone size={13} /> SMS
              </p>
              <div className="divide-y divide-slate-100">
                <Toggle
                  checked={smsUrgente}
                  onChange={setSmsUrgente}
                  label="Alertas urgentes"
                  description="Boletins a menos de 24h de expirar"
                />
                <Toggle
                  checked={smsResumo}
                  onChange={setSmsResumo}
                  label="Resumo semanal"
                  description="Estado da conformidade todas as segundas-feiras"
                />
              </div>
            </div>
          </Card>

          {/* Faturação */}
          <Card>
            <CardHeader title="Faturação" subtitle="Plano e pagamento" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 rounded-xl border border-teal/20 bg-teal/5 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-navy">
                      Plano Profissional
                    </p>
                    <Badge tone="teal">Ativo</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    €59/mês · até 5 propriedades · renovação a 1 de julho de
                    2026
                  </p>
                </div>
                <Bell size={16} className="mt-1 shrink-0 text-teal" />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <CreditCard size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      Visa terminado em 4242
                    </p>
                    <p className="text-xs text-slate-400">Expira 04/2028</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Alterar
                </Button>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" size="sm" href="/precos">
                  Mudar de plano
                </Button>
                <Button variant="ghost" size="sm">
                  Transferir faturas
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
