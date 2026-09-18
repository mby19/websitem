"use client";
// KAYIT SAYFASI — /api/auth/register'a POST; başarılıysa Auth.js form
// endpoint'ine POST ile otomatik giriş. Cookie form post'ta doğrudan set edilir.
import { useEffect, useState } from "react";

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

export default function RegisterPage() {
  const csrfToken = useCsrfToken();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const data = new FormData(e.currentTarget);

    // 1) Kayıt isteği
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.get("email"),
        password: data.get("password"),
        name: data.get("name"),
      }),
    });

    // 2) Otomatik giriş: Auth.js callback endpoint'ine POST
    //    (form post → cookie set + hard navigation, yarış yok)
    const loginForm = document.createElement("form");
    loginForm.method = "post";
    loginForm.action = "/api/auth/callback/credentials";
    const fields: Array<[string, string]> = [
      ["csrfToken", String(csrfToken ?? "")],
      ["callbackUrl", window.location.origin + "/"],
      ["email", String(data.get("email"))],
      ["password", String(data.get("password"))],
    ];
    for (const [name, value] of fields) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      loginForm.appendChild(input);
    }
    document.body.appendChild(loginForm);
    loginForm.submit();
  }

  return (
    <section className="mx-auto max-w-sm">
      <p className="font-mono text-sm text-neutral-500">
        websitem<span className="text-neutral-700">/</span>register
      </p>
      <h1 className="mt-3 mb-6 text-2xl font-bold">Kayıt ol</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="mb-1 block font-mono text-xs text-neutral-500">Ad</label>
          <input id="name" name="name" type="text" autoComplete="name"
            className="w-full rounded bg-neutral-900/60 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-amber" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block font-mono text-xs text-neutral-500">E-posta</label>
          <input id="email" name="email" type="email" required autoComplete="email"
            className="w-full rounded bg-neutral-900/60 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-amber" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-mono text-xs text-neutral-500">Şifre</label>
          <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password"
            className="w-full rounded bg-neutral-900/60 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-amber" />
        </div>
        {error && <p className="font-mono text-sm text-diff-del">{error}</p>}
        <button type="submit" disabled={busy || !csrfToken}
          className="w-full rounded bg-amber px-4 py-2 font-medium text-neutral-950 hover:bg-amber-soft disabled:bg-neutral-800 disabled:text-neutral-500">
          {busy ? "kayıt olunuyor…" : "register"}
        </button>
        <p className="text-center font-mono text-xs text-neutral-500">
          zaten hesabın var mı? <a href="/giris" className="text-amber-soft hover:underline">signin</a>
        </p>
      </form>
    </section>
  );
}
