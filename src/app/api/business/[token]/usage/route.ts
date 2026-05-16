import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  const usage = await prisma.discountUsage.create({
    data: {
      businessId: business.id,
      campaignId: body.campaignId || null,
    },
  });

  return NextResponse.json(usage, { status: 201 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const business = await prisma.business.findUnique({ where: { token } });
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [total, today] = await Promise.all([
    prisma.discountUsage.count({ where: { businessId: business.id } }),
    prisma.discountUsage.count({
      where: { businessId: business.id, usedAt: { gte: startOfToday } },
    }),
  ]);

  const recent = await prisma.discountUsage.findMany({
    where: { businessId: business.id },
    orderBy: { usedAt: "desc" },
    take: 10,
    include: { campaign: { select: { title: true, promoCode: true } } },
  });

  return NextResponse.json({ total, today, recent });
}
