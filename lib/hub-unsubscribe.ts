import crypto from "crypto";

const EXPIRY_DAYS = 30;

export function signUnsubscribeToken(businessId: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET required for unsubscribe token");
  const exp = Math.floor(Date.now() / 1000) + EXPIRY_DAYS * 24 * 60 * 60;
  const payload = JSON.stringify({ businessId, exp });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyUnsubscribeToken(token: string): { businessId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;
  const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.businessId || typeof payload.businessId !== "string") return null;
    return { businessId: payload.businessId };
  } catch {
    return null;
  }
}
