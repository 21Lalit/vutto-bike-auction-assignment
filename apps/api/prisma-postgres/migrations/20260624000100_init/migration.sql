CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SellerLead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "expectedPrice" INTEGER,
  "wantsPickup" BOOLEAN NOT NULL DEFAULT true,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SellerLead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Bike" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "mileage" INTEGER NOT NULL,
  "condition" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "photos" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "basePrice" INTEGER NOT NULL,
  "reservePrice" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Bike_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Auction" (
  "id" TEXT NOT NULL,
  "bikeId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "minimumIncrement" INTEGER NOT NULL DEFAULT 100,
  "currentBid" INTEGER,
  "winnerId" TEXT,
  "endedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Bid" (
  "id" TEXT NOT NULL,
  "auctionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WatchlistItem" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "auctionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InspectionRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "auctionId" TEXT NOT NULL,
  "preferredDate" TIMESTAMP(3) NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'INSPECTION',
  "status" TEXT NOT NULL DEFAULT 'REQUESTED',
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InspectionRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Auction_status_startTime_endTime_idx" ON "Auction"("status", "startTime", "endTime");
CREATE INDEX "Bid_auctionId_amount_idx" ON "Bid"("auctionId", "amount");
CREATE INDEX "Bid_userId_idx" ON "Bid"("userId");
CREATE UNIQUE INDEX "WatchlistItem_userId_auctionId_key" ON "WatchlistItem"("userId", "auctionId");
CREATE INDEX "WatchlistItem_auctionId_idx" ON "WatchlistItem"("auctionId");
CREATE INDEX "InspectionRequest_userId_idx" ON "InspectionRequest"("userId");
CREATE INDEX "InspectionRequest_auctionId_idx" ON "InspectionRequest"("auctionId");
CREATE INDEX "InspectionRequest_status_idx" ON "InspectionRequest"("status");

ALTER TABLE "Auction" ADD CONSTRAINT "Auction_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InspectionRequest" ADD CONSTRAINT "InspectionRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InspectionRequest" ADD CONSTRAINT "InspectionRequest_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
