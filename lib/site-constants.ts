/**
 * Shared hero image used across the site: a generated illustration (Damian, 11 Nov 2026:
 * illustrations are allowed where there is no adequate real picture, never presented as
 * photographs of named places). Served through next/image from /public.
 */
export const HERO_IMAGE_URL = "/images/illustrations/site-hero-2400.webp";

/** Alt text for HERO_IMAGE_URL, from the illustration manifest. */
export const HERO_IMAGE_ALT =
  "Illustration of a Lake District lake with a wooded shore, a small rowing boat and a village of stone cottages below green fells";

/**
 * Where HERO_IMAGE_URL is cropped in the wide hero bands: the fells, village and lake,
 * which keeps the hero text on darker ground than the illustration's pale sky.
 */
export const HERO_IMAGE_POSITION = "center 70%";
