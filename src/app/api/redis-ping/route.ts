import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
export const runtime = "nodejs";

export async function GET() {
  const r = await getRedis();
  const pong = await r.ping();
  return NextResponse.json({ pong });
}
