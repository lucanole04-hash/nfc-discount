import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { token: string; campaignId: string };

async function getBusiness(token: string) {
  return prisma.business.findUnique({ where: { token } });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { token, campaignId } = await params;

  const business = await getBusiness(token);
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, businessId: business.id },
    include: { _count: { select: { usages: true } } },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campagna non trovata" }, { status: 404 });
  }

  return NextResponse.json(campaign);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { token, campaignId } = await params;
  const body = await request.json();

  const business = await getBusiness(token);
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const campaign = await prisma.campaign.updateMany({
    where: { id: campaignId, businessId: business.id },
    data: {
      title: body.title,
      discount: body.discount,
      description: body.description,
      promoCode: body.promoCode,
      color: body.color,
      active: body.active,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });

  if (campaign.count === 0) {
    return NextResponse.json({ error: "Campagna non trovata" }, { status: 404 });
  }

  const updated = await prisma.campaign.findUnique({ where: { id: campaignId } });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { token, campaignId } = await params;

  const business = await getBusiness(token);
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  await prisma.discountUsage.deleteMany({ where: { campaignId } });
  const deleted = await prisma.campaign.deleteMany({
    where: { id: campaignId, businessId: business.id },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Campagna non trovata" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
