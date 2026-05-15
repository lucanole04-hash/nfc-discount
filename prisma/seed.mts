import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "La Tua Attività",
      token: "demo-abc123",
      discount: 15,
      description: "su tutti i servizi",
      message: "Grazie per essere nostro cliente!",
      active: true,
      validUntil: null,
      cumulative: false,
      email: "demo@example.com",
      password: "demo1234",
    },
  });

  await prisma.discountHistory.create({
    data: {
      businessId: business.id,
      discount: 15,
      description: "su tutti i servizi",
      active: true,
      cumulative: false,
      validUntil: null,
    },
  });

  console.log("Seed completato:", business);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
