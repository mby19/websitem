"use client";
// OTURUM DURUMU — header'daki "Giriş / Kayıt / Kullanıcı + Çıkış" alanı.
// Session'ı /api/auth/session'dan okur; çıkışı Auth.js form endpoint'ine POST'lar.
import { useEffect, useState } from "react";
import Link from "next/link";
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

  if (!loaded) {
    // Session gelene kadar sabit genişlikte iskelet: layout kayması (CLS) yok
    return <span className="inline-block h-4 w-20 animate-pulse rounded bg-neutral-800" />;
  }

  if (!user) {
    return (
      <div className="flex gap-3">
        <Link href="/giris" className="text-neutral-500 hover:text-neutral-300">signin</Link>
        <Link href="/kayit" className="text-neutral-500 hover:text-neutral-300">register</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-neutral-300">{user.name || user.email}</span>
      {/* Çıkış: form post → Auth.js endpoint'i cookie'yi siler ve callbackUrl'e döner. */}
      <form method="post" action="/api/auth/signout">
        <input type="hidden" name="csrfToken" value={csrfToken ?? ""} />
        <input type="hidden" name="callbackUrl" value="/" />
        <button type="submit" className="text-neutral-500 hover:text-diff-del">
          signout
        </button>
      </form>
    </div>
  );
}
