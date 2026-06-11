import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { FeedbackWidget } from "@/components/FeedbackWidget";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Painel — Aloja",
  description:
    "Painel de conformidade do seu Alojamento Local: boletins SIBA/AIMA, taxa turística e hóspedes.",
};

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, plan: true, trialEndsAt: true },
  });
  if (!user) redirect("/entrar");

  const diasRestantes = Math.max(
    0,
    Math.ceil((user.trialEndsAt.getTime() - Date.now()) / DAY_MS)
  );

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar userName={user.name} plan={user.plan} />

      <div className="pb-24 md:pb-0 md:pl-60">
        {user.plan === "TRIAL" && (
          <div className="flex items-center justify-center gap-2 bg-navy px-4 py-2 text-center">
            <Clock size={14} className="shrink-0 text-teal" />
            <p className="text-xs font-medium text-white">
              {diasRestantes > 0
                ? `Período de teste: ${diasRestantes} ${diasRestantes === 1 ? "dia restante" : "dias restantes"}.`
                : "O período de teste terminou — durante a beta pode continuar a usar a Aloja gratuitamente."}
            </p>
          </div>
        )}

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>

      <FeedbackWidget />
    </div>
  );
}
