import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const business = await prisma.business.findUnique({
    where: { token },
    select: {
      id: true,
      name: true,
      logo: true,
      token: true,
      discount: true,
      description: true,
      message: true,
      active: true,
      validUntil: true,
      cumulative: true,
    },
  });

  if (!business) {
    return NextResponse.json(
      { error: "Attività non trovata" },
      { status: 404 }
    );
  }

  return NextResponse.json(business);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();

  const existing = await prisma.business.findUnique({ where: { token } });
  if (!existing) {
    return NextResponse.json(
      { error: "Attività non trovata" },
      { status: 404 }
    );
  }

  await prisma.discountHistory.updateMany({
    where: { businessId: existing.id, active: true },
    data: { active: false },
  });

  const updated = await prisma.business.update({
    where: { token },
    data: {
      discount: body.discount,
      description: body.description,
      message: body.message,
      active: body.active,
      validUntil: body.validUntil ?? null,
      cumulative: body.cumulative,
    },
  });

  await prisma.discountHistory.create({
    data: {
      businessId: existing.id,
      discount: body.discount,
      description: body.description,
      active: body.active,
      cumulative: body.cumulative,
      validUntil: body.validUntil ?? null,
    },
  });

  return NextResponse.json(updated);
}
