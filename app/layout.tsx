import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aloja — Conformidade automática para Alojamento Local",
  description:
    "Boletins de alojamento AIMA, taxa turística municipal e relatórios INE — tudo automático. Evite coimas até €2.000 por hóspede e poupe horas de papelada todos os meses.",
  keywords: [
    "alojamento local",
    "AIMA",
    "SEF",
    "boletim de alojamento",
    "taxa turística",
    "INE",
    "conformidade",
    "AL",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
