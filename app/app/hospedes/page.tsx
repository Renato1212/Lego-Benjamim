import { redirect } from "next/navigation";
import { CircleCheck, UserPlus, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BoletinsBulkActions,
  HospedeRowActions,
} from "@/components/dashboard/HospedeActions";
import { countryFlag } from "@/lib/countries";
import { formatDateTimePT, nightsBetween } from "@/lib/guest-utils";
import type { BoletimStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const DOC_LABELS: Record<string, string> = {
  PASSAPORTE: "Passaporte",
  BI: "BI",
  CC: "Cartão de Cidadão",
  OUTRO: "Outro documento",
};

function StatusBadge({
  status,
  submittedAt,
  errorMessage,
}: {
  status: BoletimStatus | undefined;
  submittedAt: Date | null | undefined;
  errorMessage: string | null | undefined;
}) {
  if (status === "SUBMETIDO") {
    return (
      <Badge tone="success">
        ✓ Submetido{submittedAt ? ` · ${formatDateTimePT(submittedAt)}` : ""}
      </Badge>
    );
  }
  if (status === "ERRO") {
    return (
      <span title={errorMessage ?? "Erro na submissão ao SIBA"}>
        <Badge tone="danger">✗ Erro</Badge>
      </span>
    );
  }
  if (status === "MANUAL") {
    return (
      <span title="XML descarregado para submissão manual em siba.sef.pt">
        <Badge tone="neutral">⬇ Manual</Badge>
      </span>
    );
  }
  return <Badge tone="warning">⚠ Pendente</Badge>;
}

export default async function HospedesPage({
  searchParams,
}: {
  searchParams: Promise<{ registado?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");
  const userId = session.user.id;
  const { registado } = await searchParams;

  const guests = await db.guest.findMany({
    where: { property: { userId } },
    orderBy: { checkIn: "desc" },
    include: {
      boletim: true,
      property: { select: { id: true, name: true } },
    },
  });

  const pendentes = guests.filter(
    (g) => g.boletim?.status === "PENDENTE" || g.boletim?.status === "ERRO"
  );
  const propriedadesComPendentes = Array.from(
    new Map(pendentes.map((g) => [g.property.id, g.property])).values()
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Hóspedes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Registo de hóspedes e estado dos boletins de alojamento (SIBA/AIMA)
          </p>
        </div>
        <Button href="/app/hospedes/novo">
          <UserPlus size={16} />
          Novo hóspede
        </Button>
      </div>

      {registado === "1" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CircleCheck size={16} />
          Hóspede registado. O boletim de alojamento está pronto para submissão
          ao SIBA.
        </div>
      )}

      <BoletinsBulkActions
        pendentes={pendentes.length}
        propriedadesComPendentes={propriedadesComPendentes}
      />

      {guests.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal">
            <Users size={26} />
          </span>
          <p className="text-base font-bold text-navy">
            Ainda não registou nenhum hóspede
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Registe o primeiro hóspede para a Aloja preparar o boletim de
            alojamento e o comunicar ao SIBA dentro do prazo legal.
          </p>
          <Button href="/app/hospedes/novo" className="mt-2">
            <UserPlus size={16} />
            Registar o primeiro hóspede
          </Button>
        </Card>
      ) : (
        <>
          {/* Tabela — desktop */}
          <Card className="hidden overflow-hidden lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {["Hóspede", "Propriedade", "Check-in", "Check-out", "Noites", "Boletim", "Ações"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {countryFlag(g.nationality)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-navy">
                            {g.firstName} {g.lastName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {DOC_LABELS[g.documentType]} {g.documentNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {g.property.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDateTimePT(g.checkIn)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDateTimePT(g.checkOut)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {nightsBetween(g.checkIn, g.checkOut)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={g.boletim?.status}
                        submittedAt={g.boletim?.submittedAt}
                        errorMessage={g.boletim?.errorMessage}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <HospedeRowActions
                        guestId={g.id}
                        status={g.boletim?.status ?? "PENDENTE"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Cartões — mobile */}
          <div className="flex flex-col gap-3 lg:hidden">
            {guests.map((g) => (
              <Card key={g.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{countryFlag(g.nationality)}</span>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {g.firstName} {g.lastName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {DOC_LABELS[g.documentType]} {g.documentNumber}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={g.boletim?.status}
                    submittedAt={g.boletim?.submittedAt}
                    errorMessage={g.boletim?.errorMessage}
                  />
                </div>
                {g.boletim?.status === "ERRO" && g.boletim.errorMessage && (
                  <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-700">
                    {g.boletim.errorMessage}
                  </p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <p>
                    <span className="font-semibold text-slate-600">
                      Propriedade:
                    </span>{" "}
                    {g.property.name}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-600">Noites:</span>{" "}
                    {nightsBetween(g.checkIn, g.checkOut)}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-600">
                      Check-in:
                    </span>{" "}
                    {formatDateTimePT(g.checkIn)}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-600">
                      Check-out:
                    </span>{" "}
                    {formatDateTimePT(g.checkOut)}
                  </p>
                </div>
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                  <HospedeRowActions
                    guestId={g.id}
                    status={g.boletim?.status ?? "PENDENTE"}
                  />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
