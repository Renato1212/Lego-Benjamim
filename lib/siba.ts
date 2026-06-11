// Integração SIBA (Sistema de Informação de Boletins de Alojamento — AIMA/SEF)
// Apenas servidor: gera o XML oficial "Movimento_BAL" e submete via SOAP.

import type { DocumentType, Guest, Property } from "@prisma/client";

if (typeof window !== "undefined") {
  throw new Error("lib/siba.ts só pode ser importado no servidor.");
}

// ---------------------------------------------------------------------------
// Endpoints

const SIBA_ENDPOINTS = {
  test: "https://siba.sef.pt/bawsdev/boletinsalojamento.asmx",
  production: "https://siba.sef.pt/baws/boletinsalojamento.asmx",
} as const;

export type SibaEnv = keyof typeof SIBA_ENDPOINTS;

export function getSibaEnv(): SibaEnv {
  return process.env.SIBA_ENV === "production" ? "production" : "test";
}

export interface SibaCredentials {
  unidade: string;
  estabelecimento: string;
  chaveAcesso: string;
}

export interface SibaResult {
  ok: boolean;
  code: string | null;
  message: string;
  raw?: string;
}

// ---------------------------------------------------------------------------
// XML

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Formata uma data como YYYYMMDD (formato exigido pelo SIBA) */
function fmtDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/** Mapeia o tipo de documento para o código SIBA: P=passaporte, B=BI/CC, O=outro */
function docTypeCode(type: DocumentType): string {
  switch (type) {
    case "PASSAPORTE":
      return "P";
    case "BI":
    case "CC":
      return "B";
    default:
      return "O";
  }
}

/**
 * Gera o XML oficial "Movimento_BAL" com os boletins de alojamento
 * de um conjunto de hóspedes de uma propriedade.
 */
