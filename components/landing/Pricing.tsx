import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface Tier {
  nome: string;
  preco: number;
  descricao: string;
  destaque?: boolean;
  funcionalidades: string[];
}

export const TIERS: Tier[] = [
  {
    nome: "Anfitrião",
    preco: 29,
    descricao: "Para quem gere uma propriedade e quer dormir descansado.",
    funcionalidades: [
      "1 propriedade",
      "Boletins de alojamento ilimitados",
      "Taxa turística automática",
      "Relatórios INE pré-preenchidos",
      "Check-in digital do hóspede",
      "Alertas de prazos por email",
    ],
  },
  {
    nome: "Profissional",
    preco: 59,
    descricao: "Para anfitriões com várias propriedades em diferentes municípios.",
    destaque: true,
    funcionalidades: [
      "Até 5 propriedades",
      "Tudo do plano Anfitrião",
      "Multi-calendário (Airbnb + Booking)",
      "Faturação integrada",
      "Alertas por email e SMS",
      "Suporte prioritário",
    ],
  },
  {
    nome: "Agência",
    preco: 149,
    descricao: "Para empresas de gestão de AL com carteiras grandes.",
    funcionalidades: [
      "Propriedades ilimitadas",
      "Tudo do plano Profissional",
      "Acesso à API",
      "Múltiplos utilizadores e permissões",
      "Gestor de conta dedicado",
      "Onboarding assistido",
    ],
  },
];

export function PricingCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <div
          key={tier.nome}
          className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm ${
            tier.destaque
              ? "border-teal shadow-lg shadow-teal/10 lg:-translate-y-2"
              : "border-slate-200"
          }`}
        >
          {tier.destaque && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              Mais popular
            </span>
          )}
          <h3 className="text-lg font-bold text-navy">{tier.nome}</h3>
          <p className="mt-1 text-sm text-slate-500">{tier.descricao}</p>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-navy">
              €{tier.preco}
            </span>
            <span className="text-sm font-medium text-slate-500">/mês</span>
          </div>
          <ul className="mt-6 flex flex-1 flex-col gap-3">
            {tier.funcionalidades.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                <Check size={16} className="mt-0.5 shrink-0 text-teal" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            href="/demo"
            variant={tier.destaque ? "primary" : "secondary"}
            className="mt-7 w-full"
          >
            Começar grátis
          </Button>
          {!compact && (
            <p className="mt-3 text-center text-xs text-slate-400">
              14 dias grátis · Sem cartão de crédito · Cancele quando quiser
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function Pricing() {
  return (
    <section id="precos" className="scroll-mt-20 bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal">
            Preços
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Menos do que uma noite de estadia. Muito menos do que uma coima.
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Todos os planos incluem 14 dias grátis, sem cartão de crédito.
            Cancele quando quiser.
          </p>
        </div>

        <div className="mt-14">
          <PricingCards />
        </div>
      </div>
    </section>
  );
}
