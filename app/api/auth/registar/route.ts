import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Rate limit simples em memória (melhor esforço — suficiente para a beta)
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const MAX_ATTEMPTS = 10;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

const MUNICIPIOS_VALIDOS = ["lisboa", "porto", "cascais", "albufeira", "outro"];

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "desconhecido";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { erro: "Demasiadas tentativas. Tente novamente dentro de uma hora." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { erro: "Pedido inválido. Envie os dados em formato JSON." },
      { status: 400 }
    );
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim();
  const propertyName = String(body.propertyName ?? "").trim();
  const alNumber = String(body.alNumber ?? "").trim();
  const municipalityRaw = String(body.municipality ?? "outro").toLowerCase();
  const municipality = MUNICIPIOS_VALIDOS.includes(municipalityRaw)
    ? municipalityRaw
    : "outro";

  if (!name) {
    return NextResponse.json({ erro: "Indique o seu nome." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { erro: "Indique um email válido." },
      { status: 422 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { erro: "A palavra-passe deve ter pelo menos 8 caracteres." },
      { status: 422 }
    );
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { erro: "Já existe uma conta com este email. Inicie sessão." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name,
        trialEndsAt,
        ...(propertyName
          ? {
              properties: {
                create: {
                  name: propertyName,
                  alNumber,
                  municipality,
                  address: "",
                },
              },
            }
          : {}),
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, nome: user.name },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registar utilizador:", error);
    return NextResponse.json(
      {
        erro: "Não foi possível criar a conta neste momento. Tente novamente dentro de instantes.",
      },
      { status: 503 }
    );
  }
}
