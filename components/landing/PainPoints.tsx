import { TriangleAlert, FileX, Landmark } from "lucide-react";

const pains = [
  {
    icon: TriangleAlert,
    title: "Comunicação AIMA em falta",
    fine: "Coima até €2.000 por hóspede",
    text: "Cada hóspede estrangeiro tem de ser comunicado à AIMA no prazo de 3 dias úteis após o check-in. Um esquecimento numa semana cheia pode custar milhares de euros.",
  },
  {
    icon: Landmark,
    title: "Taxa turística mal calculada",
    fine: "Coima + juros de mora",
    text: "Cada município tem regras diferentes — tarifas, limites de noites e isenções de menores. Calcular à mão em folhas de Excel é a receita perfeita para erros e correções fiscais.",
  },
  {
    icon: FileX,
    title: "Inquérito INE não entregue",
    fine: "Coimas que podem atingir €50.000 em incumprimento reiterado",
    text: "O inquérito mensal de estatísticas do turismo é obrigatório, mesmo sem hóspedes. A falta de resposta repetida é contraordenação prevista na lei do sistema estatístico nacional.",
  },
];

export function PainPoints() {
  return (
    <section className="bg-navy py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Três obrigações legais. Três formas de ser multado.
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Gerir um Alojamento Local em Portugal significa cumprir prazos
            apertados todos os meses. A fiscalização não perdoa esquecimentos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pains.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:bg-white/[0.08]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                <p.icon size={22} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{p.title}</h3>
              <p className="mt-1.5 text-sm font-semibold text-amber">{p.fine}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
