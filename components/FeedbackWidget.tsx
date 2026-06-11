"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LoaderCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    setOpen(false);
    // Repor o estado após o fecho da animação
    setTimeout(() => {
      setSent(false);
      setError(null);
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email: email || undefined, page: pathname }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          typeof data.erro === "string"
            ? data.erro
            : "Não foi possível enviar o feedback. Tente novamente."
        );
        setSending(false);
        return;
      }
      setSent(true);
      setMessage("");
      setEmail("");
    } catch {
      setError("Não foi possível enviar o feedback. Verifique a ligação.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-navy/25 transition-transform hover:scale-105 md:bottom-6 md:right-6"
      >
        <MessageSquare size={15} className="text-teal" />
        Feedback
      </button>

      <Modal open={open} onClose={close} title="Enviar feedback">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="text-4xl">🙏</span>
            <p className="text-sm font-semibold text-navy">
              Obrigado! O seu feedback ajuda-nos a melhorar a Aloja.
            </p>
            <Button variant="secondary" onClick={close} className="mt-2">
              Fechar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-slate-500">
              Encontrou um problema ou tem uma sugestão? Conte-nos — lemos
              tudo durante a beta.
            </p>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="feedback-message"
                className="text-xs font-semibold text-slate-600"
              >
                A sua mensagem
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                placeholder="Ex.: Gostava de poder importar reservas do Airbnb…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-slate-400 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/40"
              />
            </div>
            <Input
              id="feedback-email"
              label="Email (opcional, para resposta)"
              type="email"
              placeholder="o.seu@email.pt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <Button type="button" variant="secondary" className="flex-1" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={sending || !message.trim()}>
                {sending && <LoaderCircle size={15} className="animate-spin" />}
                {sending ? "A enviar…" : "Enviar feedback"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
