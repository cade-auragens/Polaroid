"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { downscale, formatDate, getAllPhotos, putPhoto, todayIso, type Photo } from "@/lib/photo-db"
import { FilmStrip } from "./film-strip"
import { GalleryGrid } from "./gallery-grid"
import { Lightbox } from "./lightbox"

export type Frame = {
  key: string
  url: string
  dayLabel: string
  dateLabel: string
}

type View = "reel" | "gallery"

// How fast the reel spools: 1 (slow) - 10 (fast).
const REEL_SPEED = 5

export function DailyReel() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [view, setView] = useState<View>("reel")
  const [lightbox, setLightbox] = useState<Frame | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setPhotos(await getAllPhotos())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const frames: Frame[] = useMemo(
    () =>
      photos.map((p, i) => ({
        key: p.date,
        url: p.url,
        dayLabel: `Day ${i + 1}`,
        dateLabel: formatDate(p.date),
      })),
    [photos],
  )

  const count = frames.length

  // Build a strip long enough to fill the reel, then let FilmStrip double it for looping.
  const strip: Frame[] = useMemo(() => {
    if (count === 0) return []
    const reps = Math.max(1, Math.ceil(14 / count))
    const out: Frame[] = []
    for (let r = 0; r < reps; r++) {
      frames.forEach((f, i) => out.push({ ...f, key: `${f.key}-${r}-${i}` }))
    }
    return out
  }, [frames, count])

  const reelDuration = strip.length ? strip.length * (12 - REEL_SPEED) : 60

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    const date = todayIso()
    if (photos.some((p) => p.date === date) && !window.confirm("You already added a frame today. Replace it?")) {
      return
    }
    const url = await downscale(file)
    await putPhoto({ date, url, added: Date.now() })
    load()
  }

  const hint =
    count === 0
      ? "Your first upload becomes Day 1 and starts the reel."
      : "Uploads are dated automatically and spool onto the reel."

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-[26.4px] border-b border-border px-11 py-[26.4px]">
        <div className="flex flex-col gap-[4.4px]">
          <h1 className="m-0 font-display text-[32px] font-normal tracking-[-0.01em] text-accent">Daily Reel</h1>
          <p className="m-0 text-[15px] text-muted">One frame a day, spooled in order.</p>
        </div>
        <div className="flex items-center gap-[22px]">
          <div className="flex flex-col items-end leading-[1.05]">
            <span className="font-display text-[26px] text-accent-bright">{count}</span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-dim">{count === 1 ? "day" : "days"}</span>
          </div>
          <button
            onClick={() => setView((v) => (v === "reel" ? "gallery" : "reel"))}
            className="cursor-pointer rounded-full border border-border bg-surface px-5 py-[10px] text-[15px] text-foreground transition-colors hover:border-accent hover:bg-border"
          >
            {view === "reel" ? "View photos" : "Back to reel"}
          </button>
        </div>
      </header>

      {view === "reel" ? (
        <div className="flex flex-1 flex-col justify-center gap-[52.8px] py-[52.8px]">
          <div className="flex flex-col items-center gap-[17.6px] px-11">
            <button
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer rounded-full bg-accent px-11 py-[17.6px] text-[17px] font-semibold text-background transition-colors hover:bg-accent-bright"
              style={{ boxShadow: "0 12px 32px rgba(246,160,107,0.22)" }}
            >
              Add today&apos;s frame
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
            <p className="m-0 max-w-[400px] text-center text-sm text-muted-dim">{hint}</p>
          </div>

          {count > 0 && <FilmStrip frames={strip} durationSeconds={reelDuration} onOpen={setLightbox} />}
        </div>
      ) : (
        <GalleryGrid frames={[...frames].reverse()} onOpen={setLightbox} />
      )}

      {lightbox && <Lightbox frame={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  )
}
