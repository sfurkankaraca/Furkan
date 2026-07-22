-- CreateTable
CREATE TABLE "ClubSubscription" (
    "userId" TEXT NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubSubscription_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "ClubSubscription" ADD CONSTRAINT "ClubSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
