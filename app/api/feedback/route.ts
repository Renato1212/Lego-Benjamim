import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { erro: "Pedido inválido. Envie os dados em formato JSON." },
      { status: 400 }
    );
  }

  const message = String(body.message ?? "").trim();
  const email = String(body.email ?? "").trim() || null;
  const page = String(body.page ?? "").trim() || null;

  if (!message) {
    return NextResponse.json(
      { erro: "Escreva uma mensagem antes de enviar." },
      { status: 422 }
    );
  }

  try {
    const session = await auth().catch(() => null);
    await db.feedback.create({
      data: {
        message: message.slice(0, 5000),
        email,
        page,
        userId: session?.user?.id ?? null,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Erro ao guardar feedback:", error);
    return NextResponse.json(
      {
        erro: "De momento não conseguimos guardar o feedback. Tente novamente mais tarde — obrigado pela paciência!",
      },
      { status: 503 }
    );
  }
}
