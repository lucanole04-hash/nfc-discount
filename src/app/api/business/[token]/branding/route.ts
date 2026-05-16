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
      primaryColor: true,
      secondaryColor: true,
      coverImage: true,
      welcomeMessage: true,
      logo: true,
      phone: true,
      googleMaps: true,
      instagram: true,
      whatsapp: true,
      website: true,
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
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
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const updated = await prisma.business.update({
    where: { token },
    data: {
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      coverImage: body.coverImage,
      welcomeMessage: body.welcomeMessage,
      logo: body.logo,
      phone: body.phone,
      googleMaps: body.googleMaps,
      instagram: body.instagram,
      whatsapp: body.whatsapp,
      website: body.website,
    },
    select: {
      primaryColor: true,
      secondaryColor: true,
      coverImage: true,
      welcomeMessage: true,
      logo: true,
      phone: true,
      googleMaps: true,
      instagram: true,
      whatsapp: true,
      website: true,
    },
  });

  return NextResponse.json(updated);
}
