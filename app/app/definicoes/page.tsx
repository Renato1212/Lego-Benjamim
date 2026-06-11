import { redirect } from "next/navigation";
import { CalendarDays, MessageSquare, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PerfilForm } from "@/components/dashboard/PerfilForm";
import { formatDateTimePT } from "@/lib/guest-utils";

export const dynamic = "force-dynamic";

const PLAN_INFO: Record<string, { label: string; descricao: string }> = {
  TRIAL: {
    label: "Período de teste",
    descricao:
      "Acesso completo durante 14 dias. Durante a beta, o acesso mantém-se gratuito após o fim do teste.",
  },
  ANFITRIAO: {
    label: "Anfitrião",
    descricao: "1 propriedade · boletins ilimitados · taxa turística automática.",
  },
  PROFISSIONAL: {
    label: "Profissional",
    descricao: "Até 5 propriedades · multi-calendário · suporte prioritário.",
  },
  AGENCIA: {
    label: "Agência",
    descricao: "Propriedades ilimitadas · API · gestor de conta dedicado.",
  },
};

export default async function DefinicoesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");

  const [user, feedback] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        plan: true,
        trialEndsAt: true,
        createdAt: true,
      },
    }),
    db.feedback.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);
  if (!user) redirect("/entrar");

  const planInfo = PLAN_INFO[user.plan] ?? PLAN_INFO.TRIAL;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Definições
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Perfil, subscrição e histórico de feedback
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Perfil" subtitle="Dados do anfitrião" />
          <div className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white">
                <User size={24} />
              </span>
              <div>
                <p className="text-sm font-bold text-navy">{user.name}</p>
                <p className="text-xs text-slate-500">
                  Membro desde {formatDateTimePT(user.createdAt)}
                </p>
              </div>
            </div>
            <PerfilForm name={user.name} email={user.email} phone={user.phone} />
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Subscrição" subtitle="O seu plano atual" />
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-extrabold text-navy">
                  {planInfo.label}
                </p>
                {user.plan === "TRIAL" ? (
                  <Badge tone="teal">
                    <CalendarDays size={12} />
                    Até {formatDateTimePT(user.trialEndsAt)}
                  </Badge>
                ) : (
                  <Badge tone="success">Ativo</Badge>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {planInfo.descricao}
              </p>
              <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
                Durante a beta não é necessário cartão de crédito. Quando os
                planos pagos abrirem, será avisado por email com antecedência.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="O seu feedback"
              subtitle="Mensagens enviadas durante a beta"
            />
            {feedback.length === 0 ? (
              <p className="flex items-center gap-2 px-5 py-6 text-sm text-slate-400 sm:px-6">
                <MessageSquare size={16} />
                Ainda não enviou feedback. Use o botão «Feedback» no canto
                inferior direito — lemos tudo!
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 px-5 sm:px-6">
                {feedback.map((f) => (
                  <li key={f.id} className="py-3.5">
                    <p className="text-sm leading-relaxed text-slate-700">
                      {f.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDateTimePT(f.createdAt)}
                      {f.page ? ` · ${f.page}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
