import { describe, expect, it } from "vitest";
import { assertValidBid, getEffectiveStatus, pickWinner } from "../modules/auctions/auctionRules.js";

describe("auction rules", () => {
  const now = new Date("2026-01-01T12:00:00Z");
  const startTime = new Date("2026-01-01T11:00:00Z");
  const endTime = new Date("2026-01-01T13:00:00Z");

  it("derives lifecycle status from schedule", () => {
    expect(getEffectiveStatus("SCHEDULED", new Date("2026-01-01T13:00:00Z"), endTime, now)).toBe("SCHEDULED");
    expect(getEffectiveStatus("SCHEDULED", startTime, endTime, now)).toBe("LIVE");
    expect(getEffectiveStatus("LIVE", startTime, new Date("2026-01-01T11:30:00Z"), now)).toBe("ENDED");
    expect(getEffectiveStatus("CANCELLED", startTime, endTime, now)).toBe("CANCELLED");
  });

  it("rejects bids before, after, or below the minimum increment", () => {
    expect(() => assertValidBid({ status: "SCHEDULED", startTime, endTime, basePrice: 5000, currentBid: null, minimumIncrement: 100, amount: 5000, now })).not.toThrow();
    expect(() => assertValidBid({ status: "LIVE", startTime, endTime, basePrice: 5000, currentBid: 5500, minimumIncrement: 250, amount: 5600, now })).toThrow("Bid must be at least 5750");
    expect(() => assertValidBid({ status: "LIVE", startTime, endTime, basePrice: 5000, currentBid: 5500, minimumIncrement: 250, amount: 5750, now })).not.toThrow();
    expect(() => assertValidBid({ status: "LIVE", startTime, endTime, basePrice: 5000, currentBid: 5500, minimumIncrement: 250, amount: 6000, now: new Date("2026-01-01T14:00:00Z") })).toThrow("Auction is not live");
  });

  it("selects highest valid winner and respects reserve", () => {
    const bids = [
      { userId: "a", amount: 7000, createdAt: new Date("2026-01-01T12:05:00Z") },
      { userId: "b", amount: 7500, createdAt: new Date("2026-01-01T12:10:00Z") },
      { userId: "c", amount: 7500, createdAt: new Date("2026-01-01T12:20:00Z") }
    ];
    expect(pickWinner(bids, 7200)).toBe("b");
    expect(pickWinner(bids, 8000)).toBeNull();
    expect(pickWinner([], 1000)).toBeNull();
  });
});
