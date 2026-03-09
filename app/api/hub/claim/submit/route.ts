import { getResend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SouthportGuide <noreply@thelakesguide.co.uk>";
const ADMIN_EMAIL = "damian@churchtownmedia.co.uk";
const BASE_URL = process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk";

const Schema = z.object({
  businessId: z.string().uuid(),
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255),
  message: z.string().max(2000).trim().optional(),
});

function randomPassword(): string {
  return crypto.randomBytes(24).toString("base64url");
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { businessId } = parsed.data;
  const message = parsed.data.message ?? null;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { category: { select: { name: true } } },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found." }, { status: 404 });
  }

  if (business.claimed) {
    return NextResponse.json(
      { error: "This listing is already claimed." },
      { status: 400 }
    );
  }

  const existingPending = await prisma.claimRequest.findFirst({
    where: { businessId, status: "pending" },
  });

  if (existingPending) {
    return NextResponse.json(
      { error: "A claim request is already pending for this listing." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    include: { businesses: { select: { id: true } } },
  });

  if (existingUser && existingUser.businesses.length > 0) {
    return NextResponse.json(
      { error: "An account with this email already manages a listing." },
      { status: 400 }
    );
  }

  const tempPassword = await bcrypt.hash(randomPassword(), 12);
  let userId: string;

  if (!existingUser) {
    const newUser = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        password: tempPassword,
        role: "user",
      },
    });
    userId = newUser.id;
  } else {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { name: parsed.data.name, password: tempPassword },
    });
    userId = existingUser.id;
  }

  await prisma.claimRequest.create({
    data: {
      businessId,
      userId,
      name: parsed.data.name,
      email: parsed.data.email,
      message,
      status: "pending",
    },
  });

  // Confirmation to claimant
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: parsed.data.email,
    subject: `We've received your claim request — ${business.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 32px; border-radius: 8px;">
        <div style="border-bottom: 3px solid #C9A84C; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 24px; color: #1B2E4B; margin: 0;">
            Southport<span style="color: #C9A84C;">Guide</span>.co.uk
          </h1>
          <p style="color: #666; font-size: 13px; margin: 4px 0 0;">Claim request received</p>
        </div>
        <p style="color: #1B2E4B; font-size: 16px;">Hi ${parsed.data.name},</p>
        <p style="color: #444; line-height: 1.7;">
          Thanks for submitting a claim request for <strong>${business.name}</strong>.
          We'll review it and get back to you by email — usually within 1–2 business days.
        </p>
        <p style="color: #444; line-height: 1.7;">
          Once approved, you'll receive a link to set your password and access your Business Hub dashboard.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          SouthportGuide.co.uk — Built by <a href="https://churchtownmedia.co.uk" style="color: #C9A84C;">Churchtown Media</a>
        </p>
      </div>
    `,
  });

  // Notification to admin
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[SouthportGuide] New claim request — ${business.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 32px; border-radius: 8px;">
        <div style="border-bottom: 3px solid #C9A84C; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 24px; color: #1B2E4B; margin: 0;">
            Southport<span style="color: #C9A84C;">Guide</span>.co.uk
          </h1>
          <p style="color: #666; font-size: 13px; margin: 4px 0 0;">New claim request</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px; vertical-align: top;">Business</td>
            <td style="padding: 8px 0; color: #1B2E4B; font-weight: bold;">${business.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Address</td>
            <td style="padding: 8px 0; color: #1B2E4B;">${business.address}, ${business.postcode}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Category</td>
            <td style="padding: 8px 0; color: #1B2E4B;">${business.category.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Claimant</td>
            <td style="padding: 8px 0; color: #1B2E4B;">${parsed.data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${parsed.data.email}" style="color: #C9A84C;">${parsed.data.email}</a></td>
          </tr>
        </table>

        ${message ? `
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Message</p>
            <p style="color: #1B2E4B; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>
        ` : ""}

        <p style="margin-top: 24px;">
          <a href="${BASE_URL}/admin/claims" style="display: inline-block; background: #C9A84C; color: #1B2E4B; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Review claims →
          </a>
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          SouthportGuide.co.uk — Built by <a href="https://churchtownmedia.co.uk" style="color: #C9A84C;">Churchtown Media</a>
        </p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
