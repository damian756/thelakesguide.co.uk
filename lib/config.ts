export const CATEGORIES = [
  { slug: "walks", name: "Walks & Hiking", description: "Walks and hiking routes in the Lake District" },
  { slug: "villages", name: "Villages", description: "Villages and towns in the Lake District" },
  { slug: "restaurants", name: "Restaurants", description: "Best restaurants in the Lake District" },
  { slug: "cafes", name: "Cafes & Tea Rooms", description: "Cafes and tea rooms in the Lake District" },
  { slug: "pubs", name: "Pubs & Inns", description: "Pubs and inns in the Lake District" },
  { slug: "activities", name: "Activities", description: "Tours, rentals and activities" },
  { slug: "accommodation", name: "Places to Stay", description: "Hotels, B&Bs and holiday lets in the Lake District" },
  { slug: "shopping", name: "Shopping", description: "Shops and boutiques in the Lake District" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function isValidCategory(slug: string): slug is CategorySlug {
  return CATEGORIES.some((c) => c.slug === slug);
}
