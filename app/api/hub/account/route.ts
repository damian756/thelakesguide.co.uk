import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const NameSchema = z.object({
  type: z.literal("name"),
  name: z.string().min(1).max(100),
});

const EmailSchema = z.object({
  type: z.literal("email"),
  email: z.string().email().max(255),
});

const PasswordSchema = z.object({
  type: z.literal("password"),
  current: z.string().min(1),
  new: z.string().min(8).max(100),
});

const Schema = z.discriminatedUnion("type", [NameSchema, EmailSchema, PasswordSchema]);

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const userId = session.user.id;

  if (data.type === "name") {
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name.trim() },
    });
    return NextResponse.json({ ok: true });
  }

  if (data.type === "email") {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing && existing.id !== userId) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { email: data.email },
    });
    return NextResponse.json({ ok: true });
  }

  if (data.type === "password") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    const valid = await bcrypt.compare(data.current, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    const hashed = await bcrypt.hash(data.new, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
