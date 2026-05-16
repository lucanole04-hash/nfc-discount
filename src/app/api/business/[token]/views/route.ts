import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const business = await prisma.business.findUnique({ where: { token } });
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const userAgent = request.headers.get("user-agent") || null;

  await prisma.pageView.create({
    data: {
      businessId: business.id,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
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
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, today, week, month, last30Days] = await Promise.all([
    prisma.pageView.count({
      where: { businessId: business.id },
    }),
    prisma.pageView.count({
      where: { businessId: business.id, viewedAt: { gte: startOfToday } },
    }),
    prisma.pageView.count({
      where: { businessId: business.id, viewedAt: { gte: startOfWeek } },
    }),
    prisma.pageView.count({
      where: { businessId: business.id, viewedAt: { gte: startOfMonth } },
    }),
    prisma.pageView.groupBy({
      by: ["viewedAt"],
      where: {
        businessId: business.id,
        viewedAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
      },
      _count: true,
    }),
  ]);

  const dailyCounts: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dailyCounts[key] = 0;
  }
  for (const row of last30Days) {
    const key = new Date(row.viewedAt).toISOString().split("T")[0];
    if (key in dailyCounts) {
      dailyCounts[key] += row._count;
    }
  }

  const chart = Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json({ total, today, week, month, chart });
}
