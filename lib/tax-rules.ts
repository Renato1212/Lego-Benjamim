// Regras de taxa turística municipal (valores aproximados da realidade, modo demonstração)

export type MunicipalityId = "lisboa" | "porto" | "cascais" | "albufeira";

export interface MunicipalityRule {
  id: MunicipalityId;
  nome: string;
  descricao: string;
  /** Tarifa por hóspede e por noite, em euros, para a data indicada */
  tarifaPorNoite: (data: Date) => number;
  /** Número máximo de noites taxadas por estadia (null = sem limite) */
  maxNoites: number | null;
  /** Idade abaixo da qual o hóspede está isento */
  idadeIsencao: number;
  notas: string[];
}

export const MUNICIPALITIES: Record<MunicipalityId, MunicipalityRule> = {
  lisboa: {
    id: "lisboa",
    nome: "Lisboa",
    descricao: "Taxa Municipal Turística de Lisboa",
    tarifaPorNoite: () => 4,
    maxNoites: 7,
    idadeIsencao: 13,
    notas: [
      "€4,00 por hóspede e por noite",
      "Máximo de 7 noites taxadas por estadia",
      "Menores de 13 anos estão isentos",
      "Entrega mensal através da plataforma da CML",
    ],
  },
  porto: {
    id: "porto",
    nome: "Porto",
    descricao: "Taxa Municipal Turística do Porto",
    tarifaPorNoite: () => 3,
    maxNoites: 7,
    idadeIsencao: 13,
    notas: [
      "€3,00 por hóspede e por noite",
      "Máximo de 7 noites taxadas por estadia",
      "Menores de 13 anos estão isentos",
      "Entrega mensal através do Balcão Virtual da CMP",
    ],
  },
  cascais: {
    id: "cascais",
    nome: "Cascais",
    descricao: "Taxa Municipal Turística de Cascais",
    tarifaPorNoite: () => 2,
    maxNoites: 7,
    idadeIsencao: 13,
    notas: [
      "€2,00 por hóspede e por noite",
      "Máximo de 7 noites taxadas por estadia",
      "Menores de 13 anos estão isentos",
      "Entrega mensal através do portal da CM Cascais",
    ],
  },
  albufeira: {
    id: "albufeira",
    nome: "Albufeira",
    descricao: "Taxa Municipal Turística de Albufeira",
    tarifaPorNoite: (data: Date) => {
      const mes = data.getMonth() + 1; // 1-12
      // Época alta: abril a outubro — €2; época baixa: novembro a março — €1
      return mes >= 4 && mes <= 10 ? 2 : 1;
    },
    maxNoites: 7,
    idadeIsencao: 13,
    notas: [
      "€2,00/noite na época alta (abril–outubro)",
      "€1,00/noite na época baixa (novembro–março)",
      "Máximo de 7 noites taxadas por estadia",
      "Menores de 13 anos estão isentos",
    ],
  },
};

export interface StayInput {
  checkIn: Date;
  /** Idades dos hóspedes da estadia */
  idadesHospedes: number[];
  noites: number;
}

export interface StayTaxResult {
  hospedesTaxaveis: number;
  hospedesIsentos: number;
  noitesTaxadas: number;
  tarifa: number;
  total: number;
}

/** Calcula a taxa turística de uma estadia para um dado município */
export function calculateStayTax(
  municipio: MunicipalityId,
  estadia: StayInput
): StayTaxResult {
  const regra = MUNICIPALITIES[municipio];
  const tarifa = regra.tarifaPorNoite(estadia.checkIn);
  const noitesTaxadas =
    regra.maxNoites === null
      ? estadia.noites
      : Math.min(estadia.noites, regra.maxNoites);
  const hospedesTaxaveis = estadia.idadesHospedes.filter(
    (idade) => idade >= regra.idadeIsencao
  ).length;
  const hospedesIsentos = estadia.idadesHospedes.length - hospedesTaxaveis;

  return {
    hospedesTaxaveis,
    hospedesIsentos,
    noitesTaxadas,
    tarifa,
    total: hospedesTaxaveis * noitesTaxadas * tarifa,
  };
}

export function formatEUR(valor: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(valor);
}
