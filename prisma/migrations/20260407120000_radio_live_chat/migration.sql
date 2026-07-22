-- Radio canlı yayın ayarı (tek satır) + radyo sohbeti
CREATE TABLE "RadioLiveConfig" (
    "id" TEXT NOT NULL,
    "streamUrl" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT 'Noqta canlı',
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadioLiveConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RadioChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RadioChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RadioChatMessage_createdAt_idx" ON "RadioChatMessage"("createdAt");

ALTER TABLE "RadioChatMessage" ADD CONSTRAINT "RadioChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "RadioLiveConfig" ("id", "streamUrl", "title", "isLive", "updatedAt")
VALUES ('default', '', 'Noqta canlı', false, CURRENT_TIMESTAMP);
