import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const business = await prisma.business.findUnique({ where: { token } });
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const tags = await prisma.nFCTag.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tags);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();

  const business = await prisma.business.findUnique({ where: { token } });
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const tagToken = crypto.randomBytes(6).toString("hex");

  const tag = await prisma.nFCTag.create({
    data: {
      businessId: business.id,
      label: body.label || `Tag #${Date.now().toString(36).toUpperCase()}`,
      token: tagToken,
      active: true,
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
