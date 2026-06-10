"use client";

import { useMemo, useState } from "react";
import { CircleCheck, Funnel, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { BoletimBadge } from "@/components/dashboard/BoletimBadge";
import {
  GUESTS,
  NATIONALITIES,
  PROPERTIES,
  formatDatePT,
  type BoletimStatus,
  type Guest,
} from "@/lib/mock-data";

type Filter = "todos" | BoletimStatus;

const filterOptions: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos os estados" },
  { value: "enviado", label: "Enviado" },
  { value: "pendente", label: "Pendente" },
  { value: "atrasado", label: "Atrasado" },
];

function propertyName(id: string) {
  return PROPERTIES.find((p) => p.id === id)?.nome ?? "—";
}

export default function HospedesPage() {
  const [guests, setGuests] = useState<Guest[]>(GUESTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [nacionalidade, setNacionalidade] = useState(NATIONALITIES[0]);
  const [propriedadeId, setPropriedadeId] = useState(PROPERTIES[0].id);
  const [checkIn, setCheckIn] = useState("2026-06-15");
  const [checkOut, setCheckOut] = useState("2026-06-19");

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch =
        g.nome.toLowerCase().includes(search.toLowerCase()) ||
        g.nacionalidade.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "todos" || g.boletim === filter;
      return matchesSearch && matchesFilter;
    });
  }, [guests, search, filter]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const noites = Math.max(
      1,
      Math.round(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    const novo: Guest = {
      id: `g-${Date.now()}`,
      nome: nome.trim() || "Novo Hóspede",
      nacionalidade,
      bandeira: "🌍",
      documento: documento.trim() || "—",
      tipoDocumento: "Passaporte",
      propriedadeId,
      checkIn,
      checkOut,
      noites,
      acompanhantes: 0,
      boletim: "pendente",
      prazoBoletim: checkIn,
    };
    setGuests((prev) => [novo, ...prev]);
    setModalOpen(false);
    setSaved(true);
    setNome("");
    setDocumento("");
    setTimeout(() => setSaved(false), 4000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Hóspedes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Registo de hóspedes e estado dos boletins de alojamento
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Novo hóspede
        </Button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CircleCheck size={16} />
          Hóspede registado. O boletim de alojamento será gerado e enviado à
          AIMA automaticamente.
        </div>
      )}

      {/* Pesquisa e filtro */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome ou nacionalidade…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-navy placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/40"
          />
        </div>
        <div className="relative sm:w-56">
          <Funnel
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-navy focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/40"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela — desktop */}
      <Card className="hidden overflow-hidden lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {["Hóspede", "Propriedade", "Check-in", "Check-out", "Noites", "Boletim"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr
                key={g.id}
                className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{g.bandeira}</span>
                    <div>
                      <p className="text-sm font-semibold text-navy">{g.nome}</p>
                      <p className="text-xs text-slate-400">
                        {g.nacionalidade} · {g.tipoDocumento} {g.documento}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {propertyName(g.propriedadeId)}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDatePT(g.checkIn)}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDatePT(g.checkOut)}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{g.noites}</td>
                <td className="px-5 py-4">
                  <BoletimBadge status={g.boletim} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            Nenhum hóspede corresponde à pesquisa.
          </p>
        )}
      </Card>

      {/* Cartões — mobile */}
      <div className="flex flex-col gap-3 lg:hidden">
        {filtered.map((g) => (
          <Card key={g.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{g.bandeira}</span>
                <div>
                  <p className="text-sm font-semibold text-navy">{g.nome}</p>
                  <p className="text-xs text-slate-400">{g.nacionalidade}</p>
                </div>
              </div>
              <BoletimBadge status={g.boletim} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <p>
                <span className="font-semibold text-slate-600">Propriedade:</span>{" "}
                {propertyName(g.propriedadeId)}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Noites:</span>{" "}
                {g.noites}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Check-in:</span>{" "}
                {formatDatePT(g.checkIn)}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Check-out:</span>{" "}
                {formatDatePT(g.checkOut)}
              </p>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            Nenhum hóspede corresponde à pesquisa.
          </p>
        )}
      </div>

      {/* Modal de registo */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registar novo hóspede"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="nome"
            label="Nome completo"
            placeholder="Ex.: Hans Müller"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="documento"
              label="N.º do documento"
              placeholder="Passaporte ou CC"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
            <Select
              id="nacionalidade"
              label="Nacionalidade"
              value={nacionalidade}
              onChange={(e) => setNacionalidade(e.target.value)}
              options={NATIONALITIES.map((n) => ({ value: n, label: n }))}
            />
          </div>
          <Select
            id="propriedade"
            label="Propriedade"
            value={propriedadeId}
            onChange={(e) => setPropriedadeId(e.target.value)}
            options={PROPERTIES.map((p) => ({ value: p.id, label: p.nome }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="checkin"
              label="Check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
            <Input
              id="checkout"
              label="Check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
          <p className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-500">
            Ao registar, a Aloja gera o boletim de alojamento e envia-o à AIMA
            dentro do prazo legal de 3 dias úteis.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Registar hóspede
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
