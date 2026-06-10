// Dados fictícios para o modo demonstração da Aloja

import type { MunicipalityId } from "./tax-rules";

export type BoletimStatus = "enviado" | "pendente" | "atrasado";

export interface Guest {
  id: string;
  nome: string;
  nacionalidade: string;
  bandeira: string;
  documento: string;
  tipoDocumento: "Passaporte" | "Cartão de Cidadão" | "BI/CC UE";
  propriedadeId: string;
  checkIn: string; // ISO
  checkOut: string; // ISO
  noites: number;
  acompanhantes: number;
  boletim: BoletimStatus;
  prazoBoletim?: string; // ISO — apenas para pendentes/atrasados
}

export interface Property {
  id: string;
  nome: string;
  municipio: MunicipalityId;
  municipioNome: string;
  morada: string;
  registoAL: string;
  tipologia: string;
  capacidade: number;
  ocupacao: number; // percentagem do mês
  syncAirbnb: boolean;
  syncBooking: boolean;
  imagemGradiente: string;
}

export const PROPERTIES: Property[] = [
  {
    id: "prop-graca",
    nome: "Apartamento Graça",
    municipio: "lisboa",
    municipioNome: "Lisboa",
    morada: "Rua da Graça 142, 2.º Esq., 1170-171 Lisboa",
    registoAL: "AL/124573",
    tipologia: "T2 · Apartamento",
    capacidade: 4,
    ocupacao: 87,
    syncAirbnb: true,
    syncBooking: true,
    imagemGradiente: "from-[#0B1F3A] to-[#0E9F8A]",
  },
  {
    id: "prop-mar",
    nome: "Casa do Mar",
    municipio: "cascais",
    municipioNome: "Cascais",
    morada: "Av. Marginal 67, 2750-427 Cascais",
    registoAL: "AL/98214",
    tipologia: "V3 · Moradia",
    capacidade: 6,
    ocupacao: 72,
    syncAirbnb: true,
    syncBooking: true,
    imagemGradiente: "from-[#0E9F8A] to-[#38bdf8]",
  },
];

