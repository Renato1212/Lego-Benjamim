import { CalendarSync, ClipboardCheck, Send } from "lucide-react";

const steps = [
  {
    icon: CalendarSync,
    step: "1",
    title: "Ligue o seu calendário",
    text: "Cole o link iCal do Airbnb ou Booking.com. As reservas entram automaticamente na Aloja, sem inserção manual.",
  },
  {
    icon: ClipboardCheck,
    step: "2",
    title: "O hóspede faz check-in digital",
    text: "Antes de chegar, o hóspede recebe um link e preenche os dados obrigatórios no telemóvel — em 9 idiomas.",
  },
  {
    icon: Send,
    step: "3",
    title: "A Aloja trata da papelada",
    text: "Boletim enviado à AIMA, taxa turística calculada e relatório INE pré-preenchido. Recebe a confirmação de tudo.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal">
            Como funciona
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            A funcionar em menos de 10 minutos
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white shadow-lg shadow-navy/20">
                <s.icon size={28} />
              </div>
              <span className="mt-4 inline-block rounded-full bg-teal/10 px-3 py-0.5 text-xs font-bold text-teal-dark">
                Passo {s.step}
              </span>
              <h3 className="mt-3 text-lg font-bold text-navy">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        {/* Enquadramento de ROI */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/5 to-emerald-50 p-8 text-center sm:p-10">
          <p className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Uma única coima paga{" "}
            <span className="text-teal">5 anos de Aloja</span>.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Uma coima média de €2.000 da AIMA equivale a mais de 5 anos do plano
            Anfitrião. Por €29/mês, dorme descansado — e poupa horas de
            papelada todos os meses.
          </p>
        </div>
      </div>
    </section>
  );
}
