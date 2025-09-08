import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";

// kunci Redis yg dipakai saat test
const TEST_KEY = "tjradio:soft_opening_launched:test";

export async function POST(req: Request) {
  // hanya boleh dipakai saat test mode
  if (process.env.SOFT_OPENING_TEST_MODE !== "1") {
    return NextResponse.json({ ok: false, error: "not-in-test-mode" }, { status: 403 });
  }

  // (opsional) butuh PIN admin
  const body = await req.json().catch(() => ({}));
  const code = body?.code as string | undefined;
  if (process.env.SOFT_OPENING_CODE && process.env.NEXT_PUBLIC_REQUIRE_PIN !== "0") {
    if (code !== process.env.SOFT_OPENING_CODE) {
      return NextResponse.json({ ok: false, error: "invalid-code" }, { status: 401 });
    }
  }

  const redis = await getRedis();
  await redis.del(TEST_KEY);

  return NextResponse.json({ ok: true, reset: TEST_KEY });
}
