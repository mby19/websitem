"use client";
// OTURUM DURUMU — header'daki "Giriş / Kayıt / Kullanıcı + Çıkış" alanı.
// Session'ı /api/auth/session'dan okur; çıkışı Auth.js form endpoint'ine POST'lar.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// /api/auth/session yanıtındaki kullanıcı alanı
type SessionUser = { id?: string; name?: string | null; email?: string | null } | null;

function useCsrfToken(enabled: boolean): string | null {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken))
      .catch(() => setCsrfToken(null));
  }, [enabled]);
  return csrfToken;
}

export function SessionMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser>(null);
  const [loaded, setLoaded] = useState(false);
  const csrfToken = useCsrfToken(Boolean(user));

  // Sayfa açılışında oturumu sorgula
  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((s) => setUser(s?.user ?? null))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null; // kırpışmayı önle: durum gelene kadar boş

  if (!user) {
    return (
      <div className="flex gap-3">
        <a href="/giris" className="hover:underline">Giriş</a>
        <a href="/kayit" className="hover:underline">Kayıt</a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{user.name || user.email}</span>
      {/* Çıkış: form post → Auth.js endpoint'i cookie'yi siler ve callbackUrl'e döner.
          Dönen sayfada bu component yeniden mount olur → "Giriş/Kayıt" görünür. */}
      <form method="post" action="/api/auth/signout">
        <input type="hidden" name="csrfToken" value={csrfToken ?? ""} />
        <input type="hidden" name="callbackUrl" value="/" />
        <button type="submit" className="text-sm text-neutral-500 hover:text-red-500">
          Çıkış
        </button>
      </form>
    </div>
  );
}
