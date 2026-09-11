// NextAuth HTTP endpoint'i: /api/auth/*
// Tüm giriş/çıkış istekleri bu yoldan geçer; handlers yönlendirir.
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
