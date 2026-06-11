// Cliente Prisma — singleton (apenas servidor)

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (typeof window !== "undefined") {
  throw new Error("lib/db.ts só pode ser importado no servidor.");
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://aloja:aloja@localhost:5432/aloja",
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
