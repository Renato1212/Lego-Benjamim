"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import {
  eliminarPropriedade,
  guardarPropriedade,
  type ActionResult,
} from "@/app/app/actions";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

const MUNICIPIOS = [
  { value: "lisboa", label: "Lisboa" },
  { value: "porto", label: "Porto" },
  { value: "cascais", label: "Cascais" },
  { value: "albufeira", label: "Albufeira" },
  { value: "outro", label: "Outro" },
];

export interface PropertyFormData {
  id: string;
  name: string;
  alNumber: string;
  municipality: string;
  address: string;
  sibaUnidade: string | null;
  sibaEstabelecimento: string | null;
  sibaChaveAcesso: string | null;
}

export function PropertyFormButton({
  property,
}: {
  property?: PropertyFormData;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(guardarPropriedade, null);

  useEffect(() => {
    if (state?.ok) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  const isEdit = Boolean(property);

  return (
    <>
      {isEdit ? (
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          <Pencil size={14} />
          Editar
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          Adicionar propriedade
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={isEdit ? "Editar propriedade" : "Adicionar propriedade"}
      >
        <form action={formAction} className="flex flex-col gap-4">
          {property && <input type="hidden" name="id" value={property.id} />}

          <Input
            id="prop-name"
            name="name"
            label="Nome da propriedade"
            placeholder="Ex.: Apartamento Graça"
            defaultValue={property?.name ?? ""}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="prop-al"
              name="alNumber"
              label="N.º de registo AL"
              placeholder="Ex.: 12345/AL"
              defaultValue={property?.alNumber ?? ""}
            />
            <Select
              id="prop-municipality"
              name="municipality"
              label="Município"
              options={MUNICIPIOS}
              defaultValue={property?.municipality ?? "lisboa"}
            />
          </div>
          <Input
            id="prop-address"
            name="address"
            label="Morada"
            placeholder="Rua, número, código postal, localidade"
            defaultValue={property?.address ?? ""}
          />

          <div className="rounded-xl border border-teal/20 bg-teal/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-dark">
              Credenciais SIBA (AIMA)
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Estes dados são fornecidos quando regista o seu alojamento em{" "}
              <a
                href="https://siba.sef.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-teal-dark underline-offset-2 hover:underline"
              >
                siba.sef.pt
              </a>
              . Permitem à Aloja submeter os boletins automaticamente. Se ainda
              não os tiver, pode descarregar o XML e submetê-lo manualmente.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  id="prop-siba-unidade"
                  name="sibaUnidade"
                  label="Unidade Hoteleira"
                  placeholder="Ex.: 121212121"
                  defaultValue={property?.sibaUnidade ?? ""}
                />
                <Input
                  id="prop-siba-estab"
                  name="sibaEstabelecimento"
                  label="Estabelecimento"
                  placeholder="Ex.: 00"
                  defaultValue={property?.sibaEstabelecimento ?? ""}
                />
              </div>
              <Input
                id="prop-siba-chave"
                name="sibaChaveAcesso"
                label="Chave de Acesso"
                type="password"
                autoComplete="off"
                placeholder="••••••••"
                defaultValue={property?.sibaChaveAcesso ?? ""}
              />
            </div>
          </div>

          {state && !state.ok && (
            <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
              <CircleAlert size={16} className="mt-0.5 shrink-0" />
              {state.message}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending && <LoaderCircle size={15} className="animate-spin" />}
              {isPending ? "A guardar…" : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function DeletePropertyButton({
  propertyId,
  guestCount,
}: {
  propertyId: string;
  guestCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const aviso =
      guestCount > 0
        ? `Eliminar esta propriedade apaga também ${guestCount} hóspede(s) e os respetivos boletins. Continuar?`
        : "Eliminar esta propriedade?";
    if (!window.confirm(aviso)) return;
    startTransition(async () => {
      const result = await eliminarPropriedade(propertyId);
      if (!result.ok) setError(result.message);
      else router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Eliminar propriedade"
        aria-label="Eliminar propriedade"
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        {isPending ? (
          <LoaderCircle size={15} className="animate-spin" />
        ) : (
          <Trash2 size={15} />
        )}
      </button>
    </div>
  );
}
