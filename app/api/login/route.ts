import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Checks a password against the real server-side secret so the login window can
// give immediate feedback. This endpoint never grants upload access on its own —
// every upload is re-checked against the same secret in /api/photos.
export async function POST(request: NextRequest) {
  const uploadPassword = process.env.UPLOAD_PASSWORD
  if (!uploadPassword) {
    return NextResponse.json(
      { ok: false, error: "Server not configured: set the UPLOAD_PASSWORD environment variable." },
      { status: 500 },
    )
  }

  const body = await request.json().catch(() => null)
  const password = body?.password
  return NextResponse.json({ ok: typeof password === "string" && password === uploadPassword })
}
