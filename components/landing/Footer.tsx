import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const columns = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "/#funcionalidades" },
      { label: "Preços", href: "/precos" },
      { label: "Demonstração", href: "/demo" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Conformidade",
    links: [
      { label: "Boletins AIMA", href: "/#funcionalidades" },
      { label: "Taxa turística", href: "/#funcionalidades" },
      { label: "Relatórios INE", href: "/#funcionalidades" },
      { label: "Check-in digital", href: "/#funcionalidades" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de utilização", href: "/#" },
      { label: "Política de privacidade", href: "/#" },
      { label: "RGPD", href: "/#" },
      { label: "Livro de reclamações", href: "/#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-white">
                <ShieldCheck size={18} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-navy">
                Aloja
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Conformidade automática para Alojamento Local: boletins AIMA,
              taxa turística e relatórios INE sem dores de cabeça.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-navy">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 transition-colors hover:text-navy"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © 2026 Aloja · Feito em Portugal 🇵🇹
          </p>
          <p className="text-xs text-slate-400">
            A Aloja não presta aconselhamento jurídico. Modo demonstração com
            dados fictícios.
          </p>
        </div>
      </div>
    </footer>
  );
}
