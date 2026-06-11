import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NovoHospedeForm } from "@/components/dashboard/NovoHospedeForm";

export const dynamic = "force-dynamic";

export default async function NovoHospedePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");

  const properties = await db.property.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/app/hospedes"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy"
        >
          <ArrowLeft size={14} />
          Voltar aos hóspedes
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Registar hóspede
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Dados obrigatórios para o boletim de alojamento (SIBA/AIMA)
        </p>
      </div>

      {properties.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal">
            <Building2 size={26} />
          </span>
          <p className="text-base font-bold text-navy">
            Primeiro, adicione uma propriedade
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Cada hóspede tem de estar associado a uma propriedade — é a partir
            dela que o boletim é comunicado ao SIBA.
          </p>
          <Button href="/app/propriedades" className="mt-2">
            Adicionar propriedade
          </Button>
        </Card>
      ) : (
        <NovoHospedeForm properties={properties} />
      )}
    </div>
  );
}
