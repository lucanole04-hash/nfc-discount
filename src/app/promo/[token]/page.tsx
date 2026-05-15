import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PromoCard } from "@/components/PromoCard";

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
    },
  });

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PromoCard business={business} />
    </main>
  );
}
