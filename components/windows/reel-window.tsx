"use client"

import { useMemo } from "react"
import { TitleBar, Win95Button, useDragWindow, PhotoFrame } from "@/components/win95"
import type { Frame } from "@/components/desktop"

export function ReelWindow({
  z,
  onFocus,
  onClose,
  frames,
  authed,
  count,
  latestLabel,
  onUpload,
  onOpenAlbum,
  onOpenCalendar,
  onOpenFrame,
}: {
  z?: number
  onFocus: () => void
  onClose: () => void
  frames: Frame[]
  authed: boolean
  count: number
  latestLabel: string
  onUpload: () => void
  onOpenAlbum: () => void
  onOpenCalendar: () => void
  onOpenFrame: (f: Frame) => void
}) {
  const { ref, onMouseDown } = useDragWindow(onFocus)

  // Build a repeating strip so the spool animation loops seamlessly.
  const strip = useMemo(() => {
    if (!count) return [] as Frame[]
    const reps = Math.max(2, Math.ceil(10 / count))
    let s: Frame[] = []
    for (let r = 0; r < reps; r++) s = s.concat(frames)
    return s.concat(s)
  }, [frames, count])

  const countLabel = `${count} ${count === 1 ? "frame" : "frames"}`
  const authLabel = authed ? "User: POLAROID" : "Guest — read only"
  const toolbarHint = authed
    ? "Signed in. Frames are dated automatically, one per day."
    : "Uploading is restricted. Sign in from the clock."

  return (
    <div
      ref={ref}
      data-window="reel"
      onMouseDown={onFocus}
      className="absolute bg-face p-[3px] bevel"
      style={{
        left: 132,
        top: 26,
        width: "min(1000px, calc(100% - 168px))",
        zIndex: z ?? 12,
        boxShadow:
          "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 3px 0 rgba(0,0,0,0.35)",
      }}
    >
      <TitleBar
        title="The Daily Polaroid Project — Reel"
        icon="/logo.png"
        onClose={onClose}
        onMouseDown={onMouseDown}
      />

      {/* Menu bar */}
      <div className="flex gap-3.5 px-1 pt-0.5 pb-1 text-xs">
        {[
          ["F", "ile"],
          ["E", "dit"],
          ["V", "iew"],
          ["H", "elp"],
        ].map(([k, rest]) => (
          <span key={k} className="px-[5px] py-px">
            <span className="underline">{k}</span>
            {rest}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-[5px] py-1 mx-[3px] bg-face groove">
        <Win95Button
          onClick={onUpload}
          className="flex items-center gap-1.5 h-6 px-2.5 whitespace-nowrap text-xs font-bold"
        >
          <span
            className="w-2.5 h-2.5 bg-[#ff0000] rounded-full"
            style={{ boxShadow: "0 0 0 2px #ffffff, 0 0 0 3px #0a0a0a" }}
          />
          Add Today&apos;s Frame
        </Win95Button>
        <Win95Button onClick={onOpenAlbum} className="h-6 px-2.5 whitespace-nowrap text-xs">
          Open Album
        </Win95Button>
        <span className="w-0.5 h-5 mx-0.5" style={{ boxShadow: "inset -1px 0 0 #ffffff, inset 1px 0 0 #808080" }} />
        <Win95Button onClick={onOpenCalendar} className="h-6 px-2.5 whitespace-nowrap text-xs">
          On This Day
        </Win95Button>
        <span className="text-[11px] text-[#404040] truncate">{toolbarHint}</span>
      </div>

      {/* Film reel */}
      <div
        className="mt-1.5 mx-[3px] mb-[3px] py-[18px] overflow-hidden"
        style={{
          background: "#008080",
          backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0 2px, transparent 2px 24px)",
          boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff, inset 2px 2px 0 #0a0a0a, inset -2px -2px 0 #dfdfdf",
        }}
      >
        {count > 0 ? (
          <div
            className="flex w-max hover:[animation-play-state:paused]"
            style={{ animation: "spool 48s linear infinite" }}
          >
            {strip.map((f, i) => (
              <div key={`${f.iso}-${i}`} className="flex-none mx-[11px]">
                <PhotoFrame
                  url={f.url}
                  topLabel={f.dayLabel}
                  bottomLabel={f.dateLabel}
                  width={178}
                  onClick={() => onOpenFrame(f)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-[22px] px-6 py-2.5">
            <img
              src="/logo.png"
              alt="The Daily Polaroid Project logo"
              className="w-[150px] h-[150px] object-cover"
              style={{ objectPosition: "center 44%", boxShadow: "3px 3px 0 rgba(0,0,0,0.4)" }}
            />
            <div className="max-w-[380px] px-4 py-3.5 bg-face bevel">
              <p className="m-0 mb-2 text-[13px] font-bold">No frames on the reel yet.</p>
              <p className="m-0 text-xs leading-relaxed text-[#303030]">
                Your first upload becomes Day 1 and starts the reel. Everything after that spools on in order, one frame
                per day.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex gap-[3px] m-[3px] text-[11px]">
        <span className="flex-none min-w-[116px] px-1.5 py-[3px] groove">{countLabel}</span>
        <span className="flex-1 px-1.5 py-[3px] groove truncate">{latestLabel}</span>
        <span className="flex-none min-w-[112px] px-1.5 py-[3px] groove">{authLabel}</span>
      </div>
    </div>
  )
}
