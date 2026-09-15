// Next.js yapılandırması.
// .env'i burada (main sürecinde, derleme başlamadan önce) yüklüyoruz:
// Turbopack, server kodunun çalıştığı runtime'a env'ini derleme anındaki
// snapshot'tan veriyor; geç yükleme (component modülü içinde) snapshot'a
// yetişmiyor. Main süreçte yükleyince snapshot doğru değeri alır.
// (Vercel'de .env dosyası yok → dotenv no-op, gerçek env korunur.)
import { config } from "dotenv";
config({ override: true });

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
