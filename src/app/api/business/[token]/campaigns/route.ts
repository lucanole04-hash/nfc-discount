import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const business = await prisma.business.findUnique({ where: { token } });
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { usages: true } } },
  });

  return NextResponse.json(campaigns);
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

  const campaign = await prisma.campaign.create({
    data: {
      businessId: business.id,
      title: body.title,
      discount: body.discount,
      description: body.description || "",
      promoCode: body.promoCode || "",
      color: body.color || "#f59e0b",
      active: body.active ?? true,
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
