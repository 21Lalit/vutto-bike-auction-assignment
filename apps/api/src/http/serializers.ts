function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function serializeBike<T extends Record<string, unknown>>(bike: T) {
  return {
    ...bike,
    photos: parseJsonField<string[]>(bike.photos, []),
    details: parseJsonField<Record<string, unknown> | null>(bike.details, null)
  };
}

export function serializeAuction<T extends Record<string, unknown>>(auction: T) {
  const bike = auction.bike as Record<string, unknown> | undefined;
  return {
    ...auction,
    bike: bike ? serializeBike(bike) : undefined
  };
}
