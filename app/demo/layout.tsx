import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "Demonstração — Aloja",
  description:
    "Explore o painel de conformidade da Aloja com dados fictícios. Boletins AIMA, taxa turística e relatórios INE automáticos.",
};

export default function DemoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="pb-20 md:pb-0 md:pl-60">
        {/* Faixa de modo demonstração */}
        <div className="sticky top-0 z-20 flex items-center justify-center gap-2 bg-navy px-4 py-2 text-center">
          <Info size={14} className="shrink-0 text-teal" />
          <p className="text-xs font-medium text-white">
            Modo demonstração — dados fictícios.{" "}
            <Link href="/precos" className="font-semibold text-teal underline-offset-2 hover:underline">
              Criar conta grátis
            </Link>
          </p>
        </div>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
