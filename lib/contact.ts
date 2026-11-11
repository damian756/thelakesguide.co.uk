// Contact form mail for The Lakes Guide. Server-only: never import this from a
// client component, or the delivery address ends up in the browser bundle.

// Where every contact form message goes. Damian, 11 Nov 2026: the Lakes
// network sites show no email address; all enquiries go to this one inbox.
export const DELIVERY_EMAIL = "damian@churchtownmedia.co.uk";

// Sender. thelakesguide.co.uk has no MX and no Resend DNS records, so mail sent
// FROM it fails. Southport Guide's domain is verified in Resend, so we send
// from its noreply address under this site's own name. Change this once
// thelakesguide.co.uk is verified in Resend.
export const FROM_EMAIL = "The Lakes Guide <noreply@southportguide.co.uk>";

// Must match SUBJECTS in app/contact/ContactClient.tsx (a test checks this).
export const ENQUIRY_TYPES = [
  "Claim my listing",
  "Advertise / Featured listing",
  "Report an issue",
  "Media / press enquiry",
  "General enquiry",
] as const;

export const DEFAULT_ENQUIRY_TYPE = "General enquiry";

export const LIMITS = { name: 200, businessName: 200, message: 3000 } as const;

// Hidden field that people never see or fill. Bots that fill every field do.
export const HONEYPOT_FIELD = "website";

const EMAIL_RE = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && EMAIL_RE.test(value);
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const oneLine = (value: unknown) => String(value ?? "").replace(/[\r\n]+/g, " ").trim();

export function normaliseEnquiryType(value: unknown): string {
  return (ENQUIRY_TYPES as readonly string[]).includes(value as string)
    ? (value as string)
    : DEFAULT_ENQUIRY_TYPE;
}

export function buildEnquiryEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  businessName?: string;
}) {
  const business = oneLine(input.businessName);
  return {
    from: FROM_EMAIL,
    to: [DELIVERY_EMAIL],
    replyTo: isValidEmail(input.email) ? input.email : undefined,
    subject: `[The Lakes Guide] ${oneLine(input.subject)} from ${oneLine(input.name)}${business ? ` | ${business}` : ""}`,
    html:
      `<p><strong>Site:</strong> The Lakes Guide (thelakesguide.co.uk/contact)</p>` +
      `<p><strong>Name:</strong> ${escapeHtml(input.name)}</p>` +
      `<p><strong>Email:</strong> ${escapeHtml(input.email)}</p>` +
      `<p><strong>Enquiry type:</strong> ${escapeHtml(input.subject)}</p>` +
      (business ? `<p><strong>Business:</strong> ${escapeHtml(business)}</p>` : "") +
      `<p><strong>Message:</strong><br>${escapeHtml(input.message).replace(/\r?\n/g, "<br>")}</p>` +
      `<p>Reply to this email to answer the enquirer.</p>`,
  };
}

// Logs the error's name and message only: never the enquirer's details.
export function logSendError(error: unknown) {
  const e = (error ?? {}) as { name?: unknown; message?: unknown };
  console.error("Contact email failed:", String(e.name ?? "Error"), String(e.message ?? ""));
}
