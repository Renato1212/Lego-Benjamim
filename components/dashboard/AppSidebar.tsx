"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Building2,
  Landmark,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { terminarSessao } from "@/app/app/actions";

const navItems = [
  { href: "/app", label: "Painel", icon: LayoutDashboard },
  { href: "/app/hospedes", label: "Hóspedes", icon: Users },
  { href: "/app/taxa", label: "Taxa Turística", icon: Landmark },
  { href: "/app/propriedades", label: "Propriedades", icon: Building2 },
  { href: "/app/definicoes", label: "Definições", icon: Settings },
];

const planLabels: Record<string, string> = {
  TRIAL: "Período de teste",
  ANFITRIAO: "Plano Anfitrião",
  PROFISSIONAL: "Plano Profissional",
  AGENCIA: "Plano Agência",
};

export function AppSidebar({
  userName,
  plan,
}: {
  userName: string;
  plan: string;
}) {
  const pathname = usePathname();
  const [signingOut, startSignOut] = useTransition();

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  return (
    <>
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-200 bg-white md:flex">
        <Link
          href="/app"
          className="flex h-16 items-center gap-2 border-b border-slate-100 px-5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-white">
            <ShieldCheck size={18} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-navy">
            Aloja
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-navy text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-navy"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3.5">
            <p className="truncate text-xs font-semibold text-navy">{userName}</p>
            <p className="mt-1 text-xs text-slate-500">
              {planLabels[plan] ?? plan}
            </p>
            <button
              onClick={() => startSignOut(() => terminarSessao())}
              disabled={signingOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-navy disabled:opacity-60"
            >
              {signingOut ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                <LogOut size={14} />
              )}
              Terminar sessão
            </button>
          </div>
        </div>
      </aside>

      {/* Cabeçalho — mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
        <Link href="/app" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-white">
            <ShieldCheck size={15} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-navy">
            Aloja
          </span>
        </Link>
        <button
          onClick={() => startSignOut(() => terminarSessao())}
          disabled={signingOut}
          aria-label="Terminar sessão"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-navy disabled:opacity-60"
        >
          {signingOut ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : (
            <LogOut size={15} />
          )}
          Sair
        </button>
      </header>

      {/* Tabs inferiores — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
                  active ? "text-teal" : "text-slate-400"
                }`}
              >
                <item.icon size={19} />
                <span className="leading-none">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
