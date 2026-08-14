export type Photo = {
  date: string // ISO yyyy-mm-dd, used as key
  url: string
  added: number
}

// Fetch the shared photo list from the server. This is public — every visitor
// sees the same list, since it's backed by real storage, not the browser's own
// local storage.
export async function getAllPhotos(): Promise<Photo[]> {
  const res = await fetch("/api/photos", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load photos")
  const data = (await res.json()) as { photos: Photo[] }
  return data.photos.sort((a, b) => a.date.localeCompare(b.date))
}

// Upload a photo for a given date. `password` is checked server-side against
// UPLOAD_PASSWORD — this is the real access control, not the client-side login UI.
export async function uploadPhoto(file: Blob, date: string, password: string): Promise<void> {
  const form = new FormData()
  form.append("file", file, `${date}.jpg`)
  form.append("date", date)
  form.append("password", password)
  const res = await fetch("/api/photos", { method: "POST", body: form })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string })
    throw new Error(body.error || "Upload failed.")
  }
}

export function todayIso(): string {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-")
}

export function yesterdayIso(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-")
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

// Downscale an uploaded image to a JPEG blob, capping the longest side, before
// it goes over the wire.
export function downscale(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const max = 1400
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Canvas not supported"))
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode image"))),
          "image/jpeg",
          0.86,
        )
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
