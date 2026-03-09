import { getResend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required." }, { status: 400 });
    }

    const normalised = email.toLowerCase().trim();

    // Always return 200 — don't leak whether the account exists
    const user = await prisma.user.findUnique({ where: { email: normalised } });
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Expire any previous tokens for this email
    await prisma.passwordResetToken.updateMany({
      where: { email: normalised, usedAt: null },
      data: { usedAt: new Date() },
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const record = await prisma.passwordResetToken.create({
      data: { email: normalised, expiresAt },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/dashboard/reset-password?token=${record.token}`;

    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "SouthportGuide <noreply@southportguide.co.uk>",
      to: normalised,
      subject: "Reset your SouthportGuide password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1B2E4B;">
          <div style="background: #1B2E4B; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <p style="margin: 0; font-size: 20px; font-weight: 700; color: #fff;">
              Southport<span style="color: #C9A84C;">Guide</span>
            </p>
          </div>
          <div style="background: #FAF8F5; padding: 32px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="margin: 0 0 12px; font-size: 20px;">Reset your password</h2>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              Someone requested a password reset for your Business Hub account.
              Click the button below to set a new password. This link expires in 1 hour.
            </p>
            <div style="margin: 28px 0;">
              <a href="${resetUrl}"
                 style="background: #1B2E4B; color: #fff; text-decoration: none; padding: 14px 28px;
                        border-radius: 999px; font-weight: 700; font-size: 15px; display: inline-block;">
                Reset password
              </a>
            </div>
            <p style="color: #888; font-size: 13px;">
              If you didn't request this, you can safely ignore this email.
              Your password won't change unless you click the link above.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
            <p style="color: #aaa; font-size: 12px; margin: 0;">
              SouthportGuide Business Hub · southportguide.co.uk
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
