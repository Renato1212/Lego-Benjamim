"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Landmark,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/demo", label: "Painel", icon: LayoutDashboard },
  { href: "/demo/hospedes", label: "Hóspedes", icon: Users },
  { href: "/demo/taxa", label: "Taxa Turística", icon: Landmark },
  { href: "/demo/relatorios", label: "Relatórios", icon: FileText },
  { href: "/demo/propriedades", label: "Propriedades", icon: Building2 },
  { href: "/demo/definicoes", label: "Definições", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/demo" ? pathname === "/demo" : pathname.startsWith(href);

  return (
    <>
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-200 bg-white md:flex">
        <Link href="/" className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
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
            <p className="text-xs font-semibold text-navy">Conta de demonstração</p>
            <p className="mt-1 text-xs text-slate-500">
              Plano Profissional · 2 propriedades
            </p>
          </div>
        </div>
      </aside>

      {/* Tabs inferiores — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-6">
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