export function buildBoletinsXml(
  property: Pick<
    Property,
    "sibaUnidade" | "sibaEstabelecimento" | "sibaChaveAcesso"
  >,
  guests: Guest[]
): string {
  const boletins = guests
    .map((g) => {
      return [
        "    <Boletim>",
        `      <Apelido>${xmlEscape(g.lastName.toUpperCase())}</Apelido>`,
        `      <Nome>${xmlEscape(g.firstName.toUpperCase())}</Nome>`,
        `      <Nacionalidade>${xmlEscape(g.nationality.toUpperCase())}</Nacionalidade>`,
        `      <Data_Nascimento>${fmtDate(g.birthDate)}</Data_Nascimento>`,
        `      <Local_Nascimento>${xmlEscape(g.residencePlace ?? "")}</Local_Nascimento>`,
        `      <Documento_Identificacao>${xmlEscape(g.documentNumber)}</Documento_Identificacao>`,
        `      <Pais_Emissor_Documento>${xmlEscape(g.documentCountry.toUpperCase())}</Pais_Emissor_Documento>`,
        `      <Tipo_Documento>${docTypeCode(g.documentType)}</Tipo_Documento>`,
        `      <Data_Entrada>${fmtDate(g.checkIn)}</Data_Entrada>`,
        `      <Data_Saida>${fmtDate(g.checkOut)}</Data_Saida>`,
        `      <Pais_Residencia_Origem>${xmlEscape(g.residenceCountry.toUpperCase())}</Pais_Residencia_Origem>`,
        `      <Local_Residencia_Origem>${xmlEscape(g.residencePlace ?? "")}</Local_Residencia_Origem>`,
        "    </Boletim>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<MovimentoBAL xmlns="http://sef.pt/BAws">',
    `  <Unidade_Hoteleira>${xmlEscape(property.sibaUnidade ?? "")}</Unidade_Hoteleira>`,
    `  <Estabelecimento>${xmlEscape(property.sibaEstabelecimento ?? "")}</Estabelecimento>`,
    `  <Acesso>${xmlEscape(property.sibaChaveAcesso ?? "")}</Acesso>`,
    "  <Boletins>",
    boletins,
    "  </Boletins>",
    "</MovimentoBAL>",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Cliente SOAP

/** Mensagens em pt-PT para os códigos de erro mais comuns do SIBA */
const SIBA_ERROR_MESSAGES: Record<string, string> = {
  "-1": "Credenciais SIBA inválidas. Confirme a unidade hoteleira, o estabelecimento e a chave de acesso em siba.sef.pt.",
  "-2": "XML malformado ou incompleto. Verifique os dados do hóspede e tente novamente.",
  "-3": "Datas inválidas no boletim (nascimento, entrada ou saída). Corrija os dados do hóspede.",
  "-4": "Estabelecimento desconhecido para esta unidade hoteleira. Confirme o código do estabelecimento.",
  "-5": "Boletim duplicado — este hóspede já foi comunicado para estas datas.",
  "-6": "Acesso não autorizado ao webservice. Confirme se o acesso por webservice está ativado na sua conta SIBA.",
};

function errorMessageFor(code: string): string {
  return (
    SIBA_ERROR_MESSAGES[code] ??
    `O SIBA devolveu o código de erro ${code}. Verifique os dados e as credenciais, ou submeta o ficheiro XML manualmente em siba.sef.pt.`
  );
}

/**
 * Submete o XML de boletins ao webservice do SIBA (SOAP 1.1).
 * Resposta 0 = sucesso; códigos negativos = erro.
 */
export async function submitToSiba(
  xml: string,
  credentials: SibaCredentials,
  env: SibaEnv = getSibaEnv()
): Promise<SibaResult> {
  const endpoint = SIBA_ENDPOINTS[env];
  const boletinsBase64 = Buffer.from(xml, "utf-8").toString("base64");

  const envelope = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">',
    "  <soap:Body>",
    '    <EntregaBoletinsAlojamento xmlns="http://sef.pt/">',
    `      <UnidadeHoteleira>${xmlEscape(credentials.unidade)}</UnidadeHoteleira>`,
    `      <Boletins>${boletinsBase64}</Boletins>`,
    "    </EntregaBoletinsAlojamento>",
    "  </soap:Body>",
    "</soap:Envelope>",
  ].join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: '"http://sef.pt/EntregaBoletinsAlojamento"',
      },
      body: envelope,
      signal: controller.signal,
    });

    const text = await response.text();

    if (!response.ok) {
      return {
        ok: false,
        code: String(response.status),
        message: `O serviço SIBA respondeu com o estado HTTP ${response.status}. Tente novamente mais tarde ou descarregue o XML para submissão manual.`,
        raw: text.slice(0, 2000),
      };
    }

    const match = text.match(
      /<EntregaBoletinsAlojamentoResult>\s*(-?\d+)\s*<\/EntregaBoletinsAlojamentoResult>/i
    );

    if (!match) {
      return {
        ok: false,
        code: null,
        message:
          "Resposta inesperada do SIBA — não foi possível confirmar a entrega. Descarregue o XML e submeta manualmente em siba.sef.pt.",
        raw: text.slice(0, 2000),
      };
    }

    const code = match[1];
    if (code === "0") {
      return {
        ok: true,
        code,
        message: "Boletim entregue com sucesso ao SIBA.",
        raw: text.slice(0, 2000),
      };
    }

    return {
      ok: false,
      code,
      message: errorMessageFor(code),
      raw: text.slice(0, 2000),
    };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      code: null,
      message: aborted
        ? "O serviço SIBA não respondeu dentro de 30 segundos. Tente novamente ou descarregue o XML para submissão manual."
        : "Não foi possível contactar o serviço SIBA. Verifique a ligação ou descarregue o XML para submissão manual em siba.sef.pt.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function hasSibaCredentials(
  property: Pick<
    Property,
    "sibaUnidade" | "sibaEstabelecimento" | "sibaChaveAcesso"
  >
): property is Property & {
  sibaUnidade: string;
  sibaEstabelecimento: string;
  sibaChaveAcesso: string;
} {
  return Boolean(
    property.sibaUnidade?.trim() &&
      property.sibaEstabelecimento?.trim() &&
      property.sibaChaveAcesso?.trim()
  );
}
