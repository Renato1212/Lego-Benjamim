"use client";

import { useActionState } from "react";
import { CircleAlert, LoaderCircle, UserPlus } from "lucide-react";
import { criarHospede, type ActionResult } from "@/app/app/actions";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { COUNTRY_OPTIONS } from "@/lib/countries";

const DOC_OPTIONS = [
  { value: "PASSAPORTE", label: "Passaporte" },
  { value: "CC", label: "Cartão de Cidadão" },
  { value: "BI", label: "Bilhete de Identidade" },
  { value: "OUTRO", label: "Outro documento" },
];

export function NovoHospedeForm({
  properties,
}: {
  properties: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(criarHospede, null);

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Identificação
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="firstName"
            name="firstName"
            label="Nome próprio"
            placeholder="Ex.: Hans"
            required
          />
          <Input
            id="lastName"
            name="lastName"
            label="Apelido"
            placeholder="Ex.: Müller"
            required
          />
          <Select
            id="nationality"
            name="nationality"
            label="Nacionalidade"
            options={COUNTRY_OPTIONS}
            defaultValue="DEU"
          />
          <Input
            id="birthDate"
            name="birthDate"
            label="Data de nascimento"
            type="date"
            max={hoje}
            required
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Documento de identificação
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            id="documentType"
            name="documentType"
            label="Tipo de documento"
            options={DOC_OPTIONS}
            defaultValue="PASSAPORTE"
          />
          <Input
            id="documentNumber"
            name="documentNumber"
            label="N.º do documento"
            placeholder="Ex.: C01X00T47"
            required
          />
          <Select
            id="documentCountry"
            name="documentCountry"
            label="País emissor"
            options={COUNTRY_OPTIONS}
            defaultValue="DEU"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Residência
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="residenceCountry"
            name="residenceCountry"
            label="País de residência"
            options={COUNTRY_OPTIONS}
            defaultValue="DEU"
          />
          <Input
            id="residencePlace"
            name="residencePlace"
            label="Localidade de residência (opcional)"
            placeholder="Ex.: Berlim"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Estadia
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            id="propertyId"
            name="propertyId"
            label="Propriedade"
            options={properties.map((p) => ({ value: p.id, label: p.name }))}
          />
          <Input
            id="checkIn"
            name="checkIn"
            label="Check-in"
            type="date"
            defaultValue={hoje}
            required
          />
          <Input
            id="checkOut"
            name="checkOut"
            label="Check-out"
            type="date"
            required
          />
        </div>
      </div>

      <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
        Ao registar, a Aloja cria o boletim de alojamento deste hóspede. Pode
        depois submetê-lo ao SIBA com um clique (ou descarregar o XML para
        submissão manual). Prazo legal: 3 dias úteis após o check-in.
      </p>

      {state && !state.ok && (
        <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <CircleAlert size={16} className="mt-0.5 shrink-0" />
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button href="/app/hospedes" variant="secondary">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <UserPlus size={16} />
          )}
          {isPending ? "A registar…" : "Registar hóspede"}
        </Button>
      </div>
    </form>
  );
}
