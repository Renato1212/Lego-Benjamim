// Utilitários partilhados para hóspedes (noites, idades, taxa turística)

import {
  MUNICIPALITIES,
  calculateStayTax,
  type MunicipalityId,
  type StayTaxResult,
} from "@/lib/tax-rules";

const DAY_MS = 24 * 60 * 60 * 1000;

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  return Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / DAY_MS));
}

export function ageAt(birthDate: Date, at: Date): number {
  let age = at.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = at.getUTCMonth() - birthDate.getUTCMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && at.getUTCDate() < birthDate.getUTCDate())
  ) {
    age -= 1;
  }
  return Math.max(0, age);
}

export function isMunicipalityId(value: string): value is MunicipalityId {
  return value in MUNICIPALITIES;
}

export interface GuestStay {
  birthDate: Date;
  checkIn: Date;
  checkOut: Date;
}

/** Calcula a taxa turística de um hóspede individual (null se o município não tiver regra) */
export function guestStayTax(
  municipality: string,
  guest: GuestStay
): StayTaxResult | null {
  if (!isMunicipalityId(municipality)) return null;
  return calculateStayTax(municipality, {
    checkIn: guest.checkIn,
    idadesHospedes: [ageAt(guest.birthDate, guest.checkIn)],
    noites: nightsBetween(guest.checkIn, guest.checkOut),
  });
}

export function formatDateTimePT(date: Date): string {
  return date.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const MUNICIPALITY_LABELS: Record<string, string> = {
  lisboa: "Lisboa",
  porto: "Porto",
  cascais: "Cascais",
  albufeira: "Albufeira",
  outro: "Outro",
};
