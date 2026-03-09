export const BOOST_TYPES = [
  { id: "standard", label: "Standard 7 days", pricePence: 1500, days: 7 },
  { id: "weekend", label: "Weekend (Fri–Sun)", pricePence: 1000, days: 3 },
  { id: "flower_show", label: "Flower Show Weekend", pricePence: 4900, days: 3 },
  { id: "air_show", label: "Air Show Weekend", pricePence: 4900, days: 3 },
  { id: "bank_holiday", label: "Bank Holiday Weekend", pricePence: 3500, days: 3 },
  { id: "christmas_markets", label: "Christmas Markets Month", pricePence: 9900, days: 30 },
  { id: "open2026", label: "The Open 2026 Fortnight", pricePence: 14900, days: 14 },
] as const;

export function getBoostTypes(): (typeof BOOST_TYPES)[number][] {
  const now = new Date();
  const openDeadline = new Date("2026-07-12");
  if (now >= openDeadline) {
    return BOOST_TYPES.filter((t) => t.id !== "open2026");
  }
  return [...BOOST_TYPES];
}

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}
