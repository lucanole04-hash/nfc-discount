import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nome, email e password sono obbligatori" },
      { status: 400 }
    );
  }

  const existing = await prisma.business.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Esiste già un'attività con questa email" },
      { status: 409 }
    );
  }

  const token = uuidv4().slice(0, 12);

  const business = await prisma.business.create({
    data: {
      name,
      email,
      password,
      token,
      discount: body.discount ?? 10,
      description: body.description ?? "su tutti i servizi",
      message: body.message ?? "Grazie per essere nostro cliente!",
      active: true,
      cumulative: false,
    },
  });

  await prisma.discountHistory.create({
    data: {
      businessId: business.id,
      discount: business.discount,
      description: business.description,
      active: true,
      cumulative: false,
    },
  });

  return NextResponse.json({
    id: business.id,
    name: business.name,
    token: business.token,
    email: business.email,
  });
}
