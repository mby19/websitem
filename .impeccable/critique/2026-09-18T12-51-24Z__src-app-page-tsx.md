---
target: WebSim Mağaza ana sayfa
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:/Users/mby/Desktop/git repos/websitem/src/app/page.tsx"
target_fingerprint: "sha256:8f05113187aee326f904f91ac0ae714d5aa4b191b76f6d37dfe9ce25742a494a"
target_path: /Users/mby/Desktop/git repos/websitem/src/app/page.tsx
timestamp: 2026-09-18T12-51-24Z
slug: src-app-page-tsx
---
# Critique — WebSim Mağaza ana sayfa (src/app/page.tsx)

## Design Specificity Verdict

**Kategori-geçirilebilir; ürüne özgü değil.** Başlık ve footer cümlesi hariç sayfa herhangi bir Türkçe e-ticaret sitesi yerine konabilir. Ürünün gerçek kimliği (fiyat hile koruması, snapshot fiyat, transaction) sayfada tek sinyal vermiyor; vitrin 6 tekrar eden 📦'dan oluşuyor. İstisna imza detaylar: "✓ Eklendi" mikro-geri bildirimi ve mono sepet rozeti — 2-3 imza detay daha eklenirse verdict döner.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | "✓ Eklendi" + anlık rozet ✓; SessionMenu yükleme boşluğu − |
| 2 | Match System / Real World | 2 | Doğru kelimeler; demo doğası sadece footer'da |
| 3 | User Control and Freedom | 2 | Eklenen ürün geri alınamaz; ana sayfada adet ayarı yok |
| 4 | Consistency and Standards | 3 | Fiyat Etiketi Kuralı'na sadık; nav `<a>`/`<Link>` tutarsızlığı − |
| 5 | Error Prevention | 3 | Tükendi durumu ✓; stok üstü eklemede görsel uyarı yok |
| 6 | Recognition Rather Than Recall | 2 | Rozette içerik yok, yalnız sayı |
| 7 | Flexibility and Efficiency | 2 | 6 ürün için kabul edilebilir; arama/filtre yok |
| 8 | Aesthetic and Minimalist Design | 3 | Gerçekten sade; tekrar eden placeholder "boş" okunuyor |
| 9 | Error Recovery | 2 | Boş ürün durumu geliştirici yönlendirmeli metin ("npx prisma db seed") |
| 10 | Help and Documentation | 1 | Test modu açıklaması tek yerde, içeriksiz |
| **Total** | | **23/40** | **Ortalama altı — çalışan ama sıradan** |

## Deterministic Scan (Assessment B)

