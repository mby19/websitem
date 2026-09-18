---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Surface Brief: Ana sayfa (ve site sistemi)

## Scope & Mode
Tüm site sistemi; ana sayfa Persuade (tanıtım+eylem), mağaza sayfaları Operate.

## Audience & Job
Görüşücü/kullanıcı: linki açan kişi 30 sn içinde "bu gerçek çalışan bir demo mu" kararını verir; ikincil kullanıcı öğrenme yolculuğu sahibi.

## Story / Proof
İlk viewportta üç gerçek kanıt: (1) canlı checkout transcripti — Neon DBden gerçek son siparişler mono satırlarla, (2) amber caret satır başında canlı sinyali, (3) footer repo linki + mühendislik satırı. Ürün vitrini transcriptin altında gelir.

## Constraints
- Kutu yok: 1px borderlı kart kabukları yerine derinlik adımları (zemin tonu) ve boşluk
- Renk sözleşmesi: amber = canlı/transcript işaretçisi; diff-del (kırmızı) = transcript semantiği VE negatif durum (tükendi, kaldır, signout, hata)
- Emoji placeholderlar korunur; ikon gerektiren yerlerde emoji ikon YOK (SVG)
- Üretim gerçekleri: canlı Neon DB, gerçek siparişler; sahte veri girilmez

## Unresolved
Ürün görselleri geldiğinde placeholder değişimi; misafir siparişin DBye bağlanması.
