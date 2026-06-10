import { NextResponse } from "next/server";
import { GUESTS } from "@/lib/mock-data";

/**
 * GET /api/guests — lista de hóspedes (dados fictícios, modo demonstração)
 * Suporta ?status=enviado|pendente|atrasado
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const data = status
    ? GUESTS.filter((g) => g.boletim === status)
    : GUESTS;

  return NextResponse.json({
    demo: true,
    total: data.length,
    hospedes: data,
  });
}

/**
 * POST /api/guests — registo de um novo hóspede (simulado)
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { demo: true, erro: "Corpo do pedido inválido. Envie JSON." },
      { status: 400 }
    );
  }

  const obrigatorios = ["nome", "documento", "nacionalidade", "checkIn", "checkOut"];
  const emFalta = obrigatorios.filter((campo) => !body[campo]);
  if (emFalta.length > 0) {
    return NextResponse.json(
      {
        demo: true,
        erro: `Campos obrigatórios em falta: ${emFalta.join(", ")}.`,
      },
      { status: 422 }
    );
  }

  return NextResponse.json(
    {
      demo: true,
      mensagem:
        "Hóspede registado (simulação). O boletim de alojamento será gerado e enviado à AIMA dentro do prazo legal de 3 dias úteis.",
      hospede: {
        id: `g-${Date.now()}`,
        nome: body.nome,
        documento: body.documento,
        nacionalidade: body.nacionalidade,
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        boletim: "pendente",
      },
    },
    { status: 201 }
  );
}