export const GUESTS: Guest[] = [
  {
    id: "g-01",
    nome: "Hans Müller",
    nacionalidade: "Alemanha",
    bandeira: "🇩🇪",
    documento: "C01X00T47",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-graca",
    checkIn: "2026-06-08",
    checkOut: "2026-06-13",
    noites: 5,
    acompanhantes: 1,
    boletim: "pendente",
    prazoBoletim: "2026-06-11",
  },
  {
    id: "g-02",
    nome: "Claire Dubois",
    nacionalidade: "França",
    bandeira: "🇫🇷",
    documento: "19FV28304",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-mar",
    checkIn: "2026-06-09",
    checkOut: "2026-06-14",
    noites: 5,
    acompanhantes: 2,
    boletim: "pendente",
    prazoBoletim: "2026-06-12",
  },
  {
    id: "g-03",
    nome: "Oliver Bennett",
    nacionalidade: "Reino Unido",
    bandeira: "🇬🇧",
    documento: "533819204",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-graca",
    checkIn: "2026-06-02",
    checkOut: "2026-06-07",
    noites: 5,
    acompanhantes: 1,
    boletim: "enviado",
  },
  {
    id: "g-04",
    nome: "Sofia Lindqvist",
    nacionalidade: "Suécia",
    bandeira: "🇸🇪",
    documento: "87231955",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-mar",
    checkIn: "2026-06-01",
    checkOut: "2026-06-05",
    noites: 4,
    acompanhantes: 0,
    boletim: "enviado",
  },
  {
    id: "g-05",
    nome: "Marco Rossi",
    nacionalidade: "Itália",
    bandeira: "🇮🇹",
    documento: "YA5530712",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-graca",
    checkIn: "2026-05-28",
    checkOut: "2026-06-02",
    noites: 5,
    acompanhantes: 1,
    boletim: "enviado",
  },
  {
    id: "g-06",
    nome: "Anna Kowalska",
    nacionalidade: "Polónia",
    bandeira: "🇵🇱",
    documento: "ZS4102938",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-mar",
    checkIn: "2026-05-25",
    checkOut: "2026-05-30",
    noites: 5,
    acompanhantes: 2,
    boletim: "enviado",
  },
  {
    id: "g-07",
    nome: "Jan de Vries",
    nacionalidade: "Países Baixos",
    bandeira: "🇳🇱",
    documento: "NXC8814720",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-graca",
    checkIn: "2026-05-20",
    checkOut: "2026-05-24",
    noites: 4,
    acompanhantes: 1,
    boletim: "enviado",
  },
  {
    id: "g-08",
    nome: "Emily Carter",
    nacionalidade: "Estados Unidos",
    bandeira: "🇺🇸",
    documento: "488203915",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-mar",
    checkIn: "2026-05-15",
    checkOut: "2026-05-22",
    noites: 7,
    acompanhantes: 1,
    boletim: "enviado",
  },
  {
    id: "g-09",
    nome: "Pedro Almeida",
    nacionalidade: "Brasil",
    bandeira: "🇧🇷",
    documento: "FQ102488",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-graca",
    checkIn: "2026-05-12",
    checkOut: "2026-05-16",
    noites: 4,
    acompanhantes: 0,
    boletim: "enviado",
  },
  {
    id: "g-10",
    nome: "Ingrid Hansen",
    nacionalidade: "Dinamarca",
    bandeira: "🇩🇰",
    documento: "20448113",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-mar",
    checkIn: "2026-05-08",
    checkOut: "2026-05-12",
    noites: 4,
    acompanhantes: 1,
    boletim: "enviado",
  },
  {
    id: "g-11",
    nome: "Tomás García",
    nacionalidade: "Espanha",
    bandeira: "🇪🇸",
    documento: "PAB392011",
    tipoDocumento: "BI/CC UE",
    propriedadeId: "prop-graca",
    checkIn: "2026-05-05",
    checkOut: "2026-05-09",
    noites: 4,
    acompanhantes: 1,
    boletim: "enviado",
  },
  {
    id: "g-12",
    nome: "Yuki Tanaka",
    nacionalidade: "Japão",
    bandeira: "🇯🇵",
    documento: "TR7720413",
    tipoDocumento: "Passaporte",
    propriedadeId: "prop-mar",
    checkIn: "2026-04-29",
    checkOut: "2026-05-04",
    noites: 5,
    acompanhantes: 1,
    boletim: "atrasado",
    prazoBoletim: "2026-05-04",
  },
];

export interface DashboardStats {
  hospedesMes: number;
  boletinsEnviados: number;
  boletinsPendentes: number;
  taxaAcumulada: number;
  complianceScore: number;
  dormidasMes: number;
}

export const DASHBOARD_STATS: DashboardStats = {
  hospedesMes: 47,
  boletinsEnviados: 45,
  boletinsPendentes: 2,
  taxaAcumulada: 312,
  complianceScore: 94,
  dormidasMes: 142,
};

export interface UrgentAlert {
  id: string;
  titulo: string;
  detalhe: string;
  severidade: "alta" | "media";
}

export const URGENT_ALERTS: UrgentAlert[] = [
  {
    id: "al-1",
    titulo: "2 boletins a expirar em 24h",
    detalhe: "Hóspede: Hans Müller · Apartamento Graça — prazo: 11 jun, 23:59",
    severidade: "alta",
  },
  {
    id: "al-2",
    titulo: "Boletim pendente: Claire Dubois",
    detalhe: "Casa do Mar · Cascais — prazo: 12 jun, 23:59",
    severidade: "media",
  },
  {
    id: "al-3",
    titulo: "Guia da taxa turística de maio por gerar",
    detalhe: "Lisboa — entrega até 15 jun · valor estimado: €180",
    severidade: "media",
  },
];

