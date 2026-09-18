---
name: WebSim Mağaza
description: Her sipariş kayda geçer — canlı checkout transcript'i olan emissive koyu demo mağaza (Next.js + Prisma)
colors:
  amber: "#ffb224"
  amber-soft: "#ffcd63"
  diff-add: "#4ade80"
  diff-del: "#f87171"
  background: "#0a0a0a"
  foreground: "#fafafa"
  surface-1: "#141414"
  surface-2: "#1c1c1c"
  surface-3: "#242424"
  panel: "#171717"
  panel-veil: "rgba(23, 23, 23, 0.6)"
  control: "#262626"
  control-hover: "#404040"
  text-dim: "#d4d4d4"
  text-muted: "#a3a3a3"
  text-faint: "#737373"
  hairline: "#171717"
typography:
  display:
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  micro:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "6px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "#0a0a0a"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "{colors.amber-soft}"
    textColor: "#0a0a0a"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-primary-disabled:
    backgroundColor: "{colors.control}"
    textColor: "{colors.text-faint}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-secondary:
    backgroundColor: "{colors.control}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  input-text:
    backgroundColor: "{colors.panel-veil}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  cart-badge:
    backgroundColor: "{colors.amber}"
    textColor: "#0a0a0a"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  transcript-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "16px"
  product-card:
    backgroundColor: "{colors.panel-veil}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: WebSim Mağaza

## Overview

**Creative North Star: "Commit Transcript"**

Bu mağaza bir konsol gibi okunur. Sayfa açıldığında kullanıcı bir vitrinle değil,
canlı bir işlem kaydıyla karşılaşır: gerçek siparişler mono satırlar hâlinde,
`▸` ibresiyle, yanıp sönen amber caret'ın nabzında. Derinlik yoktur — karanlık
tek bir zemin; önleme katmanları zemin tonunun birer adım açılmasıyla (`#0a0a0a`
→ `#141414` → `#171717` → `#1c1c1c` → `#242424`) elde edilir. Kutu yok: 1px
borderlı kart kabukları ve gölgeler yerine zemin adımı + boşluk konuşur.

Işık modu yok — bu mağazanın sahnesi karanlıkta okunan bir konsoldur. Tek sinyal
rengi amber'dır: canlılığı (transcript, caret, "· canlı" ibaresi) ve satın alma
yolunu (CTA butonları, sepet rozeti) işaretler. Yeşil ve kırmızı dekorasyon
değildir, transcript semantiğidir: `+` satır eklenmiş demektir, `PAID` yeşildir,
tükendi/kaldır/hata kırmızıdır. Emoji placeholder'lar dürüstlüğün parçasıdır:
görsel yoksa alan yalan söylemez.

**Key Characteristics:**
- Emissive koyu zemin, ışık modu yok; nötrler 4–5 derinlik adımı
- Tek sinyal rengi amber; diff-add/del yalnız transcript semantiği + negatif durum
- Kutu yok: derinlik zemin tonu adımlarıyla, hairline yalnız header/footer
- Transcript dili: `▸` ibre, `#id`, `·` ayraç, `PAID`, yanıp sönen caret
- Geist Sans (insan cümlesi) + Geist Mono (makine/veri/etiket) ikilisi
- Hareket tek seferlik ve küçük: caret blink, badge pulse, line-in

## Colors

Palet, karanlık bir zemin üzerinde tek sıcak sinyale (amber) sahip bir konsol
grubudur; yeşil/kırmızı yalnız diff semantiği taşır.

