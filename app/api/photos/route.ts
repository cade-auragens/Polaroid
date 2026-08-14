import { type NextRequest, NextResponse } from "next/server"
import { put, list } from "@vercel/blob"
import { SEED_PHOTOS } from "@/lib/seed-photos"

// Always run live — this list changes as people upload, so it must never be
// statically cached at build time.
export const dynamic = "force-dynamic"

type PhotoEntry = { date: string; url: string; added: number }

const PATH_RE = /^photos\/(\d{4}-\d{2}-\d{2})\.jpg$/

function dateFromPathname(pathname: string): string | null {
  const m = pathname.match(PATH_RE)
  return m ? m[1] : null
}

// GET — public. Anyone visiting the site can read the current photo list.
export async function GET() {
  try {
    const uploaded = new Map<string, PhotoEntry>()

    // Real uploads live in Blob storage under photos/{date}.jpg.
    let cursor: string | undefined
    do {
      const page = await list({ prefix: "photos/", cursor, limit: 1000 })
      for (const b of page.blobs) {
        const date = dateFromPathname(b.pathname)
        if (!date) continue
        uploaded.set(date, { date, url: b.url, added: new Date(b.uploadedAt).getTime() })
      }
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)

    // Checked-in seed photos fill in any date nobody has uploaded a real frame for yet.
    for (const s of SEED_PHOTOS) {
      if (!uploaded.has(s.date)) uploaded.set(s.date, { date: s.date, url: s.url, added: 0 })
    }

    const photos = Array.from(uploaded.values()).sort((a, b) => a.date.localeCompare(b.date))
    return NextResponse.json({ photos })
  } catch (err) {
    console.error("GET /api/photos failed", err)
    // Fall back to the seed log so the site still shows something if Blob storage
    // isn't configured yet (e.g. BLOB_READ_WRITE_TOKEN missing).
    const photos = SEED_PHOTOS.map((s) => ({ ...s, added: 0 })).sort((a, b) => a.date.localeCompare(b.date))
    return NextResponse.json({ photos })
  }
}

// POST — password-protected. This is the only way a photo gets written for
// everyone to see; the client's "logged in" state is just a UI convenience,
// the real check happens here, server-side.
export async function POST(request: NextRequest) {
  const uploadPassword = process.env.UPLOAD_PASSWORD
  if (!uploadPassword) {
    return NextResponse.json(
      { error: "Server not configured: set the UPLOAD_PASSWORD environment variable." },
      { status: 500 },
    )
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 })
  }

  const password = form.get("password")
  if (typeof password !== "string" || password !== uploadPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
  }

  const date = form.get("date")
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Missing or invalid date." }, { status: 400 })
  }

  const file = form.get("file")
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 })
  }

  try {
    const blob = await put(`photos/${date}.jpg`, file, {
      access: "public",
      contentType: "image/jpeg",
      allowOverwrite: true,
    })
    return NextResponse.json({ date, url: blob.url })
  } catch (err) {
    console.error("PUT blob failed", err)
    return NextResponse.json({ error: "Upload failed. Is Blob storage connected to this project?" }, { status: 500 })
  }
}
