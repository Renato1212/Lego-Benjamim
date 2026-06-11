// Países mais comuns no Alojamento Local português — códigos ISO 3166-1 alpha-3

export interface Country {
  code: string; // ISO 3166-1 alpha-3
  nome: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "PRT", nome: "Portugal", flag: "🇵🇹" },
  { code: "ESP", nome: "Espanha", flag: "🇪🇸" },
  { code: "FRA", nome: "França", flag: "🇫🇷" },
  { code: "DEU", nome: "Alemanha", flag: "🇩🇪" },
  { code: "GBR", nome: "Reino Unido", flag: "🇬🇧" },
  { code: "ITA", nome: "Itália", flag: "🇮🇹" },
  { code: "NLD", nome: "Países Baixos", flag: "🇳🇱" },
  { code: "BEL", nome: "Bélgica", flag: "🇧🇪" },
  { code: "USA", nome: "Estados Unidos", flag: "🇺🇸" },
  { code: "BRA", nome: "Brasil", flag: "🇧🇷" },
  { code: "IRL", nome: "Irlanda", flag: "🇮🇪" },
  { code: "CHE", nome: "Suíça", flag: "🇨🇭" },
  { code: "AUT", nome: "Áustria", flag: "🇦🇹" },
  { code: "POL", nome: "Polónia", flag: "🇵🇱" },
  { code: "SWE", nome: "Suécia", flag: "🇸🇪" },
  { code: "DNK", nome: "Dinamarca", flag: "🇩🇰" },
  { code: "NOR", nome: "Noruega", flag: "🇳🇴" },
  { code: "FIN", nome: "Finlândia", flag: "🇫🇮" },
  { code: "CAN", nome: "Canadá", flag: "🇨🇦" },
  { code: "AUS", nome: "Austrália", flag: "🇦🇺" },
  { code: "JPN", nome: "Japão", flag: "🇯🇵" },
  { code: "CHN", nome: "China", flag: "🇨🇳" },
  { code: "KOR", nome: "Coreia do Sul", flag: "🇰🇷" },
  { code: "IND", nome: "Índia", flag: "🇮🇳" },
  { code: "ISR", nome: "Israel", flag: "🇮🇱" },
  { code: "MEX", nome: "México", flag: "🇲🇽" },
  { code: "ARG", nome: "Argentina", flag: "🇦🇷" },
  { code: "ZAF", nome: "África do Sul", flag: "🇿🇦" },
  { code: "AGO", nome: "Angola", flag: "🇦🇴" },
  { code: "MOZ", nome: "Moçambique", flag: "🇲🇿" },
  { code: "CPV", nome: "Cabo Verde", flag: "🇨🇻" },
  { code: "LUX", nome: "Luxemburgo", flag: "🇱🇺" },
  { code: "CZE", nome: "Chéquia", flag: "🇨🇿" },
  { code: "GRC", nome: "Grécia", flag: "🇬🇷" },
  { code: "ROU", nome: "Roménia", flag: "🇷🇴" },
  { code: "UKR", nome: "Ucrânia", flag: "🇺🇦" },
  { code: "TUR", nome: "Turquia", flag: "🇹🇷" },
];

export function countryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}

export function countryLabel(code: string): string {
  const country = countryByCode(code);
  return country ? `${country.flag} ${country.nome}` : code.toUpperCase();
}

export function countryFlag(code: string): string {
  return countryByCode(code)?.flag ?? "🌍";
}

export const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({
  value: c.code,
  label: `${c.flag} ${c.nome}`,
}));
