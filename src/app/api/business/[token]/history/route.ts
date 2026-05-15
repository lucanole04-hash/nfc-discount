import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const business = await prisma.business.findUnique({ where: { token } });
  if (!business) {
    return NextResponse.json(
      { error: "Attività non trovata" },
      { status: 404 }
    );
  }

  const history = await prisma.discountHistory.findMany({
    where: { businessId: business.id },
    orderBy: { changedAt: "desc" },
    take: 20,
  });

  return NextResponse.json(history);
}
