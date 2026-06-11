import { redirect } from "next/navigation";
import {
  Building2,
  CircleCheck,
  KeyRound,
  MapPin,
  TriangleAlert,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  DeletePropertyButton,
  PropertyFormButton,
} from "@/components/dashboard/PropertyForm";
import { MUNICIPALITY_LABELS } from "@/lib/guest-utils";

export const dynamic = "force-dynamic";

const GRADIENTS = [
  "from-[#0B1F3A] to-[#0E9F8A]",
  "from-[#0E9F8A] to-[#38bdf8]",
  "from-[#13315b] to-[#0B1F3A]",
  "from-[#0c8473] to-[#0E9F8A]",
];

export default async function PropriedadesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");

  const properties = await db.property.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { guests: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Propriedades
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            As suas unidades de Alojamento Local e as credenciais SIBA
          </p>
        </div>
        <PropertyFormButton />
      </div>

      {properties.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal">
            <Building2 size={26} />
          </span>
          <p className="text-base font-bold text-navy">
            Ainda não adicionou nenhuma propriedade
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Adicione a sua unidade de AL para começar a registar hóspedes e a
            comunicar boletins ao SIBA.
          </p>
          <div className="mt-2">
            <PropertyFormButton />
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {properties.map((prop, i) => {
            const sibaConfigurado = Boolean(
              prop.sibaUnidade && prop.sibaEstabelecimento && prop.sibaChaveAcesso
            );
            return (
              <Card key={prop.id} className="overflow-hidden">
                <div
                  className={`flex h-28 items-end bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} p-5`}
                >
                  <div className="flex w-full items-end justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">{prop.name}</p>
                      <p className="flex items-center gap-1 text-xs text-white/80">
                        <MapPin size={12} />
                        {MUNICIPALITY_LABELS[prop.municipality] ?? prop.municipality}
                      </p>
                    </div>
                    {prop.alNumber && (
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                        {prop.alNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {prop.address ? (
                    <p className="text-sm text-slate-500">{prop.address}</p>
                  ) : (
                    <p className="text-sm italic text-slate-400">
                      Morada por preencher
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge tone="navy">
                      <Users size={12} /> {prop._count.guests}{" "}
                      {prop._count.guests === 1 ? "hóspede" : "hóspedes"}
                    </Badge>
                    {sibaConfigurado ? (
                      <Badge tone="success">
                        <CircleCheck size={12} /> SIBA configurado
                      </Badge>
                    ) : (
                      <Badge tone="warning">
                        <TriangleAlert size={12} /> SIBA por configurar
                      </Badge>
                    )}
                  </div>

                  {!sibaConfigurado && (
                    <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-500">
                      <KeyRound size={14} className="mt-0.5 shrink-0 text-teal" />
                      Adicione a Unidade Hoteleira, o Estabelecimento e a Chave
                      de Acesso (obtidos no registo em siba.sef.pt) para
                      submeter boletins automaticamente.
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <PropertyFormButton
                      property={{
                        id: prop.id,
                        name: prop.name,
                        alNumber: prop.alNumber,
                        municipality: prop.municipality,
                        address: prop.address,
                        sibaUnidade: prop.sibaUnidade,
                        sibaEstabelecimento: prop.sibaEstabelecimento,
                        sibaChaveAcesso: prop.sibaChaveAcesso,
                      }}
                    />
                    <DeletePropertyButton
                      propertyId={prop.id}
                      guestCount={prop._count.guests}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
