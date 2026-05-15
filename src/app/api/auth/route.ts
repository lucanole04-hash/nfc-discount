import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const business = await prisma.business.findUnique({
    where: { email },
  });

  if (!business || business.password !== password) {
    return NextResponse.json(
      { error: "Credenziali non valide" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    token: business.token,
    name: business.name,
  });
}
