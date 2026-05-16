import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { token: string; tagId: string };

export async function PUT(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { token, tagId } = await params;
  const body = await request.json();

  const business = await prisma.business.findUnique({ where: { token } });
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const updated = await prisma.nFCTag.updateMany({
    where: { id: tagId, businessId: business.id },
    data: {
      label: body.label,
      active: body.active,
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Tag non trovato" }, { status: 404 });
  }

  const tag = await prisma.nFCTag.findUnique({ where: { id: tagId } });
  return NextResponse.json(tag);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { token, tagId } = await params;

  const business = await prisma.business.findUnique({ where: { token } });
  if (!business) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const deleted = await prisma.nFCTag.deleteMany({
    where: { id: tagId, businessId: business.id },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Tag non trovato" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
