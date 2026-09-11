import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { CartBadge } from "@/components/cart-badge";
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
  description: "Öğrenme amaçlı e-ticaret projesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* CartProvider: sepet state'ini tüm sayfalara sağlar */}
        <CartProvider>
          <header className="border-b border-neutral-200 dark:border-neutral-800">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="text-lg font-bold">
                WebSim Mağaza
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/" className="hover:underline">
                  Ürünler
                </Link>
                <Link href="/sepet" className="hover:underline">
                  Sepet <CartBadge />
                </Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          <footer className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800">
            Öğrenme amaçlı demo mağaza — ödemeler test modundadır.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
