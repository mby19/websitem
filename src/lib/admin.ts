// ADMIN YETKİ KATMANI — basit, deterministik, şema değişikliksiz.
// Yönetici: .env'deki ADMIN_EMAIL ile eşleşen oturum. Yeni admin:
// env'i değiştir + o email ile kayıt ol/giriş yap.
import { auth } from "@/lib/auth";

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || !session?.user?.email) return false;
  return session.user.email.toLowerCase() === adminEmail;
}
