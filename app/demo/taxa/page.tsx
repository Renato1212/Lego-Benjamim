"use client";

import { useMemo, useState } from "react";
import { CircleCheck, Download, Info } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TAX_STAYS } from "@/lib/mock-data";
import {
  MUNICIPALITIES,
  calculateStayTax,
  formatEUR,
  type MunicipalityId,
} from "@/lib/tax-rules";

const municipalityIds: MunicipalityId[] = [
  "lisboa",
  "porto",
  "cascais",
  "albufeira",
];

export default function TaxaPage() {
  const [selected, setSelected] = useState<MunicipalityId>("lisboa");
  const [generated, setGenerated] = useState(false);

  const rule = MUNICIPALITIES[selected];

  const rows = useMemo(() => {
    return TAX_STAYS.filter((s) => s.municipio === selected).map((stay) => {
      const idades = [
        ...Array.from({ length: stay.adultos }, () => 30),
        ...Array.from({ length: stay.criancas }, () => 8),
      ];
      const result = calculateStayTax(selected, {
        checkIn: new Date(stay.checkIn + "T00:00:00"),
        idadesHospedes: idades,
        noites: stay.noites,
      });
      return { stay, result };
    });
  }, [selected]);

  const total = rows.reduce((acc, r) => acc + r.result.total, 0);
  const totalIsentos = rows.reduce((acc, r) => acc + r.result.hospedesIsentos, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Taxa Turística
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cálculo automático por município · período: maio–junho 2026
        </p>
      </div>

      {/* Seletor de município */}
      <div className="flex flex-wrap gap-2">
        {municipalityIds.map((id) => (
          <button
            key={id}
            onClick={() => {
              setSelected(id);
              setGenerated(false);
            }}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              selected === id
                ? "border-navy bg-navy text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-navy"
            }`}
          >
            {MUNICIPALITIES[id].nome}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Tabela de cálculo */}
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader
            title={`Estadias taxáveis — ${rule.nome}`}
            subtitle={`${rows.length} estadias no período`}
          />
          {rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {["Hóspede", "Noites taxadas", "Taxáveis", "Isentos", "Tarifa", "Valor"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ stay, result }) => (
                    <tr
                      key={stay.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-navy">
                          {stay.bandeira} {stay.hospede}
                        </p>
                        <p className="text-xs text-slate-400">{stay.propriedade}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {result.noitesTaxadas}
                        {stay.noites > result.noitesTaxadas && (
                          <span className="ml-1 text-xs text-slate-400">
                            (de {stay.noites})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {result.hospedesTaxaveis}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {result.hospedesIsentos > 0 ? (
                          <span className="font-medium text-teal">
                            {result.hospedesIsentos}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {formatEUR(result.tarifa)}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-navy">
                        {formatEUR(result.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50">
                    <td
                      colSpan={5}
                      className="px-4 py-3.5 text-sm font-bold text-navy"
                    >
                      Total a entregar ao município
                    </td>
                    <td className="px-4 py-3.5 text-base font-extrabold text-teal">
                      {formatEUR(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="px-5 py-12 text-center text-sm text-slate-400">
              Sem estadias registadas em {rule.nome} neste período. Adicione uma
              propriedade neste município para começar a calcular.
            </p>
          )}
        </Card>

        {/* Resumo e regras */}
        <div className="flex flex-col gap-4">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total a entregar
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-navy">
              {formatEUR(total)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {totalIsentos > 0
                ? `Inclui ${totalIsentos} ${totalIsentos === 1 ? "menor isento" : "menores isentos"} de taxa`
                : "Sem isenções aplicadas no período"}
            </p>
            <Button
              className="mt-5 w-full"
              onClick={() => setGenerated(true)}
              disabled={rows.length === 0}
            >
              <Download size={16} />
              Gerar guia de pagamento
            </Button>
            {generated && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700">
                <CircleCheck size={14} className="mt-0.5 shrink-0" />
                Guia de pagamento gerada (demonstração). Na versão completa,
                recebe o PDF pronto a submeter no portal municipal.
              </p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-teal" />
              <h3 className="text-sm font-bold text-navy">
                Regras — {rule.nome}
              </h3>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {rule.notas.map((nota) => (
                <li
                  key={nota}
                  className="flex items-start gap-2 text-xs leading-relaxed text-slate-600"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal" />
                  {nota}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