export interface ActivityItem {
  id: string;
  texto: string;
  quando: string;
  tipo: "boletim" | "checkin" | "taxa" | "ine" | "sync";
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "ac-1",
    texto: "Boletim de alojamento enviado — Oliver Bennett (🇬🇧)",
    quando: "Hoje, 09:14",
    tipo: "boletim",
  },
  {
    id: "ac-2",
    texto: "Check-in digital concluído — Claire Dubois (🇫🇷), Casa do Mar",
    quando: "Ontem, 16:02",
    tipo: "checkin",
  },
  {
    id: "ac-3",
    texto: "Calendário Airbnb sincronizado — 3 novas reservas importadas",
    quando: "Ontem, 08:00",
    tipo: "sync",
  },
  {
    id: "ac-4",
    texto: "Taxa turística de maio calculada — €180,00 (Lisboa)",
    quando: "8 jun, 18:30",
    tipo: "taxa",
  },
  {
    id: "ac-5",
    texto: "Relatório INE de maio pré-preenchido e pronto a submeter",
    quando: "5 jun, 10:12",
    tipo: "ine",
  },
];

export interface OccupancyBar {
  mes: string;
  percentagem: number;
}

export const OCCUPANCY_CHART: OccupancyBar[] = [
  { mes: "Jan", percentagem: 42 },
  { mes: "Fev", percentagem: 48 },
  { mes: "Mar", percentagem: 55 },
  { mes: "Abr", percentagem: 68 },
  { mes: "Mai", percentagem: 79 },
  { mes: "Jun", percentagem: 87 },
];

export interface IneReport {
  id: string;
  mes: string;
  dormidas: number;
  hospedes: number;
  estadiaMedia: number;
  paisesTop: { pais: string; bandeira: string; percentagem: number }[];
  submetido: boolean;
  dataSubmissao?: string;
}

export const INE_REPORTS: IneReport[] = [
  {
    id: "ine-2026-05",
    mes: "Maio 2026",
    dormidas: 142,
    hospedes: 47,
    estadiaMedia: 4.6,
    paisesTop: [
      { pais: "Alemanha", bandeira: "🇩🇪", percentagem: 24 },
      { pais: "França", bandeira: "🇫🇷", percentagem: 19 },
      { pais: "Reino Unido", bandeira: "🇬🇧", percentagem: 15 },
    ],
    submetido: false,
  },
  {
    id: "ine-2026-04",
    mes: "Abril 2026",
    dormidas: 118,
    hospedes: 39,
    estadiaMedia: 4.2,
    paisesTop: [
      { pais: "França", bandeira: "🇫🇷", percentagem: 22 },
      { pais: "Alemanha", bandeira: "🇩🇪", percentagem: 18 },
      { pais: "Espanha", bandeira: "🇪🇸", percentagem: 14 },
    ],
    submetido: true,
    dataSubmissao: "2026-05-06",
  },
  {
    id: "ine-2026-03",
    mes: "Março 2026",
    dormidas: 96,
    hospedes: 31,
    estadiaMedia: 3.9,
    paisesTop: [
      { pais: "Reino Unido", bandeira: "🇬🇧", percentagem: 21 },
      { pais: "Alemanha", bandeira: "🇩🇪", percentagem: 17 },
      { pais: "Países Baixos", bandeira: "🇳🇱", percentagem: 13 },
    ],
    submetido: true,
    dataSubmissao: "2026-04-07",
  },
  {
    id: "ine-2026-02",
    mes: "Fevereiro 2026",
    dormidas: 74,
    hospedes: 26,
    estadiaMedia: 3.6,
    paisesTop: [
      { pais: "Espanha", bandeira: "🇪🇸", percentagem: 20 },
      { pais: "França", bandeira: "🇫🇷", percentagem: 16 },
      { pais: "Itália", bandeira: "🇮🇹", percentagem: 12 },
    ],
    submetido: true,
    dataSubmissao: "2026-03-05",
  },
];

