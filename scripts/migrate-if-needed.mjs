import { execSync } from "node:child_process";

const onVercel = process.env.VERCEL === "1";
const hasUrl = Boolean(
  process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED,
);

if (onVercel || hasUrl) {
  execSync("prisma migrate deploy", { stdio: "inherit" });
} else {
  console.warn("[build] prisma migrate deploy atlandı (DATABASE_URL yok, VERCEL değil).");
}
