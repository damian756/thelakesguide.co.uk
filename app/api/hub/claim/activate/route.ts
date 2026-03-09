import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(100),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;

  const invite = await prisma.inviteToken.findUnique({
    where: { token },
    include: { user: { select: { id: true } } },
  });

  if (!invite || invite.usedAt || new Date(invite.expiresAt) < new Date()) {
    return NextResponse.json(
      { error: "This link has expired or is invalid." },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: invite.userId },
      data: { password: hashed, emailVerified: new Date() },
    }),
    prisma.inviteToken.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
