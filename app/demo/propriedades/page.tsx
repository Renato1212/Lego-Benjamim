import { Building2, CircleCheck, MapPin, Plus, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PROPERTIES } from "@/lib/mock-data";

export default function PropriedadesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Propriedades
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            As suas unidades de Alojamento Local e o estado da sincronização
          </p>
        </div>
        <Button>
          <Plus size={16} />
          Adicionar propriedade
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {PROPERTIES.map((prop) => (
          <Card key={prop.id} className="overflow-hidden">
            {/* Cabeçalho visual */}
            <div
              className={`flex h-32 items-end bg-gradient-to-br ${prop.imagemGradiente} p-5`}
            >
              <div className="flex w-full items-end justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{prop.nome}</p>
                  <p className="flex items-center gap-1 text-xs text-white/80">
                    <MapPin size={12} />
                    {prop.municipioNome}
                  </p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  {prop.registoAL}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm text-slate-500">{prop.morada}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="navy">
                  <Building2 size={12} /> {prop.tipologia}
                </Badge>
                <Badge tone="navy">
                  <Users size={12} /> Até {prop.capacidade} hóspedes
                </Badge>
              </div>

              {/* Sincronização */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <span className="text-sm font-medium text-slate-700">
                    Airbnb
                  </span>
                  {prop.syncAirbnb ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CircleCheck size={14} /> Ligado
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Por ligar
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <span className="text-sm font-medium text-slate-700">
                    Booking
                  </span>
                  {prop.syncBooking ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CircleCheck size={14} /> Ligado
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Por ligar
                    </span>
                  )}
                </div>
              </div>

              {/* Ocupação */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">
                    Ocupação em junho
                  </span>
                  <span className="font-bold text-navy">{prop.ocupacao}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${prop.ocupacao}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Cartão de adicionar */}
        <button className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-8 text-slate-400 transition-colors hover:border-teal/40 hover:text-teal">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
            <Plus size={22} />
          </span>
          <span className="text-sm font-semibold">
            Adicionar nova propriedade
          </span>
          <span className="max-w-56 text-center text-xs">
            Cole o link iCal do Airbnb ou Booking e comece a sincronizar
            reservas
          </span>
        </button>
      </div>
    </div>
  );
}
