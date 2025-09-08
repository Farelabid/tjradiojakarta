import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs"; // node-redis butuh Node runtime

/** ===== Konfigurasi Resmi ===== */
const PROD_START = new Date(
  process.env.SOFT_OPENING_START ?? "2025-09-11T09:45:00+07:00"
);
const PROD_WINDOW_MS = Number(process.env.SOFT_OPENING_WINDOW_MS ?? 15 * 60 * 1000);

/** ===== Mode Uji Coba ===== */
const TEST_MODE = process.env.SOFT_OPENING_TEST_MODE === "1";
const TEST_START_ENV = process.env.SOFT_OPENING_TEST_START;
const TEST_WINDOW_MS = Number(process.env.SOFT_OPENING_TEST_WINDOW_MS ?? 30 * 60 * 1000);

/** “now” dinamis (tiap request), atau ISO time fix */
function windowBounds() {
  if (TEST_MODE && TEST_START_ENV === "now") {
    const t0 = Date.now();
    return { t0, t1: t0 + TEST_WINDOW_MS, mode: "test" as const };
  }
  const start = TEST_MODE
    ? new Date(TEST_START_ENV || new Date())
    : PROD_START;
  const win = TEST_MODE ? TEST_WINDOW_MS : PROD_WINDOW_MS;
  const t0 = start.getTime();
  return { t0, t1: t0 + win, mode: TEST_MODE ? ("test" as const) : ("prod" as const) };
}

function isWithinWindow(now: number) {
  const { t0, t1 } = windowBounds();
  return now >= t0 && now <= t1;
}

/** Key terpisah agar test & prod tidak saling ganggu */
function kvKey() {
  const { mode } = windowBounds();
  return mode === "test"
    ? "tjradio:soft_opening_launched:test"
    : "tjradio:soft_opening_launched:prod";
}

export async function GET() {
  const redis = await getRedis();
  const { t0, t1, mode } = windowBounds();
  const launched = Boolean(await redis.get(kvKey()));
  const now = Date.now();

  return NextResponse.json({
    launched,
    withinWindow: now >= t0 && now <= t1,
    mode,
    start: t0,
    end: t1,
    now,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = body?.code as string | undefined;
  const now = Date.now();

  if (!isWithinWindow(now)) {
    return NextResponse.json({ ok: false, error: "outside-window" }, { status: 403 });
  }
  if (process.env.SOFT_OPENING_CODE && process.env.NEXT_PUBLIC_REQUIRE_PIN !== "0") {
    if (code !== process.env.SOFT_OPENING_CODE) {
      return NextResponse.json({ ok: false, error: "invalid-code" }, { status: 401 });
    }
  }

  const redis = await getRedis();

  // Atomic: sekali set seluruh dunia (expire 1 hari)
  const reply = await redis.set(kvKey(), "1", { NX: true, EX: 60 * 60 * 24 });
  if (reply !== "OK") {
    return NextResponse.json({ ok: false, error: "already-launched" }, { status: 409 });
  }

  return NextResponse.json({ ok: true, launchedAt: now });
}
