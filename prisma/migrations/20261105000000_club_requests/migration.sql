-- CreateEnum
CREATE TYPE "ClubRequestKind" AS ENUM ('dj', 'brand');

-- CreateEnum
CREATE TYPE "ClubRequestStatus" AS ENUM ('new', 'contacted', 'done', 'rejected');

-- CreateTable
CREATE TABLE "ClubRequest" (
    "id" TEXT NOT NULL,
    "kind" "ClubRequestKind" NOT NULL,
    "status" "ClubRequestStatus" NOT NULL DEFAULT 'new',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "adminNote" TEXT,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClubRequest_kind_status_createdAt_idx" ON "ClubRequest"("kind", "status", "createdAt");
