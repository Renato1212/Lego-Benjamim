"use client";

import { motion } from "framer-motion";
import { ArrowRight, CircleCheck, Lock, MapPin, CirclePlay } from "lucide-react";
import { Button } from "@/components/ui/Button";

const trustItems = [
  { icon: Lock, label: "RGPD Conforme" },
  { icon: MapPin, label: "Dados alojados na UE" },
  { icon: CircleCheck, label: "Suporte em português" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,159,138,0.08),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-4 py-1.5 text-xs font-semibold text-teal-dark">
            Conformidade legal para Alojamento Local em Portugal
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Evite coimas até{" "}
            <span className="text-teal">€2.000 por hóspede</span>.
            Automatize a conformidade do seu Alojamento Local.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            A Aloja envia os boletins de alojamento à AIMA, calcula a taxa
            turística do seu município e pré-preenche o relatório INE — tudo a
            partir das suas reservas, sem papelada.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/demo" size="lg" className="w-full sm:w-auto">
              Experimentar 14 dias grátis
              <ArrowRight size={18} />
            </Button>
            <Button href="/demo" variant="secondary" size="lg" className="w-full sm:w-auto">
              <CirclePlay size={18} />
              Ver demonstração
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trustItems.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm"
              >
                <item.icon size={15} className="text-teal" />
                {item.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Pré-visualização do painel */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-navy/5">
            <div className="rounded-xl bg-slate-50 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Painel de conformidade
                  </p>
                  <p className="mt-1 text-lg font-bold text-navy sm:text-xl">
                    Junho 2026
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CircleCheck size={14} /> 94% conforme
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Hóspedes", value: "47" },
                  { label: "Boletins enviados", value: "45" },
                  { label: "Pendentes", value: "2", warn: true },
                  { label: "Taxa turística", value: "€312" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
                  >
                    <p
                      className={`text-xl font-extrabold sm:text-2xl ${
                        s.warn ? "text-amber" : "text-navy"
                      }`}
                    >
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
