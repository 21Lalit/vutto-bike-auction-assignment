export type AuctionStatus = "DRAFT" | "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";

export type BidRuleInput = {
  status: AuctionStatus;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  currentBid: number | null;
  minimumIncrement: number;
  amount: number;
  now?: Date;
};

export function getEffectiveStatus(status: AuctionStatus, startTime: Date, endTime: Date, now = new Date()): AuctionStatus {
  if (status === "CANCELLED" || status === "DRAFT" || status === "ENDED") return status;
  if (now < startTime) return "SCHEDULED";
  if (now >= startTime && now < endTime) return "LIVE";
  return "ENDED";
}

export function assertValidBid(input: BidRuleInput) {
  const now = input.now ?? new Date();
  const status = getEffectiveStatus(input.status, input.startTime, input.endTime, now);
  if (status !== "LIVE") throw new Error("Auction is not live");
  if (now >= input.endTime) throw new Error("Auction has ended");
  const minimum = input.currentBid === null
    ? input.basePrice
    : input.currentBid + input.minimumIncrement;
  if (input.amount < minimum) throw new Error(`Bid must be at least ${minimum}`);
}

export function pickWinner<T extends { userId: string; amount: number; createdAt: Date }>(bids: T[], reservePrice?: number | null) {
  const sorted = [...bids].sort((a, b) => b.amount - a.amount || a.createdAt.getTime() - b.createdAt.getTime());
  const top = sorted[0];
  if (!top) return null;
  if (reservePrice && top.amount < reservePrice) return null;
  return top.userId;
}
