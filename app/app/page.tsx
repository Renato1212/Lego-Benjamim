import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CircleCheck,
  Euro,
  KeyRound,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatEUR } from "@/lib/tax-rules";
import {
  formatDateTimePT,
  guestStayTax,
  nightsBetween,
} from "@/lib/guest-utils";
import { countryFlag } from "@/lib/countries";

export const dynamic = "force-dynamic";

function ChecklistItem({
  done,
  step,
  title,
  description,
  href,
  cta,
}: {
  done: boolean;
  step: number;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
        done ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
            done ? "bg-emerald-100 text-emerald-700" : "bg-navy/5 text-navy"
          }`}
        >
          {done ? <CircleCheck size={18} /> : step}
        </span>
        <div>
          <p className="text-sm font-bold text-navy">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
      </div>
      {!done && (
        <Button href={href} size="sm" variant="secondary" className="shrink-0 self-start sm:self-auto">
          {cta}
          <ArrowRight size={14} />
        </Button>
      )}
    </div>
  );
}

export default async function PainelPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");
  const userId = session.user.id;

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const nextMonthStart = new Date(
    Date.UTC(now.getFullYear(), now.getMonth() + 1, 1)
  );

  const [properties, guestsMonth, boletimCounts, recentGuests] =
    await Promise.all([
      db.property.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          municipality: true,
          sibaUnidade: true,
          sibaEstabelecimento: true,
          sibaChaveAcesso: true,
        },
      }),
      db.guest.findMany({
        where: {
          property: { userId },
          checkIn: { gte: monthStart, lt: nextMonthStart },
        },
        select: {
          birthDate: true,
          checkIn: true,
          checkOut: true,
          property: { select: { municipality: true } },
        },
      }),
      db.boletim.groupBy({
        by: ["status"],
        where: { guest: { property: { userId } } },
        _count: { _all: true },
      }),
      db.guest.findMany({
        where: { property: { userId } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          boletim: { select: { status: true } },
          property: { select: { name: true } },
        },
      }),
    ]);

  const counts: Record<string, number> = {};
  for (const row of boletimCounts) {
    counts[row.status] = row._count._all;
  }
  const submetidos = counts.SUBMETIDO ?? 0;
  const pendentes = (counts.PENDENTE ?? 0) + (counts.ERRO ?? 0);

  const taxaMes = guestsMonth.reduce((acc, g) => {
    const tax = guestStayTax(g.property.municipality, g);
    return acc + (tax?.total ?? 0);
  }, 0);

  const temPropriedade = properties.length > 0;
  const temCredenciaisSiba = properties.some(
    (p) => p.sibaUnidade && p.sibaEstabelecimento && p.sibaChaveAcesso
  );
  const temHospedes = recentGuests.length > 0;

  const mesLabel = now.toLocaleDateString("pt-PT", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Painel
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Visão geral da conformidade das suas propriedades — {mesLabel}
          </p>
        </div>
        {temHospedes && (
          <Button href="/app/hospedes/novo">
            <UserPlus size={16} />
            Registar hóspede
          </Button>
        )}
      </div>

      {!temHospedes ? (
        /* Onboarding — primeiro acesso */
        <div className="flex flex-col gap-4">
          <Card className="bg-gradient-to-br from-navy to-[#13315b] p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-white sm:text-xl">
              Bem-vindo à Aloja! 👋
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
              Três passos e o seu Alojamento Local fica em conformidade: a
              comunicação de hóspedes ao SIBA (AIMA) passa a ser feita a partir
              daqui, sem papelada.
            </p>
          </Card>

          <ChecklistItem
            done={temPropriedade}
            step={1}
            title="Adicione a sua propriedade"
            description="Nome, registo AL e município — usado para os boletins e para a taxa turística."
            href="/app/propriedades"
            cta="Adicionar propriedade"
          />
          <ChecklistItem
            done={temCredenciaisSiba}
            step={2}
            title="Configure as credenciais SIBA"
            description="Unidade hoteleira, estabelecimento e chave de acesso — obtidas no registo da sua conta em siba.sef.pt. Sem elas pode, mesmo assim, descarregar o XML e submetê-lo manualmente."
            href="/app/propriedades"
            cta="Configurar SIBA"
          />
          <ChecklistItem
            done={false}
            step={3}
            title="Registe o primeiro hóspede"
            description="Ao registar um hóspede, a Aloja prepara automaticamente o boletim de alojamento para submissão."
            href="/app/hospedes/novo"
            cta="Registar hóspede"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Hóspedes este mês"
              value={String(guestsMonth.length)}
              icon={Users}
              hint={`Check-in em ${mesLabel}`}
            />
            <StatCard
              label="Boletins submetidos"
              value={String(submetidos)}
              icon={CircleCheck}
              tone="success"
              hint="Entregues ao SIBA"
            />
            <StatCard
              label="Boletins pendentes"
              value={String(pendentes)}
              icon={TriangleAlert}
              tone={pendentes > 0 ? "warning" : "default"}
              hint={pendentes > 0 ? "Prazo legal: 3 dias úteis" : "Tudo em dia"}
            />
            <StatCard
              label="Taxa turística do mês"
              value={formatEUR(taxaMes)}
              icon={Euro}
              hint="Estimativa automática"
            />
          </div>

          {pendentes > 0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="flex items-start gap-2 text-sm font-medium text-amber-800">
                <TriangleAlert size={17} className="mt-0.5 shrink-0" />
                Tem {pendentes} {pendentes === 1 ? "boletim pendente" : "boletins pendentes"} de
                comunicação ao SIBA. O prazo legal é de 3 dias úteis após o
                check-in (coima até €2.000 por hóspede).
              </p>
              <Button href="/app/hospedes" size="sm" className="shrink-0 self-start sm:self-auto">
                Resolver agora
                <ArrowRight size={14} />
              </Button>
            </div>
          )}

          {!temCredenciaisSiba && (
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="flex items-start gap-2 text-sm text-slate-600">
                <KeyRound size={17} className="mt-0.5 shrink-0 text-teal" />
                Configure as credenciais SIBA da propriedade para submeter
                boletins diretamente a partir da Aloja.
              </p>
              <Button href="/app/propriedades" size="sm" variant="secondary" className="shrink-0 self-start sm:self-auto">
                Configurar
              </Button>
            </div>
          )}

          <Card>
            <CardHeader
              title="Últimos hóspedes"
              subtitle="Os 5 registos mais recentes"
              action={
                <Button href="/app/hospedes" variant="ghost" size="sm">
                  Ver todos
                </Button>
              }
            />
            <ul className="divide-y divide-slate-100 px-5 sm:px-6">
              {recentGuests.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between gap-3 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-xl">{countryFlag(g.nationality)}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy">
                        {g.firstName} {g.lastName}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {g.property.name} · {formatDateTimePT(g.checkIn)} ·{" "}
                        {nightsBetween(g.checkIn, g.checkOut)}{" "}
                        {nightsBetween(g.checkIn, g.checkOut) === 1 ? "noite" : "noites"}
                      </p>
                    </div>
                  </div>
                  {g.boletim?.status === "SUBMETIDO" ? (
                    <Badge tone="success">Submetido</Badge>
                  ) : g.boletim?.status === "ERRO" ? (
                    <Badge tone="danger">Erro</Badge>
                  ) : g.boletim?.status === "MANUAL" ? (
                    <Badge tone="neutral">Manual</Badge>
                  ) : (
                    <Badge tone="warning">Pendente</Badge>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
