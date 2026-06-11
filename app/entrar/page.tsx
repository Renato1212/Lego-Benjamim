"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CircleAlert, CircleCheck, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function EntrarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registado = searchParams.get("registado") === "1";
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Email ou palavra-passe incorretos.");
        setLoading(false);
        return;
      }
      router.push(callbackUrl.startsWith("/app") ? callbackUrl : "/app");
      router.refresh();
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
        Iniciar sessão
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Aceda ao painel de conformidade do seu Alojamento Local.
      </p>

      {registado && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700">
          <CircleCheck size={16} className="mt-0.5 shrink-0" />
          Conta criada com sucesso. Inicie sessão para continuar.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="o.seu@email.pt"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          id="password"
          label="Palavra-passe"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            <CircleAlert size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
          {loading && <LoaderCircle size={18} className="animate-spin" />}
          {loading ? "A iniciar sessão…" : "Iniciar sessão"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Ainda não tem conta?{" "}
        <Link
          href="/registar"
          className="font-semibold text-teal underline-offset-2 hover:underline"
        >
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal text-white">
            <ShieldCheck size={20} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-navy">
            Aloja
          </span>
        </Link>

        <Suspense fallback={null}>
          <EntrarForm />
        </Suspense>

        <p className="mt-5 text-center text-xs text-slate-400">
          Quer apenas espreitar?{" "}
          <Link
            href="/demo"
            className="font-semibold text-slate-500 underline-offset-2 hover:underline"
          >
            Ver demonstração sem conta
          </Link>
        </p>
      </div>
    </main>
  );
}
