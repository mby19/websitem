---
name: WebSim Mağaza
description: Öğrenme amaçlı, gerçek mekanizmalı e-ticaret demo mağazası (Next.js + Prisma)
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  danger: "#dc2626"
  success: "#16a34a"
  surface: "#ffffff"
  surface-alt: "#f5f5f5"
  surface-dark: "#171717"
  surface-dark-alt: "#0a0a0a"
  ink: "#171717"
  ink-soft: "#737373"
  line: "#e5e5e5"
  line-dark: "#262626"
typography:
  display:
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "0.75rem"
    fontWeight: 400
rounded:
  sm: "4px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "16px"
---

# Design System: WebSim Mağaza

## Overview

**Creative North Star: "Butik Dükkan"**

Sistem, küçük ama derli toplu bir fiziksel mağaza düzeni gibi davranır:
giriş kapısı (header) tek satır, vitrin (ürün kartları) eşit göz hizasında,
kasa (sepet/checkout) açık ve dürüst. Süs yok; sıcaklık nötr yüzeylerden ve
net tipografiden gelir. Her interaksiyonun bir "fiyat etiketi" gibi okunabilir
ve tek vurgu rengi (blue) yalnızca satın alma yolunu işaretlemesi beklenir.

**Key Characteristics:**
- Tek aksan (blue) yalnızca eylem/CTA ve badge'de
- Yüzeyler nötr, ince 1px çizgilerle bölümlenmiş
- Görsel varlık yok; ürün alanı dengeli placeholder ile temsil edilir
- Koyu mod Tailwind otomatik sistem tercihiyle eşleşir

## Colors

Palet, tek mavi aksan etrafında dönen sıcak olmayan nötr bir gruptur.

### Primary
- **Butik Mavi** (#2563eb): Tüm "Satın Alma" yolu — Sepete Ekle, Ödemeye Geç,
  badge. Sitede ≤10% alan; nadirliği etkinliği sağlar.

### Neutral
- **Zemin Beyazı** (#ffffff): Kart ve sayfa zeminleri.
- **Beton Nötr** (#f5f5f5): Placeholder yüzeyler (ürün görsel alanı), hover zeminleri.
- **İspirto Mürekkep** (#171717): Metin, başlıklar; dark modda zemin.
- **Kül Çizgi** (#e5e5e5): 1px kart/bölme çizgileri.

### Named Rules (optional, powerful)
**Fiyat Etiketi Kuralı.** Mavi yalnızca satın alma yolu ve durum rozetlerinde
kullanılır; başlık, link ve metin aksanı olarak kullanılmaz.

## Typography

**Display Font:** Geist Sans (Arial fallback)
**Body Font:** Geist Sans (Arial fallback)
**Label/Mono Font:** Geist Mono

**Character:** Tek aile, iki ton (sans + mono); mühendislik ürününe
uygun az konuşan tipografi.

### Hierarchy
- **Display** (700, 1.5rem, 1.3): Sayfa başlıkları, marka adı.
- **Body** (400, 0.875–1rem, 1.5): Ürün açıklamaları, form etiketleri.
- **Label** (400–500, 0.75rem, mono): rozet, durum metni, footer.

## Layout

- Konteyner: `max-w-5xl`, yatay padding 16px.
- Ürün ızgarası: 1/2/3 kolon (mobil/tablet/masaüstü), gap 16px.
- Ritim: bölüm araları 24–32px; kart içi 16px.
- Responsive: Tailwind varsayılan kırılımları (sm/lg), mobilde tek kolon.

## Elevation & Depth

Sistem düz-baskındır; derinlik yalnızca hover'da tek kademeli gölge ile
gelir. Placeholder alanlar zemin farkıyla (surface-alt) tanımlanır.

### Shadow Vocabulary
- **Hover lift** (`hover:shadow-md`): ürün kartı ve satır etkileşiminde.

### Named Rules
**Düz-ve-Sabit Kural.** Gölge sadece durum yanıtı olarak görünür; boşluk
ve çizgi, düzenin gerçek derinlik aracıdır.

## Shapes

- Radius: küçük tutarlı (4px); rozet istisna (full).
- Sınırlar: 1px nötr çizgiler her yerde; gölge ile bölme yok.

## Components

### Buttons
- **Shape:** 4px radius, kompakt padding (6×12)
- **Primary:** Butik Mavi zemin, beyaz metin; disabled gri
- **Ghost:** çizgili (1px border), hover'da hafif yüzey kararması
- **Hover / Focus:** renk adımı (600→700); focus ring varsayılan tarayıcı

### Cards / Containers
- **Corner:** 4px
- **Border:** 1px `line`; dark'ta `line-dark`
- **Shadow Strategy:** hover-only (bkz. Elevation)
- **Internal Padding:** 16px

### Inputs / Fields
- **Style:** 1px border, 4px radius, blok genişlik
- **Focus:** tarayıcı varsayılan; hata metni kırmızı (danger)

### Navigation
- Header: 1px alt çizgi; marka sola, eylemler sağa; mono rozet sepet sayısı.

### Placeholder Görsel Alanı (Signature)
- Ürün görseli yok; 144px yüksekliğinde surface-alt zemin + 📦 emoji.
- Sistemin dürüstlük işareti: görsel yoksa boşluk yalan söylemez.

## Do's and Don'ts

### Do:
- **Do** maviyi yalnızca satın alma yolunda kullan (buton, badge).
- **Do** yüzey hiyerarşisini 1px çizgi + nötr zemin farkıyla kur.
- **Do** parasal değerleri `Intl.NumberFormat` "tr-TRY" ile göster.

### Don't:
- **Don't** başlık/paragrafta renkli metin kullan (mavi metin yok).
- **Don't** placeholder görselleri "gerçek" görselle tanıştırmadan
  dek süsle; dolgu hikâyesi anlatma.
- **Don't** gölgeyi statik derinlik aracı olarak kullan (hover-only).
