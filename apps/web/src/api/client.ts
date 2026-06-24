const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_URL = configuredApiUrl || (import.meta.env.DEV ? "http://localhost:4000" : window.location.origin);
export const isApiConfigured = Boolean(API_URL);

export type User = { id: string; name: string; email: string; role: "USER" | "ADMIN" };
export type BikeDetails = {
  technical?: Record<string, string>;
  ownership?: Record<string, string>;
  service?: Record<string, string>;
  inspection?: Record<string, string>;
  commercial?: Record<string, string>;
  documents?: string[];
  features?: string[];
  included?: string[];
  knownIssues?: string[];
};
export type Bike = { id: string; title: string; brand: string; model: string; year: number; mileage: number; condition: string; location: string; photos: string[]; description: string; details?: BikeDetails | null; basePrice: number; reservePrice?: number | null };
export type Bid = { id: string; amount: number; createdAt: string; user?: { id: string; name: string } };
export type Auction = { id: string; status: "DRAFT" | "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED"; startTime: string; endTime: string; minimumIncrement: number; currentBid?: number | null; winnerId?: string | null; bike: Bike; bids: Bid[]; winner?: { id: string; name: string } | null };
export type SellerLead = { id: string; name: string; phone: string; city: string; brand: string; model: string; year: number; expectedPrice?: number | null; wantsPickup: boolean; notes?: string | null; status: string; createdAt: string };
export type InspectionRequest = { id: string; preferredDate: string; type: "INSPECTION" | "TEST_RIDE" | "VIDEO_CALL"; status: "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED"; note?: string | null; createdAt: string; user?: User; auction: Auction };

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? "Request failed");
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
