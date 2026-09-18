"use client";
// GİRİŞ SAYFASI — Auth.js'in HTTP form endpoint'ine (POST /api/auth/signin/credentials)
// doğrudan POST atar. Form post: cookie tarayıcıda set edilir, aynı istekte
// "/"'e yönlendirilir (hard navigation). Server action kullanmıyoruz çünkü
// signIn redirect'i client yönlendirmesiyle yarışıyor.
import { useEffect, useState } from "react";
import Link from "next/link";

type AuthFormProps = { onReady: (csrfToken: string) => void };

function useCsrfToken(): string | null {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken))
      .catch(() => setCsrfToken(null));
  }, []);
  return csrfToken;
}

export default function LoginPage() {
  const csrfToken = useCsrfToken();
  const [error, setError] = useState<string | null>(null);

  // Hatalı giriş: endpoint bize back-URL parametresiyle döner (error=CredentialsSignin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")) setError("E-posta veya şifre hatalı");
  }, []);

  return (
    <section className="mx-auto max-w-sm">
      <p className="font-mono text-sm text-neutral-500">
        websitem<span className="text-neutral-700">/</span>signin
      </p>
      <h1 className="mt-3 mb-6 text-2xl font-bold">Giriş yap</h1>
      <form
        className="space-y-4"
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={(e) => {
          if (!csrfToken) {
            e.preventDefault();
            setError("Sayfa hazır değil, tekrar dene");
          }
        }}
      >
        <input type="hidden" name="csrfToken" value={csrfToken ?? ""} />
        <input type="hidden" name="callbackUrl" value="/" />
        <div>
          <label htmlFor="email" className="mb-1 block font-mono text-xs text-neutral-500">E-posta</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded bg-neutral-900/60 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-amber"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-mono text-xs text-neutral-500">Şifre</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded bg-neutral-900/60 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-amber"
          />
        </div>
        {error && <p className="font-mono text-sm text-diff-del">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-amber px-4 py-2 font-medium text-neutral-950 hover:bg-amber-soft disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          signin
        </button>
        <p className="text-center font-mono text-xs text-neutral-500">
          hesabın yok mu? <Link href="/kayit" className="text-amber-soft hover:underline">register</Link>
        </p>
      </form>
    </section>
  );
}
