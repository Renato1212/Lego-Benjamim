import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildBoletinsXml } from "@/lib/siba";

export const dynamic = "force-dynamic";

/**
 * GET /api/boletins/download?guestId=… — XML de um hóspede
 * GET /api/boletins/download?propertyId=… — XML de todos os pendentes da propriedade
 *
 * Após o download, os boletins incluídos ficam marcados como MANUAL
 * (o anfitrião submete o ficheiro em https://siba.sef.pt).
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { erro: "Sessão expirada. Inicie sessão novamente." },
      { status: 401 }
    );
  }
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get("guestId");
  const propertyId = searchParams.get("propertyId");

  if (!guestId && !propertyId) {
    return NextResponse.json(
      { erro: "Indique guestId ou propertyId." },
      { status: 400 }
    );
  }

  const guests = await db.guest.findMany({
    where: guestId
      ? { id: guestId, property: { userId } }
      : {
          propertyId: propertyId!,
          property: { userId },
          boletim: { status: { in: ["PENDENTE", "ERRO", "MANUAL"] } },
        },
    include: { property: true, boletim: true },
    orderBy: { checkIn: "asc" },
  });

  if (guests.length === 0) {
    return NextResponse.json(
      { erro: "Nenhum boletim encontrado para descarregar." },
      { status: 404 }
    );
  }

  // Um ficheiro Movimento_BAL refere-se a uma única unidade hoteleira
  const property = guests[0].property;
  const sameProperty = guests.filter((g) => g.propertyId === property.id);

  const xml = buildBoletinsXml(property, sameProperty);

  // Marcar como MANUAL os boletins ainda não submetidos
  const boletimIds = sameProperty
    .filter(
      (g) =>
        g.boletim &&
        (g.boletim.status === "PENDENTE" || g.boletim.status === "ERRO")
    )
    .map((g) => g.boletim!.id);

  if (boletimIds.length > 0) {
    await db.boletim.updateMany({
      where: { id: { in: boletimIds } },
      data: { status: "MANUAL", errorMessage: null },
    });
  }

  const today = new Date();
  const stamp = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="boletins-${stamp}.xml"`,
      "Cache-Control": "no-store",
    },
  });
}
