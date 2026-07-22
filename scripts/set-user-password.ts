/**
 * Kullanım (web dizininden): pnpm exec tsx scripts/set-user-password.ts <email> <parola>
 * Örnek: pnpm exec tsx scripts/set-user-password.ts test@noqta.club 'yeniParola'
 */
import path from "node:path";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

import { getPrisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const email = String(process.argv[2] || "")
    .trim()
    .toLowerCase();
  const password = String(process.argv[3] || "");
  if (!email || !password) {
    console.error("Kullanım: pnpm exec tsx scripts/set-user-password.ts <email> <parola>");
    process.exit(1);
  }

  const prisma = getPrisma();
  if (!prisma) {
    console.error("DATABASE_URL tanımlı değil.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const r = await prisma.user.updateMany({
    where: { email },
    data: { passwordHash },
  });

  if (r.count === 0) {
    console.error(`Kullanıcı bulunamadı: ${email}`);
    process.exit(1);
  }
  console.log(`Parola güncellendi: ${email}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
