// POST /api/events/consume — CONSUMER TICK.
// Mantık src/lib/kafka-consume.ts'te (admin action ile paylaşılır); bu route
// ince gövde: HTTP yüzeyi + JSON yanıtı. Tick'i kim tetikler:
//   1) consumer script'i (npm run kafka:consume — lokal uzun döngü)
//   2) admin sayfasındaki "consume" butonu (elle tick)
// Gerçek üretimde: kalıcı consumer (K8s container / uzun süreli worker).
import { NextResponse } from "next/server";
import { consumeTick } from "@/lib/kafka-consume";

export async function POST() {
  const result = await consumeTick();
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