// Estadias do mês usadas no cálculo da taxa turística (demo)
export interface TaxStay {
  id: string;
  hospede: string;
  bandeira: string;
  propriedade: string;
  municipio: MunicipalityId;
  noites: number;
  adultos: number;
  criancas: number; // menores de 13 anos — isentos
  checkIn: string;
}

export const TAX_STAYS: TaxStay[] = [
  { id: "t-1", hospede: "Hans Müller", bandeira: "🇩🇪", propriedade: "Apartamento Graça", municipio: "lisboa", noites: 5, adultos: 2, criancas: 0, checkIn: "2026-06-08" },
  { id: "t-2", hospede: "Oliver Bennett", bandeira: "🇬🇧", propriedade: "Apartamento Graça", municipio: "lisboa", noites: 5, adultos: 2, criancas: 0, checkIn: "2026-06-02" },
  { id: "t-3", hospede: "Marco Rossi", bandeira: "🇮🇹", propriedade: "Apartamento Graça", municipio: "lisboa", noites: 5, adultos: 1, criancas: 1, checkIn: "2026-05-28" },
  { id: "t-4", hospede: "Jan de Vries", bandeira: "🇳🇱", propriedade: "Apartamento Graça", municipio: "lisboa", noites: 4, adultos: 2, criancas: 0, checkIn: "2026-05-20" },
  { id: "t-5", hospede: "Pedro Almeida", bandeira: "🇧🇷", propriedade: "Apartamento Graça", municipio: "lisboa", noites: 4, adultos: 1, criancas: 0, checkIn: "2026-05-12" },
  { id: "t-6", hospede: "Tomás García", bandeira: "🇪🇸", propriedade: "Apartamento Graça", municipio: "lisboa", noites: 4, adultos: 2, criancas: 1, checkIn: "2026-05-05" },
  { id: "t-7", hospede: "Claire Dubois", bandeira: "🇫🇷", propriedade: "Casa do Mar", municipio: "cascais", noites: 5, adultos: 3, criancas: 1, checkIn: "2026-06-09" },
  { id: "t-8", hospede: "Sofia Lindqvist", bandeira: "🇸🇪", propriedade: "Casa do Mar", municipio: "cascais", noites: 4, adultos: 1, criancas: 0, checkIn: "2026-06-01" },
  { id: "t-9", hospede: "Anna Kowalska", bandeira: "🇵🇱", propriedade: "Casa do Mar", municipio: "cascais", noites: 5, adultos: 3, criancas: 1, checkIn: "2026-05-25" },
  { id: "t-10", hospede: "Emily Carter", bandeira: "🇺🇸", propriedade: "Casa do Mar", municipio: "cascais", noites: 7, adultos: 2, criancas: 0, checkIn: "2026-05-15" },
  { id: "t-11", hospede: "Ingrid Hansen", bandeira: "🇩🇰", propriedade: "Casa do Mar", municipio: "cascais", noites: 4, adultos: 2, criancas: 1, checkIn: "2026-05-08" },
  { id: "t-12", hospede: "Yuki Tanaka", bandeira: "🇯🇵", propriedade: "Casa do Mar", municipio: "cascais", noites: 5, adultos: 2, criancas: 0, checkIn: "2026-04-29" },
];

export const NATIONALITIES = [
  "Alemanha",
  "Áustria",
  "Bélgica",
  "Brasil",
  "Canadá",
  "Dinamarca",
  "Espanha",
  "Estados Unidos",
  "França",
  "Irlanda",
  "Itália",
  "Japão",
  "Noruega",
  "Países Baixos",
  "Polónia",
  "Reino Unido",
  "Suécia",
  "Suíça",
];

export function formatDatePT(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
