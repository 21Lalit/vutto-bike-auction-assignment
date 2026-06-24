-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WatchlistItem_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InspectionRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "preferredDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INSPECTION',
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InspectionRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InspectionRequest_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WatchlistItem_auctionId_idx" ON "WatchlistItem"("auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_auctionId_key" ON "WatchlistItem"("userId", "auctionId");

-- CreateIndex
CREATE INDEX "InspectionRequest_userId_idx" ON "InspectionRequest"("userId");

-- CreateIndex
CREATE INDEX "InspectionRequest_auctionId_idx" ON "InspectionRequest"("auctionId");

-- CreateIndex
CREATE INDEX "InspectionRequest_status_idx" ON "InspectionRequest"("status");