### Primary
- **Sinyal Amber** (#ffb224): Sistemin nabzı. Transcript'te `▸` ibre ve caret'ta,
  satın alma yolunda CTA zeminleri ve sepet rozetinde, ürün detayında fiyatın
  rengi olarak. Sayfada ≤%10 alan; nadirliği etkinliği sağlar.
- **Amber Yumuşak** (#ffcd63): Amber'ın hover adımı — CTA hover zeminleri ve
  link vurguları (`order #id`, `register`). Kendi hover'ı olmayan ikincil taşımalar.

### Tertiary (diff semantiği)
- **Diff Ekle** (#4ade80): Yalnız transcript dilinde pozitif anlam — sipariş
  detayındaki `+` satır işareti, `PAID` ve `status: PAID`. Hiçbir yerde
  buton veya dekorasyon değildir.
- **Diff Sil** (#f87171): Transcript + negatif durum: `Tükendi`, sepet satırı
  kaldırma `✕`, `signout`, form/checkout hata mesajları.

### Neutral
- **Sahne Zemin** (#0a0a0a): Gövde zemini; aynı zamanda ürün görsel kuyusu ve
  sipariş terminalinin iç zemini (`neutral-950`) — en derin adım.
- **Yüzey-1** (#141414): İlk derinlik adımı (token); henüz yüzeylere ayrılmamış ara ton.
- **Panel** (#171717): Transcript paneli ve hover'a çıkan satır zeminleri
  (`neutral-900`); header/footer hairline rengi.
- **Yüzey-2** (#1c1c1c): İkinci derinlik adımı (token).
- **Kontrol** (#262626): İkincil butonlar (`boşalt`, ± steppers) ve iskelet
  barları (`neutral-800`).
- **Yüzey-3** (#242424): Üçüncü derinlik adımı (token).
- **Kontrol Hover** (#404040): İkincil kontrollerin hover adımı (`neutral-700`).
- **Yazı Soluk** (#d4d4d4): Ürün adları, transcript satır içeriği (`neutral-300`).
- **Yazı Muted** (#a3a3a3): Açıklama paragrafları, saat damgaları, etiketler (`neutral-400`).
- **Yazı Faint** (#737373): Pasif nav, ayraç `·`, micro etiketler (`neutral-500`).
- **İvory** (#fafafa): Ön plan metni — başlıklar, fiyatlar, aktif nav (`foreground`).

### Named Rules
**Tek Sinyal Kuralı.** Amber tek sinyal rengidir: canlılığı ve satın alma yolunu
işaretler. Metin olarak asla paragraf doldurmaz; işaret (`▸`, `·`, hero'daki
nokta) ve eylem (CTA, rozet, fiyat) olarak kullanılır.

**Diff Semantiği Kuralı.** Yeşil yalnız `+`/`PAID`/`status` pozitifliği taşır;
kırmızı yalnız transcript semantiği ve negatif durumdur (tükendi, kaldır,
signout, hata). İkisi de asla dekorasyon değildir.

## Typography

**Display Font:** Geist Sans (Arial fallback)
**Body Font:** Geist Sans (Arial fallback)
**Label/Mono Font:** Geist Mono

**Character:** Tek mühendis ikilisi: insan cümlesi sans'la konuşur, makine ve
veri mono'yla konuşur. Bir metin veri mi, cümle mi? Sorusu font seçimini belirler.

### Hierarchy
- **Display** (700, 4xl→5xl, tracking-tight, 1.1): Yalnız ana sayfa hero'su.
- **Headline** (700, 2xl–3xl, 1.2): Sayfa başlıkları ("Siparişin alındı", "Kayıt ol").
- **Title** (700, xl, 1.4): Bölüm başlıkları ("Vitrin"), kart adları (semibold 1rem).
- **Body** (400, sm–base, 1.5, muted #a3a3a3): Açıklamalar; kart açıklaması
  `line-clamp-2` ile 2 satıra kısıtlı.
- **Label** (400, sm mono, 1.625): Transcript satırları, nav, fiyatlar, buton
  metinleri (checkout), stok satırları.
- **Micro** (400, xs mono): Form etiketleri, footer mühendislik satırı,
  "Son {stock}" uyarıları, rozet sayısı.

### Named Rules
**Mono Konuşur Kuralı.** Mono yalnız makine sesidir: transcript, nav, etiket,
fiyat, durum. İnsan cümlesi (başlık, paragraf) her zaman Geist Sans'tır.

## Layout

- Konteyner: `max-w-5xl` (1024px), yatay `px-4` (16px); ana içerik `py-8` (32px).
- Header: tek satır, `py-3` (12px), alt hairline `border-neutral-900`; marka
  solda sans semibold + amber `▸`, nav sağda mono.
- Bölüm ritmi: ana sayfa bölümleri arası `space-y-16` (64px); kart içi `p-4` (16px).
- Ürün ızgarası: 1/2/3 kolon (mobil/tablet/masaüstü), `gap-3` (12px).
- Form sayfaları (giriş/kayıt) `max-w-sm`; ürün detayı `max-w-2xl`; sipariş
  detayı `max-w-lg` — okuma genişliği dar tutulur.
- Footer: üst hairline, ortalanmış micro mono; repo linki + mühendislik satırı.

## Elevation & Depth

Sistem **tamamen düzdür: hiçbir gölge yok.** Derinlik, karanlık zemine karşı
açılan ton adımlarıyla kurulur: en derin kuyu `#0a0a0a` (görsel alanları, sipariş
terminali), panel `#171717`, satır bekleme `rgba(23,23,23,0.6)` (hover'da tam
`#171717`'e dolar), kontroller `#262626`. Hairline (`1px #171717`) yalnız iki
yerde kullanılır: header'ın altı ve footer'ın üstü — içeride bölme çizgisi
yoktur, sipariş terminalindeki `border-t` TOPLAM ayracı tek istisnadır.

### Shadow Vocabulary
Yok. Derinlik ihtiyacı = zemin adımı; hiçbir bileşende `box-shadow` kullanılmaz.

### Named Rules
**Kutu Yok Kuralı.** Derinlik zemin tonu adımıdır, çerçeve değil. 1px borderlı
kart kabukları, gölgeler ve kutu çizimleri yok; hairline yalnız header/footer'dır.

## Shapes

- Varsayılan radius: 4px (`rounded`) — butonlar, inputlar, görsel kuyuları.
- Paneller: 6px (`rounded-md`) — transcript, sipariş terminali, kartlar, iskelet.
- Tek full-radius istisnalar: sepet rozeti ve scrollbar thumb (`9999px`).
- Kenarlık dili: içerikte çizgi yok; header/footer hairline + terminal TOPLAM
  ayracı dışında form, kart veya satır çerçevesi bulunmaz.
- İkonlar SVG'dir; emoji yalnız ürün placeholder'ı olarak kullanılır — ikon
  gerektiren hiçbir yerde emoji ikon yoktur.

## Components

### Buttons
- **Shape:** 4px radius, kompakt padding (6×12 veya 8×16 hero/form varyantı)
- **Primary:** Sinyal Amber zemin (#ffb224), neredeyse siyah metin (#0a0a0a),
  font-medium; checkout butonu mono konuşur.
- **Hover / Focus:** hover'da Amber Yumuşak (#ffcd63); disabled: Kontrol zemin
  (#262626) + Faint metin (#737373).
- **Secondary:** Kontrol zemini (#262626), ivory metin, mono; hover #404040
  (`boşalt`, ± steppers).
- **Text-destructive:** çıplak metin — pasif #737373, hover'da Diff Sil (#f87171)
  (`signout`, sepet `✕`).

### Transcript (Signature)
- **Panel:** 6px radius, Panel zemini (#171717), 16px padding, mono sm,
  `leading-relaxed`, yatay taşmada `overflow-x-auto`.
- **Satır anatomisi:** `▸` (amber) · `order` (muted) · `#id` (amber-soft) ·
  `·` ayraç (faint) · ürün adı (#d4d4d4) · fiyat (ivory) · `PAID` (diff-add) ·
  saat (muted).
- **Boş durum:** "transcript boş —" + caret; yükleme: 3 pulse bar (#262626).
- **Caret:** 0.55em × 1em amber blok, `step-end` 1.1s blink; transcriptin tek
  nabzı, satır başında tek authour.
- **Giriş:** yeni en üst satır `line-in` (0.3s, -4px'den düşer); 30 sn'de bir sessiz tazeleme.

### Order Terminal (Signature)
- Sipariş detayı bir commit kaydı gibi okunur: en derin zemin (#0a0a0a) içinde
  mono satırlar, her kalem `+` (diff-add) ile başlar, TOPLAM `border-t` (#171717)
  ayracıyla ayrılır, `status: PAID` diff-add.

### Inputs / Fields
- **Style:** 4px radius, `rgba(23,23,23,0.6)` zemin, çerçevesiz, 8×12 padding.
- **Focus:** `focus:ring-2` Amber; global `:focus-visible` 2px amber outline
  (offset 2px) — odak her zaman amber'dır.
- **Label / Error:** mono xs Faint etiket üstte; hata mono sm Diff Sil.

### Navigation
- Header nav mono sm: aktif sayfa ivory + 6px amber nokta öncesinde; pasif
  #737373, hover #d4d4d4. Alt çizgi/kutu yok — aktiflik nokta + renk adımıdır.
- Marka: sans semibold + amber `▸` öneki; session "signin/register" pasif nav gibidir.

### Cart Badge
- **Style:** full radius, Amber zemin, #0a0a0a mono xs metin, `min-w-5` (0→1
  geçişinde header kayması yok).
- **Pulse:** her adet değişiminde `badge-pulse` (0.3s ease-out, 0.6→1.15→1 scale).

### Product Card
- **Panel:** 6px radius, `rgba(23,23,23,0.6)` zemin, 16px padding; hover'da tam
  Panel'e (#171717) `transition-colors` ile kararma.
- **Görsel kuyusu:** 144px, en derin zemin (#0a0a0a), 6xl emoji placeholder.
- **Fiyat/stok:** mono font-medium; stok ≤2 ise micro mono "Son {n}"; tükenmişse
  Diff Sil "Tükendi".

## Do's and Don'ts

### Do:
- **Do** amber'ı canlılık ve satın alma yolunda kullan: CTA zeminleri, sepet
  rozeti, `▸` ibre, caret, ürün detay fiyatı (#ffb224; hover #ffcd63).
- **Do** derinliği zemin adımıyla kur: kuyu #0a0a0a → panel #171717 → satır
  rgba(23,23,23,0.6) → kontrol #262626.
- **Do** transcript dilini koru: `▸` amber, `#id` amber-soft, `·` ayraç faint,
  `PAID` diff-add, caret yanıp söner; veri gerçek DB'den gelir, sahte satır yok.
- **Do** odak ve seçimi amber tut: `:focus-visible` 2px amber outline, `::selection`
  amber zemin + #0a0a0a metin.
- **Do** veri/etiket/finansal değerleri Geist Mono ile, cümleleri Geist Sans ile yaz.
- **Do** parayı `Intl.NumberFormat("tr-TRY")` ile, kuruş tabanlı göster.

### Don't:
- **Don't** ikinci bir aksan rengi (mavi vb.) ekleme; tek sinyal amber'dır.
- **Don't** diff-add'i buton/dekorasyon yap; yeşil yalnız `+`/`PAID`/`status`
  pozitifliğidir. diff-del'i transcript + negatif durumun dışına çıkarma.
- **Don't** kartlara 1px border, gölge veya kutu çizimi ekle; derinlik zemin
  tonu adımıdır (Kutu Yok Kuralı).
- **Don't** amber'ı uzun metin bloklarında kullan; amber işaret ve eylemdir, paragraf rengi değil.
- **Don't** transcript'e sahte/doldurma satırı ekle; çevrimdışılık sessizce eski satırları gösterir.
- **Don't** ikon gerektiren yere emoji ikon koy; emoji yalnız ürün placeholder'ıdır.
- **Don't** giriş animasyonlarını çoğalt; hareket üç tek seferliktir: caret-blink,
  badge-pulse, line-in.
