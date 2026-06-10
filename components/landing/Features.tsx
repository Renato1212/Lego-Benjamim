import { ChartColumn, FileCheck, Landmark, Smartphone } from "lucide-react";

const features = [
  {
    icon: FileCheck,
    title: "Boletins de alojamento automáticos",
    text: "A Aloja gera e envia os boletins à AIMA assim que o hóspede faz check-in. Alertas por email e SMS antes de qualquer prazo expirar — nunca mais um boletim atrasado.",
  },
  {
    icon: Landmark,
    title: "Taxa turística por município",
    text: "Regras de Lisboa, Porto, Cascais, Albufeira e mais — tarifas, limites de noites e isenções de menores aplicados automaticamente. Guia de pagamento mensal gerada num clique.",
  },
  {
    icon: ChartColumn,
    title: "Relatórios INE pré-preenchidos",
    text: "Dormidas, hóspedes, países de origem e estadia média calculados a partir das suas reservas. O inquérito mensal fica pronto a submeter em segundos.",
  },
  {
    icon: Smartphone,
    title: "Check-in digital do hóspede",
    text: "O hóspede preenche os dados obrigatórios (nome, documento, nacionalidade, datas) no telemóvel antes de chegar. Sem formulários em papel, sem transcrições com erros.",
  },
];

export function Features() {
  return (
    <section id="funcionalidades" className="scroll-mt-20 bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal">
            Funcionalidades
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            A papelada toda, tratada num só lugar
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            A Aloja transforma as suas reservas em conformidade legal — sem
            Excel, sem portais confusos, sem noites mal dormidas.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <f.icon size={24} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
