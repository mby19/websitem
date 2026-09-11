// AUTH YAPILANDIRMASI — Auth.js v5 (next-auth) + Credentials provider.
// Email + şifre ile giriş. Şifreler bcrypt hash'li saklanır (asla düz metin!).
// Session: JWT (cookies). Adapter kullanmıyoruz çünkü credentials provider
// oturumları veritabanında değil, imzalı JWT'de tutar.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Bir kullanıcının "girişli" sayılmasını sağlayan güvenlik zinciri:
  // email → kullanıcı bul → bcrypt compare → JWT'ye taşı
  // Hatalı giriş, kullanıcıyı BİZİM giriş sayfamıza yönlendirsin
  // (Auth.js'in kendi ara sayfası yerine; error parametresiyle gelir)
  pages: { signIn: "/giris" },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      // Giriş denemesi: credentials doğrulaması
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null; // kullanıcı yok: giriş reddi (hangi alan yanlış söylenmez)

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
  // JWT içine koyulacak alanlar (session'da okunur)
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id; // id string olarak taşınır (JWT standardı)
      return token;
    },
    async session({ session, token }) {
      // Auth.js'in session.user.id string bekler; sayıya ihtiyaç duyulan yerde Number() kullan
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
