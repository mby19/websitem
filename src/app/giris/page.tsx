"use client";
// GİRİŞ SAYFASI — Auth.js'in HTTP form endpoint'ine (POST /api/auth/signin/credentials)
// doğrudan POST atar. Form post: cookie tarayıcıda set edilir, aynı istekte
// "/"'e yönlendirilir (hard navigation). Server action kullanmıyoruz çünkü
// signIn redirect'i client yönlendirmesiyle yarışıyor.
import { useEffect, useState } from "react";

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
      <h1 className="mb-6 text-2xl font-bold">Giriş Yap</h1>
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
        <input type="hidden" name="callbackUrl" value={typeof window !== "undefined" ? window.location.origin + "/" : "/"} />
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">E-posta</label>
          <input id="email" name="email" type="email" required autoComplete="email"
            className="w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Şifre</label>
          <input id="password" name="password" type="password" required autoComplete="current-password"
            className="w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-neutral-400">
          Giriş Yap
        </button>
        <p className="text-center text-sm text-neutral-500">
          Hesabın yok mu? <a href="/kayit" className="text-blue-600 hover:underline">Kayıt ol</a>
        </p>
      </form>
    </section>
  );
}
