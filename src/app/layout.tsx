import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { CartBadge } from "@/components/cart-badge";
import { NavLink } from "@/components/nav-link";
import { SessionMenu } from "@/components/session-menu";
import { isAdmin } from "@/lib/admin";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebSim Mağaza",
  description: "Gerçekten çalışan demo e-ticaret — transactional checkout, fiyat koruması",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await isAdmin();
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* CartProvider: sepet state'ini tüm sayfalara sağlar */}
        <CartProvider>
          {/* Header: konsol satırı — marka + mono durum + nav */}
          <header className="border-b border-neutral-900">
            <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-3">
              <Link href="/" className="whitespace-nowrap text-sm font-semibold">
                <span className="text-amber">▸</span> WebSim Mağaza
              </Link>
              <div className="flex items-center gap-3 sm:gap-4 font-mono text-sm">
                <NavLink href="/">vitrin</NavLink>
                <NavLink href="/siparisler">orders</NavLink>
                <NavLink href="/sepet">
                  sepet <CartBadge />
                </NavLink>
                {admin && <NavLink href="/admin">admin</NavLink>}
                <SessionMenu />
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          <footer className="border-t border-neutral-900 py-6 text-center font-mono text-xs text-neutral-400">
            <p>
              transactional checkout · fiyat koruması · snapshot fiyatlaması —{" "}
              <a
                href="https://github.com/mby19/websitem"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-neutral-300"
              >
                github.com/mby19/websitem
              </a>
            </p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
