// POST /api/auth/register — yeni kullanıcı kaydı.
// Email + şifre alır; şifreyi bcrypt ile hash'leyip saklar.
// Aynı email ikinci kez gelirse 409 döner (benzersizlik DB'de de garanti).
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string; name?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  // Giriş doğrulaması: en azından biçim kontrolü
  if (!email || !email.includes("@") || password.length < 6) {
    return NextResponse.json(
      { error: "Geçerli e-posta ve en az 6 karakterli şifre gerekli" },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 409 });
  }

  // bcrypt: şifreyi tek yönlü hash'ler. cost=10 standart başlangıç.
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: { email, passwordHash, name: body.name?.trim() ?? "" },
    select: { id: true, email: true }, // hash'i asla döndürme!
  });

  return NextResponse.json(user, { status: 201 });
}
