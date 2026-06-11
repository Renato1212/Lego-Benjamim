"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CircleAlert, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

const MUNICIPIOS = [
  { value: "lisboa", label: "Lisboa" },
  { value: "porto", label: "Porto" },
  { value: "cascais", label: "Cascais" },
  { value: "albufeira", label: "Albufeira" },
  { value: "outro", label: "Outro" },
];

export default function RegistarPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [alNumber, setAlNumber] = useState("");
  const [municipality, setMunicipality] = useState("lisboa");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/registar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          propertyName,
          alNumber,
          municipality,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.erro === "string"
            ? data.erro
            : "Não foi possível criar a conta. Tente novamente."
        );
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        // Conta criada mas sessão falhou — encaminhar para o login
        router.push("/entrar?registado=1");
        return;
      }
      router.push("/app");
      router.refresh();
    } catch {
      setError("Ocorreu um erro inesperado. Verifique a ligação e tente novamente.");
      setLoading(false);
    }
  }

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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
            Criar conta
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            14 dias grátis · Sem cartão de crédito · Cancele quando quiser
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input
              id="name"
              label="O seu nome"
              placeholder="Ex.: Maria Fonseca"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
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
              label="Palavra-passe (mínimo 8 caracteres)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <div className="mt-1 border-t border-slate-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                A sua propriedade
              </p>
            </div>
            <Input
              id="propertyName"
              label="Nome da propriedade"
              placeholder="Ex.: Apartamento Graça"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="alNumber"
                label="N.º de registo AL"
                placeholder="Ex.: 12345/AL"
                value={alNumber}
                onChange={(e) => setAlNumber(e.target.value)}
              />
              <Select
                id="municipality"
                label="Município"
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                options={MUNICIPIOS}
              />
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
              {loading && <LoaderCircle size={18} className="animate-spin" />}
              {loading ? "A criar conta…" : "Começar os 14 dias grátis"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Já tem conta?{" "}
            <Link
              href="/entrar"
              className="font-semibold text-teal underline-offset-2 hover:underline"
            >
              Iniciar sessão
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Ao criar conta aceita que os dados sejam tratados de acordo com o
          RGPD. Dados alojados na UE.
        </p>
      </div>
    </main>
  );
}
