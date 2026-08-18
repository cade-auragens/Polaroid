"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getAllPhotos, uploadPhoto, todayIso, formatDate, downscale, type Photo } from "@/lib/photo-db"
import { Hero } from "@/components/hero"
import { ReelWindow } from "@/components/windows/reel-window"
import { AlbumWindow } from "@/components/windows/album-window"
import { CalendarWindow } from "@/components/windows/calendar-window"
import { DayWindow } from "@/components/windows/day-window"
import { AboutWindow } from "@/components/windows/about-window"
import { DonateWindow } from "@/components/windows/donate-window"
import { LoginWindow } from "@/components/windows/login-window"
import { MessageWindow, type DialogState } from "@/components/windows/message-window"
import { Lightbox } from "@/components/windows/lightbox"
import { Taskbar } from "@/components/taskbar"

export type Frame = {
  url: string
  iso: string
  yearLabel: string
  dayLabel: string
  dateLabel: string
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export type LightboxState = { url: string; iso: string; day: string; date: string } | null
export type DayState = { m: number; d: number } | null

export function Desktop() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [authed, setAuthed] = useState(false)
  const [authPassword, setAuthPassword] = useState("")

  // Window open state — the Reel is hidden until the user signs in via the clock
  const [reelOpen, setReelOpen] = useState(false)
  const [albumOpen, setAlbumOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [dialog, setDialog] = useState<DialogState>(null)

  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [day, setDay] = useState<DayState>(null)
  const [lightbox, setLightbox] = useState<LightboxState>(null)
  const [clock, setClock] = useState("")

  const [zTop, setZTop] = useState(20)
  const fileRef = useRef<HTMLInputElement>(null)

  // z-index registry per window so focus brings to front
  const [zIndex, setZIndex] = useState<Record<string, number>>({})
  const focus = useCallback((name: string) => {
    setZTop((z) => {
      const next = z + 1
      setZIndex((m) => ({ ...m, [name]: next }))
      return next
    })
  }, [])

  const load = useCallback(async () => {
    try {
      setPhotos(await getAllPhotos())
    } catch (e) {
      console.warn("photo list unavailable", e)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      let h = d.getHours()
      const ap = h >= 12 ? "PM" : "AM"
      h = h % 12 || 12
      setClock(`${h}:${String(d.getMinutes()).padStart(2, "0")} ${ap}`)
    }
    tick()
    const t = setInterval(tick, 15000)
    return () => clearInterval(t)
  }, [])

  const frames = useMemo<Frame[]>(
    () =>
      photos.map((p, i) => ({
        url: p.url,
        iso: p.date,
        yearLabel: p.date.slice(0, 4),
        dayLabel: `Day ${i + 1}`,
        dateLabel: formatDate(p.date),
      })),
    [photos],
  )

  const openFrame = useCallback((f: Frame) => {
    setLightbox({ url: f.url, iso: f.iso, day: f.dayLabel, date: f.dateLabel })
    focus("lightbox")
  }, [focus])

  // File upload flow. Uses in-app dialogs rather than window.confirm/alert, since
  // native dialogs are blocked inside sandboxed preview iframes (v0, Vercel previews).
  const doUpload = useCallback(
    async (file: File, date: string) => {
      try {
        const blob = await downscale(file)
        await uploadPhoto(blob, date, authPassword)
        await load()
      } catch (err) {
        setDialog({
          title: "Upload Failed",
          message: err instanceof Error ? err.message : "Upload failed.",
          tone: "error",
        })
      }
    },
    [authPassword, load],
  )

  const onFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ""
      if (!file) return
      const date = todayIso()
      if (photos.some((p) => p.date === date)) {
        setDialog({
          title: "Replace Today's Frame?",
          message: "A frame already exists for today. Replacing it will overwrite the current photo.",
          confirmLabel: "Replace",
          onConfirm: () => {
            void doUpload(file, date)
          },
        })
        return
      }
      void doUpload(file, date)
    },
    [photos, doUpload],
  )

  const afterLogin = useCallback(() => {
    setAuthed(true)
    setLoginOpen(false)
    setLoginError(false)
    setReelOpen(true)
    focus("reel")
  }, [focus])

  const submitLogin = useCallback(
    async (user: string, pass: string) => {
      // The username is just a UI nicety — the real check is the password,
      // verified server-side against UPLOAD_PASSWORD so it's never exposed in
      // the shipped JS.
      if (user.trim().toUpperCase() !== "POLAROID") {
        setLoginError(true)
        return
      }
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pass }),
        })
        const data = await res.json().catch(() => ({ ok: false }))
        if (data.ok) {
          setAuthPassword(pass)
          afterLogin()
        } else {
          setLoginError(true)
        }
      } catch {
        setLoginError(true)
      }
    },
    [afterLogin],
  )

  const tryUpload = useCallback(() => {
    // Uploading is only available once signed in. Sign in via the taskbar clock.
    if (authed) fileRef.current?.click()
  }, [authed])

  const clockClick = useCallback(() => {
    if (authed) {
      setAuthed(false)
      setReelOpen(false)
      setAuthPassword("")
    } else {
      setLoginOpen(true)
      setLoginError(false)
      focus("login")
    }
  }, [authed, focus])

  const openWindow = useCallback(
    (setter: (v: boolean) => void, name: string) => {
      setter(true)
      focus(name)
    },
    [focus],
  )

  const openReel = () => openWindow(setReelOpen, "reel")
  const openAlbum = () => openWindow(setAlbumOpen, "album")
  const openCalendar = () => openWindow(setCalendarOpen, "calendar")
  const openAbout = () => openWindow(setAboutOpen, "about")
  const openDonate = () => setDonateOpen(true)
  const goToVenmo = () => {
    window.open("https://venmo.com/u/Camlabrecque", "_blank", "noopener,noreferrer")
    setDonateOpen(false)
  }
  const openInspiration = () =>
    window.open("https://www.facebook.com/watch/?v=10155367058817365", "_blank", "noopener,noreferrer")

  const openDay = useCallback(
    (m: number, d: number) => {
      setDay({ m, d })
      focus("day")
    },
    [focus],
  )

  const shiftDay = useCallback(
    (delta: number) => {
      const cur = day ?? { m: new Date().getMonth(), d: new Date().getDate() }
      const dt = new Date(2024, cur.m, cur.d + delta)
      setDay({ m: dt.getMonth(), d: dt.getDate() })
      setCalMonth(dt.getMonth())
    },
    [day],
  )

  // Derived data
  const count = frames.length
  const last = photos[photos.length - 1]
  // "2026 Frames" — only photos dated in 2026, most recent on top.
  const albumFrames = useMemo(
    () => frames.filter((f) => f.yearLabel === "2026").reverse(),
    [frames],
  )

  // The Hero shows the newest frame that exists — whatever day it's from — so a
  // fresh upload appears immediately and the slot never goes blank while any
  // frame exists. (frames are sorted oldest→newest, so the last one is newest.)
  // Its caption is the photo's OWN date, never anything derived from "today", so
  // the frame keeps its real date until a newer photo replaces it.
  const heroFrame = useMemo<Frame | null>(
    () => (frames.length ? frames[frames.length - 1] : null),
    [frames],
  )

  const dayKey = day ? `${String(day.m + 1).padStart(2, "0")}-${String(day.d).padStart(2, "0")}` : null
  const dayFrames = useMemo(
    () => (dayKey ? frames.filter((f) => f.iso.slice(5) === dayKey).reverse() : []),
    [dayKey, frames],
  )

  const lightboxThisDay = useCallback(() => {
    if (!lightbox) return
    const p = lightbox.iso.split("-").map(Number)
    setLightbox(null)
    openDay(p[1] - 1, p[2])
  }, [lightbox, openDay])

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden pb-[34px]"
      style={{
        background: "#0a1180",
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px)",
      }}
    >
      <Hero
        frame={heroFrame}
        onOpenFrame={openFrame}
        onAlbum={openAlbum}
        onAbout={openAbout}
        onDonate={openDonate}
        onInspiration={openInspiration}
      />

      {reelOpen && (
        <ReelWindow
          z={zIndex.reel}
          onFocus={() => focus("reel")}
          onClose={() => setReelOpen(false)}
          frames={frames}
          authed={authed}
          count={count}
          latestLabel={last ? `Latest: Day ${count} — ${formatDate(last.date)}` : "Waiting for Day 1"}
          onUpload={tryUpload}
          onOpenAlbum={openAlbum}
          onOpenCalendar={openCalendar}
          onOpenFrame={openFrame}
        />
      )}

      {albumOpen && (
        <AlbumWindow
          z={zIndex.album}
          onFocus={() => focus("album")}
          onClose={() => setAlbumOpen(false)}
          frames={albumFrames}
          count={albumFrames.length}
          onOpenFrame={openFrame}
        />
      )}

      {calendarOpen && (
        <CalendarWindow
          z={zIndex.calendar}
          onFocus={() => focus("calendar")}
          onClose={() => setCalendarOpen(false)}
          monthName={MONTHS[calMonth]}
          calMonth={calMonth}
          taken={new Set(photos.map((p) => p.date.slice(5)))}
          onPrevMonth={() => setCalMonth((calMonth + 11) % 12)}
          onNextMonth={() => setCalMonth((calMonth + 1) % 12)}
          onOpenDay={openDay}
        />
      )}

      {day && (
        <DayWindow
          z={zIndex.day}
          onFocus={() => focus("day")}
          onClose={() => setDay(null)}
          title={`Every year on ${MONTHS[day.m]} ${day.d}`}
          frames={dayFrames}
          onPrevDay={() => shiftDay(-1)}
          onNextDay={() => shiftDay(1)}
          onOpenFrame={openFrame}
        />
      )}

      {aboutOpen && <AboutWindow onClose={() => setAboutOpen(false)} />}

      {donateOpen && <DonateWindow onClose={() => setDonateOpen(false)} onDonate={goToVenmo} />}

      {loginOpen && (
        <LoginWindow
          z={zIndex.login}
          onFocus={() => focus("login")}
          onClose={() => {
            setLoginOpen(false)
            setLoginError(false)
          }}
          error={loginError}
          onSubmit={submitLogin}
        />
      )}

      {lightbox && (
        <Lightbox
          state={lightbox}
          onClose={() => setLightbox(null)}
          onThisDay={lightboxThisDay}
        />
      )}

      {dialog && <MessageWindow state={dialog} onClose={() => setDialog(null)} />}

      <Taskbar
        clock={clock}
        authed={authed}
        onAbout={openAbout}
        onClock={clockClick}
        reelOpen={reelOpen}
        albumOpen={albumOpen}
        loginOpen={loginOpen}
        onReel={openReel}
        onAlbum={openAlbum}
        onLogin={() => focus("login")}
      />

      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
    </div>
  )
}
