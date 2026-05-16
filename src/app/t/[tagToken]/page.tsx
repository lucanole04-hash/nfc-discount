import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PromoCard } from "@/components/PromoCard";

export default async function TagPromoPage({
  params,
}: {
  params: Promise<{ tagToken: string }>;
}) {
  const { tagToken } = await params;

  const tag = await prisma.nFCTag.findUnique({
    where: { token: tagToken },
    include: { business: true },
  });

  if (!tag || !tag.active) {
    notFound();
  }

  await prisma.nFCTag.update({
    where: { id: tag.id },
    data: {
      scans: { increment: 1 },
      lastUsed: new Date(),
    },
  });

  await prisma.pageView.create({
    data: {
      businessId: tag.businessId,
    },
  });

  const business = tag.business;

  const campaigns = await prisma.campaign.findMany({
    where: {
      businessId: business.id,
      active: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedCampaigns = campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    discount: c.discount,
    description: c.description,
    promoCode: c.promoCode,
    color: c.color,
    active: c.active,
    startDate: c.startDate.toISOString(),
    endDate: c.endDate?.toISOString() || null,
  }));

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PromoCard
        business={business}
        campaigns={serializedCampaigns}
        token={business.token}
        tagToken={tagToken}
      />
    </main>
  );
}
