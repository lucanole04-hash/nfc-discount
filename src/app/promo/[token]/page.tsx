import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PromoCard } from "@/components/PromoCard";
import { TrackView } from "@/components/TrackView";

export default async function PromoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const business = await prisma.business.findUnique({
    where: { token },
    select: {
      name: true,
      logo: true,
      discount: true,
      description: true,
      message: true,
      active: true,
      validUntil: true,
      cumulative: true,
      primaryColor: true,
      secondaryColor: true,
      coverImage: true,
      welcomeMessage: true,
      phone: true,
      googleMaps: true,
      instagram: true,
      whatsapp: true,
      website: true,
    },
  });

  if (!business) {
    notFound();
  }

  const now = new Date();
  const campaigns = await prisma.campaign.findMany({
    where: {
      business: { token },
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
      <TrackView token={token} />
      <PromoCard
        business={business}
        campaigns={serializedCampaigns}
        token={token}
      />
    </main>
  );
}
