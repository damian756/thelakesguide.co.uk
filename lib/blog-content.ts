// Lakes Guide blog content — Damian, TheLakesGuide.co.uk

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; emoji: string; text: string }
  | { type: "quote"; text: string; attr?: string }
  | { type: "cta"; text: string; href: string; label: string }
  | { type: "image"; src: string; alt: string; caption?: string; portrait?: boolean; objectPosition?: string }
  | { type: "video"; src: string; poster: string; caption?: string }
  | { type: "hr" };

export const BLOG_CONTENT: Record<string, ContentBlock[]> = {};
