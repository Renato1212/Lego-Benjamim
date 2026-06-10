"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "A Aloja é legal? Substitui as minhas obrigações?",
    a: "A Aloja é uma ferramenta de automatização que o ajuda a cumprir as obrigações legais do Alojamento Local — a responsabilidade legal continua a ser sua, mas nós garantimos que nada falha: prazos, formatos e valores corretos, com registo de tudo o que foi entregue.",
  },
  {
    q: "Como funciona a ligação à AIMA?",
    a: "A Aloja gera os boletins de alojamento no formato exigido e acompanha o envio através do canal oficial de comunicação de hóspedes. Recebe a confirmação de cada boletim e alertas automáticos sempre que um prazo de 3 dias úteis estiver a aproximar-se do fim.",
  },
  {
    q: "Os meus dados e os dos meus hóspedes estão seguros?",
    a: "Sim. Todos os dados são encriptados em trânsito e em repouso, alojados em servidores na União Europeia, e tratados em conformidade com o RGPD. Os dados dos hóspedes são conservados apenas pelo período legalmente exigido e pode exportá-los ou eliminá-los a qualquer momento.",
  },
  {
    q: "Funciona com Airbnb e Booking.com?",
    a: "Sim. Basta colar o link iCal do seu anúncio no Airbnb, Booking.com ou outra plataforma e as reservas são importadas automaticamente. Também pode adicionar reservas diretas manualmente em segundos.",
  },
  {
    q: "Tenho propriedades em municípios diferentes. A taxa turística é calculada corretamente?",
    a: "Sim. A Aloja mantém as regras de cada município atualizadas — tarifas, número máximo de noites taxadas, épocas alta e baixa e isenções de menores — e aplica automaticamente as regras certas a cada propriedade.",
  },
  {
    q: "Posso cancelar a subscrição quando quiser?",
    a: "Sim, sem fidelização e sem penalizações. Pode cancelar diretamente nas definições da sua conta e mantém o acesso até ao fim do período já pago. Os seus dados ficam disponíveis para exportação durante 90 dias.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-navy sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 sm:px-6">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
