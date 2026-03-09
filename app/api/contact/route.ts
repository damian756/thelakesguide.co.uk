import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "damian@churchtownmedia.co.uk";
// Once verified, change to: "SouthportGuide <contact@southportguide.co.uk>"
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SouthportGuide <noreply@southportguide.co.uk>";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, businessName } = body as {
      name: string;
      email: string;
      subject: string;
      message: string;
      businessName?: string;
    };

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (message.length > 3000) {
      return NextResponse.json({ error: "Message is too long (max 3000 characters)." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: `${name} <${email}>`,
      subject: `[SouthportGuide] ${subject}${businessName ? ` — ${businessName}` : ""}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 32px; border-radius: 8px;">
          <div style="border-bottom: 3px solid #C9A84C; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="font-size: 24px; color: #1B2E4B; margin: 0;">
              Southport<span style="color: #C9A84C;">Guide</span><span style="color: #999; font-size: 14px;">.co.uk</span>
            </h1>
            <p style="color: #666; font-size: 13px; margin: 4px 0 0;">New contact form submission</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px; width: 110px; vertical-align: top;">Subject</td>
              <td style="padding: 8px 0; color: #1B2E4B; font-weight: bold;">${subject}${businessName ? ` — ${businessName}` : ""}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">From</td>
              <td style="padding: 8px 0; color: #1B2E4B;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #C9A84C;">${email}</a></td>
            </tr>
          </table>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Message</p>
            <p style="color: #1B2E4B; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center;">
            Reply directly to this email to respond to ${name}.<br/>
            SouthportGuide.co.uk — Built by <a href="https://churchtownmedia.co.uk" style="color: #C9A84C;">Churchtown Media</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend send error:", JSON.stringify(error));
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
    }

    // Auto-reply to sender
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Thanks for getting in touch — SouthportGuide.co.uk",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 32px; border-radius: 8px;">
          <div style="border-bottom: 3px solid #C9A84C; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="font-size: 24px; color: #1B2E4B; margin: 0;">
              Southport<span style="color: #C9A84C;">Guide</span><span style="color: #999; font-size: 14px;">.co.uk</span>
            </h1>
          </div>
          <p style="color: #1B2E4B; font-size: 16px;">Hi ${name},</p>
          <p style="color: #555; line-height: 1.7;">
            Thanks for getting in touch! We've received your message and will get back to you within 1–2 business days.
          </p>
          <p style="color: #555; line-height: 1.7;">
            In the meantime, feel free to explore the guide at
            <a href="https://www.southportguide.co.uk" style="color: #C9A84C;">southportguide.co.uk</a>.
          </p>
          <p style="color: #1B2E4B; margin-top: 24px;">The SouthportGuide Team</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Built by <a href="https://churchtownmedia.co.uk" style="color: #C9A84C;">Churchtown Media</a>, Southport
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