- CLI (`impeccable detect --json src/app src/components`): 1 bulgu — `overused-font` (globals.css:25, Arial). False positive olarak işaretlendi: kural yalnızca Inter/Roboto/Fraunces/Geist/PJS/Space Grotesk'i sayıyor, Arial listede değil; ANCAK canlı sayfada `font-family: Arial` gerçekten yükleniyor (bkz. aşağı) — kural false-positive, bulgu değil.
- Tarayıcı overlay (localhost:3000 + detect.js, injection başarılı): 15 bulgu / 14 eleman —
  - `low-contrast` ×7: `text-neutral-500` (#737373) koyu zeminde 4.2:1 (WCAG AA 4.5:1 altı) — ürün açıklamalarında, dark modda. Gerçek a11y hatası.
  - `overused-font` ×1: `body { font-family: Arial }` globals.css:25 — layout Geist yüklerken body CSS'i ezberliyor; DESIGN.md ile çelişen kod drift'i (gerçek bulgu, kategori etiketi yanlış).
  - `text-occlusion` ×6 + `dark-glow` ×1: detector'un kendi overlay etiketlerinin kapsadığı metinler ve overlay stili — injection kaynaklı false positive.

## Overall Impression

Temel operasyon akışı temiz; ama sayfa "şablon" okunuyor. En büyük fırsat: ürünün gerçek hikâyesi (dürüst mühendislik) görünmezken vitrin 6 aynı kutuyla mekanik duruyor. İki P0 düzeltmesi (ürün-başına emoji + mobil header) sayfanın algısını en hızlı değiştirir.

## What's Working

1. **Mavi aksan disiplini** — Fiyat Etiketi Kuralı kodda birebir; göz satın alma yoluna akıyor.
2. **Kart hiyerarşisi** — görsel→isim→açıklama→fiyat+buton; line-clamp ve flex-1 ile grid bozulmuyor.
3. **"✓ Eklendi" mikro-geri bildirim** — ekleme→onay döngüsü tek bakışta tamamlanıyor.

## Priority Issues

1. **[P0] Placeholder tekdüzeliği vitrini öldürüyor.** 6 ürünün 5'i aynı 📦; "dürüstlük" sahada "boş" okunuyor. Fix: ürün-başına uygun emoji (⌨️ 🖱️ 🔌 🖥️ 📷 💡) — hâlâ placeholder, ama kartlar ayrışır. Suggested command: `$impeccable delight`.
2. **[P0] Mobil header kırılıyor.** 488px'de marka iki satıra sarkıyor; görüşücü telefonu senaryosu yüksek. Fix: marka tek satır (`text-base`, `whitespace-nowrap`), nav wrap düzeni. Suggested command: `$impeccable adapt`.
3. **[P1] Demo/test doğası görünmüyor.** "Öğrenme amaçlı ama üretim kalitesi" hikâyesi sayfada sıfır sinyal. Fix: ana sayfaya tek satır alt-başlık ("Çalışan demo mağaza — sepet, stok ve checkout'u gerçek zamanlı deneyin; ödeme test modunda, ücret alınmaz"). Suggested command: `$impeccable clarify`.
4. **[P1] SessionMenu yükleme boşluğu (CLS).** Session gelene kadar header alanı boş; sabit genişlikte skeleton render et. Suggested command: `$impeccable polish`.
5. **[P2] Kendine link + boş Siparişler çıkmazı.** Aktif nav göstergesi yok (gri alt çizgi); boş sipariş sayfası yönlendirmesiz. Suggested command: `$impeccable polish`.

## Persona Red Flags

- **Power User:** Ana sayfada adet artırma yok; kart linki vs buton hedefi ayrışmamış — yanlış tıklama riski.
- **First-Timer:** "Siparişler" ilk ziyarette boş sayfa; test modu/ücret yok bilgisi görünmez → "gerçek para çekilir mi" korkusu taşınabilir.
- **Görüşücü 30 saniye:** İlk 10 sn'de "şablon" damgası; ürünün asıl hikâyesi (transaction, fiyat koruması) 30 sn'lik pencerede sıfır sinyal — sayfanın en etkileyici mühendisliği en gösterişsiz yüzeyde.

## Minor Observations

- Açıklama metni `text-neutral-500` dark modda WCAG AA altı (4.2:1) → `neutral-400`'e çek.
- "Giriş/Kayıt" `<a href>`, diğer nav `<Link>` — client-side nav kaybı (kod tutarlılığı).
- globals.css `body { font-family: Arial }` Geist'i ezüyor — `var(--font-geist-sans)` kullan (DESIGN.md ile çelişen drift).
- "Seed script çalıştırıldı mı?" metni geliştiriciye konuşuyor; ziyaretçi metni olmalı.
- Kart başlığı `hover:underline` — tıklama alanı başlıkla sınırlı değil, görsel sinyal dar.

## Questions to Consider

1. "Butik Dükkan" vitrininde tek çeşit kutu satılıyorsa bu butik mi, depo mu? Placeholder dili ürün başına kişiselleşmeden dürüstlük iddiası ayakta kalabilir mi?
2. Sayfanın en etkileyici mühendisliği görünmüyorsa, 30 saniyede bu mağaza neden farklı hissettiriyor? Cevap: şu an hissettirmiyor.
3. Mavi aksan disiplini yol gösteriyor ama nav'daki Operate eksiklerini de örtebilir mi — kural ne zaman standart olur?
