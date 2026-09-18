"use client";
// NAV LİNK — aktif sayfada gri alt çizgi gösteren nav öğesi.
// (Mavi nav'da kullanılmaz: Fiyat Etiketi Kuralı — mavi yalnız satın alma yolunda.)
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  // "/urun/3" gibi alt yollar da "/urun"ün aktif hali sayılır
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={
        "border-b-2 pb-0.5 transition-colors hover:underline " +
        (active
          ? "border-neutral-400 dark:border-neutral-500"
          : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600")
      }
    >
      {children}
    </Link>
  );
}
