import { redirect } from "next/navigation";
import { Info, Landmark } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MUNICIPALITIES, formatEUR } from "@/lib/tax-rules";
import {
  guestStayTax,
  isMunicipalityId,
  nightsBetween,
} from "@/lib/guest-utils";
import { countryFlag } from "@/lib/countries";

export const dynamic = "force-dynamic";

interface RowData {
  id: string;
  hospede: string;
  nationality: string;
  propriedade: string;
  noites: number;
  noitesTaxadas: number;
  isento: boolean;
  tarifa: number;
  total: number;
}

interface GroupData {
  key: string;
  mesLabel: string;
  municipio: string;
  rows: RowData[];
  total: number;
}

export default async function TaxaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");

  const guests = await db.guest.findMany({
    where: { property: { userId: session.user.id } },
    orderBy: { checkIn: "desc" },
    include: { property: { select: { name: true, municipality: true } } },
  });

  const groups = new Map<string, GroupData>();
  let semRegra = 0;

  for (const g of guests) {
    const municipality = g.property.municipality;
    if (!isMunicipalityId(municipality)) {
      semRegra += 1;
      continue;
    }
    const tax = guestStayTax(municipality, g);
    if (!tax) continue;

    const monthKey = `${g.checkIn.getUTCFullYear()}-${String(g.checkIn.getUTCMonth() + 1).padStart(2, "0")}`;
    const key = `${monthKey}|${municipality}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        mesLabel: g.checkIn.toLocaleDateString("pt-PT", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }),
        municipio: MUNICIPALITIES[municipality].nome,
        rows: [],
        total: 0,
      });
    }
    const group = groups.get(key)!;
    group.rows.push({
      id: g.id,
      hospede: `${g.firstName} ${g.lastName}`,
      nationality: g.nationality,
      propriedade: g.property.name,
      noites: nightsBetween(g.checkIn, g.checkOut),
      noitesTaxadas: tax.noitesTaxadas,
      isento: tax.hospedesTaxaveis === 0,
      tarifa: tax.tarifa,
      total: tax.total,
    });
    group.total += tax.total;
  }

  const sortedGroups = Array.from(groups.values()).sort((a, b) =>
    b.key.localeCompare(a.key)
  );
  const totalGeral = sortedGroups.reduce((acc, g) => acc + g.total, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Taxa Turística
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cálculo automático por mês e município, a partir dos hóspedes
          registados
        </p>
      </div>

      {semRegra > 0 && (
        <p className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <Info size={16} className="mt-0.5 shrink-0 text-teal" />
          {semRegra} {semRegra === 1 ? "hóspede está" : "hóspedes estão"} em
          propriedades de municípios sem regra automática (Outro). A Aloja
          calcula automaticamente para Lisboa, Porto, Cascais e Albufeira.
        </p>
      )}

      {sortedGroups.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal">
            <Landmark size={26} />
          </span>
          <p className="text-base font-bold text-navy">
            Sem estadias para calcular
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Assim que registar hóspedes em propriedades de Lisboa, Porto,
            Cascais ou Albufeira, a taxa turística aparece aqui calculada
            automaticamente.
          </p>
          <Button href="/app/hospedes/novo" className="mt-2">
            Registar hóspede
          </Button>
        </Card>
      ) : (
        <>
          <Card className="flex flex-col items-start justify-between gap-2 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total acumulado (todas as estadias registadas)
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-navy">
                {formatEUR(totalGeral)}
              </p>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-slate-400">
              Valor estimado a entregar ao(s) município(s). A entrega é mensal,
              através da plataforma de cada câmara municipal.
            </p>
          </Card>

          {sortedGroups.map((group) => (
            <Card key={group.key} className="overflow-hidden">
              <CardHeader
                title={`${group.mesLabel.charAt(0).toUpperCase()}${group.mesLabel.slice(1)} — ${group.municipio}`}
                subtitle={`${group.rows.length} ${group.rows.length === 1 ? "estadia" : "estadias"}`}
                action={
                  <span className="text-lg font-extrabold text-navy">
                    {formatEUR(group.total)}
                  </span>
                }
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {["Hóspede", "Noites taxadas", "Tarifa", "Valor"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-navy">
                            {countryFlag(row.nationality)} {row.hospede}
                          </p>
                          <p className="text-xs text-slate-400">
                            {row.propriedade}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600">
                          {row.isento ? (
                            <span className="text-xs font-semibold text-emerald-600">
                              Isento (menor de idade)
                            </span>
                          ) : (
                            <>
                              {row.noitesTaxadas}
                              {row.noites > row.noitesTaxadas && (
                                <span className="ml-1 text-xs text-slate-400">
                                  (de {row.noites})
                                </span>
                              )}
                            </>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600">
                          {row.isento ? "—" : `${formatEUR(row.tarifa)}/noite`}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-bold text-navy">
                          {formatEUR(row.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            {Object.values(MUNICIPALITIES).map((m) => (
              <Card key={m.id} className="p-5">
                <p className="text-sm font-bold text-navy">{m.descricao}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {m.notas.map((nota) => (
                    <li key={nota} className="text-xs leading-relaxed text-slate-500">
                      · {nota}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
