"use server";
// ADMIN SERVER ACTIONS — ürün CRUD. Her action isAdmin() guard'ından geçer:
// yetkisiz çağrı { error } döner, hiçbir değişiklik yapmaz.
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { consumeTick } from "@/lib/kafka-consume";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// TL girişini kuruşa çevir: "1.299,90" / "1299.90" / "1299" hepsi çalışır
function parsePriceTL(input: FormDataEntryValue | null): number | null {
  if (typeof input !== "string") return null;
  const normalized = input.replace(/\./g, "").replace(",", ".").trim();
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100); // kuruş
}

function readProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "📦").trim().slice(0, 4) || "📦";
  const priceCents = parsePriceTL(formData.get("price"));
  const stockRaw = Number(String(formData.get("stock") ?? ""));
  const stock = Number.isInteger(stockRaw) && stockRaw >= 0 ? stockRaw : null;

  if (!name || priceCents === null || stock === null) return null;
  return { name, description, emoji, priceCents, stock };
}

export async function createProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/giris?error=Yetkisiz");

  const data = readProductForm(formData);
  if (!data) redirect(`/admin?err=${encodeURIComponent("Geçersiz alanlar")}`);

  await db.product.create({ data });
  revalidatePath("/admin");
  revalidatePath("/");
  redirect(`/admin?ok=${encodeURIComponent("yeni ürün oluşturuldu")}`);
}

export async function updateProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/giris?error=Yetkisiz");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) redirect(`/admin?err=${encodeURIComponent("Geçersiz ürün")}`);

  const data = readProductForm(formData);
  if (!data) redirect(`/admin?err=${encodeURIComponent("Geçersiz alanlar")}`);

  await db.product.update({ where: { id }, data });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/urun/${id}`);
  redirect(`/admin?ok=${encodeURIComponent("ürün kaydedildi")}`);
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/giris?error=Yetkisiz");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) redirect(`/admin?err=${encodeURIComponent("Geçersiz ürün")}`);

  // Referans bütünlüğü: sipariş geçmişinde varsa silinmez (fiyat snapshot'ı koruması)
  const orderItemCount = await db.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    redirect(`/admin?err=${encodeURIComponent("Bu ürün silinemez: sipariş geçmişinde var (stoğu 0'a çek)")}`);
  }

  await db.product.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
  redirect(`/admin?ok=${encodeURIComponent("ürün silindi")}`);
}

// CONSUMER TICK — Kafka'dan elle parti tüket (admin butonu tetikler).
export async function consumeTickAction() {
  if (!(await isAdmin())) redirect("/giris?error=Yetkisiz");

  const result = await consumeTick();
  if ("error" in result) {
    redirect(`/admin?err=${encodeURIComponent(result.error)}`);
  }
  revalidatePath("/admin");
  redirect(`/admin?ok=${encodeURIComponent(`${result.consumed} yeni event kayda geçti`)}`);
}
