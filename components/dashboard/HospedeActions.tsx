"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  CircleCheck,
  FileDown,
  LoaderCircle,
  Send,
  Trash2,
} from "lucide-react";
import {
  eliminarHospede,
  submeterBoletim,
  submeterTodosPendentes,
  type ActionResult,
} from "@/app/app/actions";
import { Button } from "@/components/ui/Button";

function ResultToast({
  result,
  onClose,
}: {
  result: ActionResult;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed bottom-24 left-4 right-4 z-50 mx-auto flex max-w-md items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg md:bottom-8 ${
        result.ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
      role="status"
    >
      {result.ok ? (
        <CircleCheck size={17} className="mt-0.5 shrink-0" />
      ) : (
        <CircleAlert size={17} className="mt-0.5 shrink-0" />
      )}
      <span className="flex-1">{result.message}</span>
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="shrink-0 text-xs font-bold opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

function useActionToast() {
  const [result, setResult] = useState<ActionResult | null>(null);

  function show(r: ActionResult) {
    setResult(r);
    if (r.ok) {
      setTimeout(() => setResult(null), 6000);
    }
  }

  const toast = result ? (
    <ResultToast result={result} onClose={() => setResult(null)} />
  ) : null;

  return { show, toast };
}

/** Ações por linha de hóspede: submeter ao SIBA, descarregar XML, eliminar */
export function HospedeRowActions({
  guestId,
  status,
}: {
  guestId: string;
  status: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { show, toast } = useActionToast();

  const podeSubmeter = status === "PENDENTE" || status === "ERRO";

  function handleSubmit() {
    startTransition(async () => {
      const result = await submeterBoletim(guestId);
      show(result);
    });
  }

  function handleDownload() {
    window.location.href = `/api/boletins/download?guestId=${guestId}`;
    setTimeout(() => router.refresh(), 1500);
  }

  function handleDelete() {
    if (!window.confirm("Eliminar este hóspede e o respetivo boletim?")) return;
    startTransition(async () => {
      const result = await eliminarHospede(guestId);
      show(result);
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      {podeSubmeter && (
        <button
          onClick={handleSubmit}
          disabled={isPending}
          title="Submeter boletim ao SIBA"
          className="flex items-center gap-1.5 rounded-lg bg-teal px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
        >
          {isPending ? (
            <LoaderCircle size={13} className="animate-spin" />
          ) : (
            <Send size={13} />
          )}
          Submeter
        </button>
      )}
      {podeSubmeter && (
        <button
          onClick={handleDownload}
          disabled={isPending}
          title="Descarregar XML para submissão manual em siba.sef.pt"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-navy disabled:opacity-50"
        >
          <FileDown size={13} />
          XML
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Eliminar hóspede"
        aria-label="Eliminar hóspede"
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={15} />
      </button>
      {toast}
    </div>
  );
}

/** Barra de ações em massa para boletins pendentes */
export function BoletinsBulkActions({
  pendentes,
  propriedadesComPendentes,
}: {
  pendentes: number;
  propriedadesComPendentes: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { show, toast } = useActionToast();

  if (pendentes === 0) return null;

  function handleSubmitAll() {
    startTransition(async () => {
      const result = await submeterTodosPendentes();
      show(result);
    });
  }

  function handleDownload(propertyId: string) {
    window.location.href = `/api/boletins/download?propertyId=${propertyId}`;
    setTimeout(() => router.refresh(), 1500);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm font-medium text-amber-800">
        {pendentes} {pendentes === 1 ? "boletim por comunicar" : "boletins por comunicar"} ao
        SIBA (prazo legal: 3 dias úteis após o check-in).
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleSubmitAll} disabled={isPending}>
          {isPending ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
          Submeter todos os pendentes
        </Button>
        {propriedadesComPendentes.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant="secondary"
            onClick={() => handleDownload(p.id)}
            disabled={isPending}
            title={`Descarregar XML dos pendentes — ${p.name}`}
          >
            <FileDown size={14} />
            XML{propriedadesComPendentes.length > 1 ? ` · ${p.name}` : ""}
          </Button>
        ))}
      </div>
      {toast}
    </div>
  );
}
