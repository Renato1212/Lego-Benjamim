"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  buildBoletinsXml,
  getSibaEnv,
  hasSibaCredentials,
  submitToSiba,
} from "@/lib/siba";
import type { DocumentType } from "@prisma/client";

export interface ActionResult {
  ok: boolean;
  message: string;
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");
  return session.user.id;
}

// ---------------------------------------------------------------------------
// Sessão

export async function terminarSessao() {
  await signOut({ redirectTo: "/" });
}

// ---------------------------------------------------------------------------
// Hóspedes

const DOCUMENT_TYPES: DocumentType[] = ["PASSAPORTE", "BI", "CC", "OUTRO"];

export async function criarHospede(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const userId = await requireUserId();

  const propertyId = String(formData.get("propertyId") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const documentTypeRaw = String(formData.get("documentType") ?? "PASSAPORTE");
  const documentNumber = String(formData.get("documentNumber") ?? "").trim();
  const documentCountry = String(formData.get("documentCountry") ?? "").trim().toUpperCase();
  const nationality = String(formData.get("nationality") ?? "").trim().toUpperCase();
  const birthDate = String(formData.get("birthDate") ?? "");
  const residenceCountry = String(formData.get("residenceCountry") ?? "").trim().toUpperCase();
  const residencePlace = String(formData.get("residencePlace") ?? "").trim();
  const checkIn = String(formData.get("checkIn") ?? "");
  const checkOut = String(formData.get("checkOut") ?? "");

  if (!firstName || !lastName) {
    return { ok: false, message: "Indique o nome e o apelido do hóspede." };
  }
  if (!documentNumber) {
    return { ok: false, message: "Indique o número do documento de identificação." };
  }
  if (!/^[A-Z]{3}$/.test(documentCountry) || !/^[A-Z]{3}$/.test(nationality) || !/^[A-Z]{3}$/.test(residenceCountry)) {
    return { ok: false, message: "Selecione os países (nacionalidade, documento e residência)." };
  }
  if (!birthDate || !checkIn || !checkOut) {
    return { ok: false, message: "Preencha as datas de nascimento, check-in e check-out." };
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    return { ok: false, message: "A data de check-out tem de ser posterior à de check-in." };
  }
  const documentType = DOCUMENT_TYPES.includes(documentTypeRaw as DocumentType)
    ? (documentTypeRaw as DocumentType)
    : "OUTRO";

  const property = await db.property.findFirst({
    where: { id: propertyId, userId },
    select: { id: true },
  });
  if (!property) {
    return { ok: false, message: "Propriedade inválida. Adicione primeiro uma propriedade." };
  }

  try {
    await db.guest.create({
      data: {
        propertyId: property.id,
        firstName,
        lastName,
        documentType,
        documentNumber,
        documentCountry,
        nationality,
        birthDate: new Date(birthDate + "T00:00:00Z"),
        residenceCountry,
        residencePlace: residencePlace || null,
        checkIn: new Date(checkIn + "T00:00:00Z"),
        checkOut: new Date(checkOut + "T00:00:00Z"),
        boletim: { create: { status: "PENDENTE" } },
      },
    });
  } catch (error) {
    console.error("Erro ao criar hóspede:", error);
    return { ok: false, message: "Não foi possível registar o hóspede. Tente novamente." };
  }

  revalidatePath("/app");
  revalidatePath("/app/hospedes");
  redirect("/app/hospedes?registado=1");
}

export async function eliminarHospede(guestId: string): Promise<ActionResult> {
  const userId = await requireUserId();

  const guest = await db.guest.findFirst({
    where: { id: guestId, property: { userId } },
    select: { id: true },
  });
  if (!guest) {
    return { ok: false, message: "Hóspede não encontrado." };
  }

  try {
    await db.guest.delete({ where: { id: guest.id } });
  } catch (error) {
    console.error("Erro ao eliminar hóspede:", error);
    return { ok: false, message: "Não foi possível eliminar o hóspede." };
  }

  revalidatePath("/app");
  revalidatePath("/app/hospedes");
  return { ok: true, message: "Hóspede eliminado." };
}

// ---------------------------------------------------------------------------
// Boletins SIBA

export async function submeterBoletim(guestId: string): Promise<ActionResult> {
  const userId = await requireUserId();

  const guest = await db.guest.findFirst({
    where: { id: guestId, property: { userId } },
    include: { property: true, boletim: true },
  });
  if (!guest || !guest.boletim) {
    return { ok: false, message: "Boletim não encontrado." };
  }
  if (guest.boletim.status === "SUBMETIDO") {
    return { ok: false, message: "Este boletim já foi submetido ao SIBA." };
  }
  if (!hasSibaCredentials(guest.property)) {
    return {
      ok: false,
      message:
        "A propriedade não tem credenciais SIBA configuradas. Adicione-as em Propriedades antes de submeter.",
    };
  }

  const xml = buildBoletinsXml(guest.property, [guest]);
  const result = await submitToSiba(xml, {
    unidade: guest.property.sibaUnidade!,
    estabelecimento: guest.property.sibaEstabelecimento!,
    chaveAcesso: guest.property.sibaChaveAcesso!,
  });

  await db.boletim.update({
    where: { id: guest.boletim.id },
    data: result.ok
      ? {
          status: "SUBMETIDO",
          submittedAt: new Date(),
          sibaResponse: result.code ?? "0",
          errorMessage: null,
        }
      : {
          status: "ERRO",
          sibaResponse: result.code,
          errorMessage: result.message,
        },
  });

  revalidatePath("/app");
  revalidatePath("/app/hospedes");

  const envNote =
    getSibaEnv() === "test" ? " (ambiente de homologação)" : "";
  return result.ok
    ? {
        ok: true,
        message: `Boletim de ${guest.firstName} ${guest.lastName} submetido com sucesso${envNote}.`,
      }
    : { ok: false, message: result.message };
}

export async function submeterTodosPendentes(): Promise<ActionResult> {
  const userId = await requireUserId();

  const pendentes = await db.guest.findMany({
    where: {
      property: { userId },
      boletim: { status: { in: ["PENDENTE", "ERRO"] } },
    },
    include: { property: true, boletim: true },
    orderBy: { checkIn: "asc" },
  });

  if (pendentes.length === 0) {
    return { ok: true, message: "Não há boletins pendentes para submeter." };
  }

  let submetidos = 0;
  let falhados = 0;
  let semCredenciais = 0;
  let ultimoErro = "";

  for (const guest of pendentes) {
    if (!guest.boletim) continue;
    if (!hasSibaCredentials(guest.property)) {
      semCredenciais += 1;
      continue;
    }

    const xml = buildBoletinsXml(guest.property, [guest]);
    const result = await submitToSiba(xml, {
      unidade: guest.property.sibaUnidade!,
      estabelecimento: guest.property.sibaEstabelecimento!,
      chaveAcesso: guest.property.sibaChaveAcesso!,
    });

    await db.boletim.update({
      where: { id: guest.boletim.id },
      data: result.ok
        ? {
            status: "SUBMETIDO",
            submittedAt: new Date(),
            sibaResponse: result.code ?? "0",
            errorMessage: null,
          }
        : {
            status: "ERRO",
            sibaResponse: result.code,
            errorMessage: result.message,
          },
    });

    if (result.ok) submetidos += 1;
    else {
      falhados += 1;
      ultimoErro = result.message;
    }
  }

  revalidatePath("/app");
  revalidatePath("/app/hospedes");

  const partes: string[] = [];
  if (submetidos > 0) partes.push(`${submetidos} submetido(s) com sucesso`);
  if (falhados > 0) partes.push(`${falhados} com erro — ${ultimoErro}`);
  if (semCredenciais > 0) {
    partes.push(
      `${semCredenciais} sem credenciais SIBA (configure-as em Propriedades)`
    );
  }

  return {
    ok: falhados === 0 && semCredenciais === 0,
    message: partes.join(" · ") || "Nada a submeter.",
  };
}

// ---------------------------------------------------------------------------
// Propriedades

export async function guardarPropriedade(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const userId = await requireUserId();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const alNumber = String(formData.get("alNumber") ?? "").trim();
  const municipality = String(formData.get("municipality") ?? "outro");
  const address = String(formData.get("address") ?? "").trim();
  const sibaUnidade = String(formData.get("sibaUnidade") ?? "").trim();
  const sibaEstabelecimento = String(formData.get("sibaEstabelecimento") ?? "").trim();
  const sibaChaveAcesso = String(formData.get("sibaChaveAcesso") ?? "").trim();

  if (!name) {
    return { ok: false, message: "Indique o nome da propriedade." };
  }

  const data = {
    name,
    alNumber,
    municipality,
    address,
    sibaUnidade: sibaUnidade || null,
    sibaEstabelecimento: sibaEstabelecimento || null,
    sibaChaveAcesso: sibaChaveAcesso || null,
  };

  try {
    if (id) {
      const existing = await db.property.findFirst({
        where: { id, userId },
        select: { id: true },
      });
      if (!existing) {
        return { ok: false, message: "Propriedade não encontrada." };
      }
      await db.property.update({ where: { id }, data });
    } else {
      await db.property.create({ data: { ...data, userId } });
    }
  } catch (error) {
    console.error("Erro ao guardar propriedade:", error);
    return { ok: false, message: "Não foi possível guardar a propriedade." };
  }

  revalidatePath("/app");
  revalidatePath("/app/propriedades");
  return {
    ok: true,
    message: id ? "Propriedade atualizada." : "Propriedade adicionada.",
  };
}

export async function eliminarPropriedade(propertyId: string): Promise<ActionResult> {
  const userId = await requireUserId();

  const property = await db.property.findFirst({
    where: { id: propertyId, userId },
    select: { id: true },
  });
  if (!property) {
    return { ok: false, message: "Propriedade não encontrada." };
  }

  try {
    await db.property.delete({ where: { id: property.id } });
  } catch (error) {
    console.error("Erro ao eliminar propriedade:", error);
    return { ok: false, message: "Não foi possível eliminar a propriedade." };
  }

  revalidatePath("/app");
  revalidatePath("/app/propriedades");
  return { ok: true, message: "Propriedade eliminada." };
}

// ---------------------------------------------------------------------------
// Perfil

export async function atualizarPerfil(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const userId = await requireUserId();

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) {
    return { ok: false, message: "O nome não pode ficar vazio." };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { name, phone: phone || null },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return { ok: false, message: "Não foi possível guardar as alterações." };
  }

  revalidatePath("/app", "layout");
  return { ok: true, message: "Alterações guardadas." };
}
