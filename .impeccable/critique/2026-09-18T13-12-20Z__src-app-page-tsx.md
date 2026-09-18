---
target: WebSim Mağaza ana sayfa
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/mby/Desktop/git repos/websitem/src/app/page.tsx"
target_fingerprint: "sha256:f98d8721776b4be618dbcdc65eb6d00ae3bed1b086591ff5121168e1c2476796"
target_path: /Users/mby/Desktop/git repos/websitem/src/app/page.tsx
timestamp: 2026-09-18T13-12-20Z
slug: src-app-page-tsx
---
# Critique v2 — WebSim Mağaza ana sayfa (re-run)

## Design Specificity Verdict
Şimdi ürüne özgüleşiyor. 1. turdaki "kategori-geçirilebilir" damgası döndü; kalan makas: peak anı (sepete ekleme) sessiz, mühendislik hikâyesi yüzeyde tek kelime yok.

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | ✓ Eklendi + rozet; animasyonsuz belirme − |
| 2 | Match System / Real World | 4 | Türkçe, Tükendi, tr-TRY — tam uyum |
| 3 | User Control and Freedom | 2 | Gridden adet düzenlenemiyor |
| 4 | Consistency and Standards | 3 | Fiyat Etiketi Kuralı ✓; Sepet NavLink değil − |
| 5 | Error Prevention | 2 | Azalan stok sinyalsiz |
| 6 | Recognition Rather Than Recall | 3 | Ürün-başına emoji katalog modelini kuruyor ✓ |
| 7 | Flexibility and Efficiency | 2 | Hızlı çoklu ekleme yok |
| 8 | Aesthetic and Minimalist | 3 | Tek aksan disiplinli; alt-başlık/footer tekrarı − |
| 9 | Error Recovery | 2 | Bozuk localStorage sessizce yutuluyor |
| 10 | Help and Documentation | 2 | Misafir siparişi cihaz-bağımlılığı söylenmiyor |
| **Total** | | **26/40** | |

## Deterministic Scan
- CLI detector: exit 0, [] — 17 dosya, 0 bulgu. 1. turdaki overused-font/Arial giderildi; detector sağlığı yapay probe ile doğrulandı.
- Tarayıcı overlay v1'deki low-contrast ×7 source düzeltmesiyle kapanmadı (dark:neutral-400); re-scan'de yok.

## Priority Issues
1. [P1] "Sepet" nav'da NavLink değil — aktif gösterge yok, rozetle uyumsuz. Fix: NavLink'e taşı.
2. [P1] Peak anı sessiz: rozet animasyonsuz; 0→1'de header kayması. Fix: min-w + key-re-mount pulse.
3. [P2] CV hikâyesi görünmez. Fix: footer'a repo linki + "transactional checkout, fiyat koruması" satırı.
4. [P2] Misafir siparişi cihaz-bağımlılığı söylenmiyor. Fix: Siparişler sayfasına tek satır not.
5. [P3] Emoji text-4xl küçük; stok ≤2'de ince mono "Son N" rozeti.

## Persona Red Flags
- Power User: gridden adet düzenlenemiyor; çoklu ekleme kart-kart.
- First-Timer: cihaz-bağımlılığı bilgisi yok; ikinci cihazda "kayboldu" sanacak.
- Görüşücü 30 sn: mühendislik hikâyesi hâlâ tek sinyalsiz; repo linki yeterli.

## Minor Observations
- CartBadge font-mono (DESIGN.md "mono rozet" drift adayı).
- Alt-başlık ile footer uyarısı kelimesi kelimesine tekrar ediyor — biri yeter.
- "Çıkış" hover kırmızı sinyali doğru; line-clamp-2 grid ritmini koruyor.
