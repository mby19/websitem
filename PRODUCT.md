# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Birincil kullanıcı: proje sahibinin kendisi — web geliştirmeyi öğrenen biri.
Durum: kendi reposunu canlıya taşıyıp akışları (kayıt → giriş → sepet →
checkout → sipariş) sonuna kadar deneyerek öğreniyor. İkincil: CV'yi gören
görüşücü, linki tıklayıp 30 saniyede çalışan ürün izlenimi alır.

## Product Purpose

E-ticaret temel akışlarını gerçek kodla öğrenmek: ürün kataloğu, sepet
(Context + localStorage), transactional checkout (fiyat koruması + stok),
sipariş oluşturma ve email/şifre auth. Başarı = sonuna kadar çalışan,
CV'ye konabilecek canlı bir demo.

## Positioning

Öğrenme sürecinde yazılmış ama üretim kalitesinde çalışan bir mağaza:
fiyat hile koruması, stok kontrolü ve snapshot fiyatlaması gibi "doğru
mühendislik" detayları demonstrasyonun parçası.

## Operating Context

- Canlı: https://websitem-umber.vercel.app (Vercel + Neon Postgres)
- Repo: github.com/mby19/websitem
- Ödemeler demo: sipariş `PAID` olarak oluşur, gerçek ödeme yok
- Tek paylaşılan veritabanı: herkes aynı Neon DB'ye bakar

## Capabilities and Constraints

- Ürün listesi/detay (SSR), sepet (Context + localStorage), checkout
  (transaction: sipariş + kalemler + stok düşüşü), sipariş geçmişi
  (misafir: localStorage; girişli: DB'ye bağlı), email/şifre auth
  (Auth.js v5 + bcrypt, JWT session)
- SQLite'tan Neon Postgres'e taşınmış; lokal geliştirme de Neon'a bağlı
- Stripe test ödemesi yol haritasında; admin paneli yok
- Türkçe arayüz; TR para formatı (Intl.NumberFormat, kuruş tabanlı)

## Brand Commitments

- Ad: "WebSim Mağaza" (layout header + metadata'da geçer)
- Ses: basit, temiz, profesyonel; "sade ve profesyonel" duruşu kullanıcı
  tarafından seçildi (bolder istenen bir yön yok)

## Evidence on Hand

- 6 örnek ürün (seed): çevre donanım temalı (klavye, mouse, hub, stand,
  webcam, lamba); görsel yok, emoji placeholder 📦 kullanılıyor
- Gerçek sipariş/kullanıcı verisi Neon'da demo amaçlı oluşabilir

## Product Principles

1. Doğruluk önce: fiyat/stok asla istemciden alınmaz; parasal değerler
   kuruş olarak saklanır.
2. Öğrenme değerine öncelik: her akış gerçek mekanizmayla (transaction,
   snapshot fiyat, hash'li şifre) kurulur; sahte kestirim yok.
3. Sade ve profesyonel sunum; detaylar temiz olmalı, süs öne geçmemeli.

## Accessibility & Inclusion

Şu an kayıtlı ürün özel gereksinim yok. Web standartlarına uygunluk
(semantik HTML, odak görünürlüğü) sade-profesyonel duruşla uyumlu.
