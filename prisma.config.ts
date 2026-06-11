import { defineConfig } from "@prisma/config";

// O Prisma 7 deixou de ler a connection string do schema.prisma.
// O URL é necessário apenas para comandos de migração (db push) — em produção
// (Vercel) vem das variáveis de ambiente; localmente usa-se um placeholder.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://aloja:aloja@localhost:5432/aloja",
  },
});
