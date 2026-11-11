import { getResend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import {
  HONEYPOT_FIELD,
  LIMITS,
  buildEnquiryEmail,
  isValidEmail,
  logSendError,
  normaliseEnquiryType,
} from "@/lib/contact";

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // A filled honeypot means a bot: answer as if sent, send nothing.
  if (str(body[HONEYPOT_FIELD])) {
    return NextResponse.json({ success: true });
  }

  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);
  const businessName = str(body.businessName);
  const subject = normaliseEnquiryType(body.subject);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (name.length > LIMITS.name || businessName.length > LIMITS.businessName) {
    return NextResponse.json({ error: "Name or business name is too long." }, { status: 400 });
  }
  if (message.length > LIMITS.message) {
    return NextResponse.json({ error: `Message is too long (max ${LIMITS.message} characters).` }, { status: 400 });
  }

  try {
    const { error } = await getResend().emails.send(
      buildEnquiryEmail({ name, email, subject, message, businessName }),
    );
    if (error) {
      logSendError(error);
      return NextResponse.json(
        { error: "Sorry, your message could not be sent. Please try again later." },
        { status: 502 },
      );
    }
  } catch (err) {
    logSendError(err);
    return NextResponse.json(
      { error: "Sorry, your message could not be sent. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
