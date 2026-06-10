import { Fragment } from "react";
import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PricingCards } from "@/components/landing/Pricing";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Preços — Aloja",
  description:
    "Planos a partir de €29/mês. 14 dias grátis, sem cartão de crédito. Boletins AIMA, taxa turística e relatórios INE automáticos.",
};

type CellValue = boolean | string;

const comparison: {
  categoria: string;
  linhas: { nome: string; valores: [CellValue, CellValue, CellValue] }[];
}[] = [
  {
    categoria: "Propriedades e reservas",
    linhas: [
      { nome: "Propriedades incluídas", valores: ["1", "Até 5", "Ilimitadas"] },
      { nome: "Sincronização iCal (Airbnb)", valores: [true, true, true] },
      { nome: "Sincronização iCal (Booking.com)", valores: [false, true, true] },
      { nome: "Reservas diretas manuais", valores: [true, true, true] },
    ],
  },
  {
    categoria: "Conformidade",
    linhas: [
      { nome: "Boletins de alojamento (AIMA)", valores: ["Ilimitados", "Ilimitados", "Ilimitados"] },
      { nome: "Taxa turística por município", valores: [true, true, true] },
      { nome: "Relatórios INE pré-preenchidos", valores: [true, true, true] },
      { nome: "Check-in digital do hóspede", valores: [true, true, true] },
      { nome: "Alertas de prazos por email", valores: [true, true, true] },
      { nome: "Alertas por SMS", valores: [false, true, true] },
    ],
  },
  {
    categoria: "Gestão e equipa",
    linhas: [
      { nome: "Faturação integrada", valores: [false, true, true] },
      { nome: "Utilizadores por conta", valores: ["1", "3", "Ilimitados"] },
      { nome: "Permissões por função", valores: [false, false, true] },
      { nome: "Acesso à API", valores: [false, false, true] },
    ],
  },
  {
    categoria: "Suporte",
    linhas: [
      { nome: "Suporte por email", valores: [true, true, true] },
      { nome: "Suporte prioritário", valores: [false, true, true] },
      { nome: "Gestor de conta dedicado", valores: [false, false, true] },
      { nome: "Onboarding assistido", valores: [false, false, true] },
    ],
  },
];

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return <Check size={16} className="mx-auto text-teal" />;
  }
  if (value === false) {
    return <Minus size={16} className="mx-auto text-slate-300" />;
  }
  return <span className="text-xs font-semibold text-navy sm:text-sm">{value}</span>;
}

export default function PrecosPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-white pb-16 pt-16 sm:pt-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-teal">
                Preços
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
                Planos simples, sem surpresas
              </h1>
              <p className="mt-4 text-base text-slate-600 sm:text-lg">
                14 dias grátis em todos os planos · Sem cartão de crédito ·
                Cancele quando quiser
              </p>
            </div>
            <div className="mt-12">
              <PricingCards compact />
            </div>
          </div>
        </section>

        <section className="bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Comparação detalhada
            </h2>

            <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-4 text-sm font-bold text-navy">
                      Funcionalidade
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-navy">
                      Anfitrião
                      <span className="block text-xs font-medium text-slate-400">
                        €29/mês
                      </span>
                    </th>
                    <th className="bg-teal/5 px-4 py-4 text-center text-sm font-bold text-teal-dark">
                      Profissional
                      <span className="block text-xs font-medium text-slate-400">
                        €59/mês
                      </span>
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-navy">
                      Agência
                      <span className="block text-xs font-medium text-slate-400">
                        €149/mês
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((grupo) => (
                    <Fragment key={grupo.categoria}>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td
                          colSpan={4}
                          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-500"
                        >
                          {grupo.categoria}
                        </td>
                      </tr>
                      {grupo.linhas.map((linha) => (
                        <tr
                          key={linha.nome}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            {linha.nome}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <Cell value={linha.valores[0]} />
                          </td>
                          <td className="bg-teal/5 px-4 py-3.5 text-center">
                            <Cell value={linha.valores[1]} />
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <Cell value={linha.valores[2]} />
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <h3 className="text-xl font-extrabold text-navy sm:text-2xl">
                Ainda com dúvidas?
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 sm:text-base">
                Experimente a demonstração com dados fictícios — sem registo,
                sem cartão de crédito — e veja a Aloja a funcionar.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/demo" size="lg">
                  Ver demonstração
                </Button>
                <Button href="/#faq" variant="secondary" size="lg">
                  Ler as FAQ
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
