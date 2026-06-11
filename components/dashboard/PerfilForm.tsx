"use client";

import { useActionState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { atualizarPerfil, type ActionResult } from "@/app/app/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function PerfilForm({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string | null;
}) {
  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(atualizarPerfil, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        id="perfil-nome"
        name="name"
        label="Nome"
        defaultValue={name}
        autoComplete="name"
        required
      />
      <Input
        id="perfil-email"
        label="Email (não alterável durante a beta)"
        type="email"
        defaultValue={email}
        disabled
      />
      <Input
        id="perfil-telefone"
        name="phone"
        label="Telemóvel (opcional)"
        type="tel"
        placeholder="+351 912 345 678"
        defaultValue={phone ?? ""}
        autoComplete="tel"
      />

      {state && (
        <p
          className={`flex items-center gap-2 text-sm font-medium ${
            state.ok ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {state.ok ? <CircleCheck size={15} /> : <CircleAlert size={15} />}
          {state.message}
        </p>
      )}

      <Button type="submit" className="self-start" disabled={isPending}>
        {isPending && <LoaderCircle size={15} className="animate-spin" />}
        {isPending ? "A guardar…" : "Guardar alterações"}
      </Button>
    </form>
  );
}
