import { NextResponse } from "next/server";
import { TAX_STAYS } from "@/lib/mock-data";
import {
  MUNICIPALITIES,
  calculateStayTax,
  type MunicipalityId,
} from "@/lib/tax-rules";

/**
 * GET /api/tax?municipio=lisboa — cálculo da taxa turística por município
 * Municípios disponíveis: lisboa, porto, cascais, albufeira
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const municipio = (searchParams.get("municipio") ?? "lisboa") as MunicipalityId;

  const regra = MUNICIPALITIES[municipio];
  if (!regra) {
    return NextResponse.json(
      {
        demo: true,
        erro: `Município desconhecido: "${municipio}". Disponíveis: ${Object.keys(MUNICIPALITIES).join(", ")}.`,
      },
      { status: 404 }
    );
  }

  const estadias = TAX_STAYS.filter((s) => s.municipio === municipio).map(
    (stay) => {
      const idades = [
        ...Array.from({ length: stay.adultos }, () => 30),
        ...Array.from({ length: stay.criancas }, () => 8),
      ];
      const calculo = calculateStayTax(municipio, {
        checkIn: new Date(stay.checkIn + "T00:00:00"),
        idadesHospedes: idades,
        noites: stay.noites,
      });
      return {
        hospede: stay.hospede,
        propriedade: stay.propriedade,
        noites: stay.noites,
        ...calculo,
      };
    }
  );

  const total = estadias.reduce((acc, e) => acc + e.total, 0);

  return NextResponse.json({
    demo: true,
    municipio: regra.nome,
    regras: regra.notas,
    estadias,
    totalAEntregar: total,
    moeda: "EUR",
  });
}
