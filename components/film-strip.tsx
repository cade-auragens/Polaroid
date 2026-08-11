"use client"

import type { Frame } from "./daily-reel"

function Perforations() {
  return (
    <div className="flex justify-between gap-3 px-[5px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="h-[11px] w-[15px] rounded-[2.5px] bg-foreground"
          style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.35)" }}
        />
      ))}
    </div>
  )
}

export function FilmStrip({
  frames,
  durationSeconds,
  onOpen,
}: {
  frames: Frame[]
  durationSeconds: number
  onOpen: (frame: Frame) => void
}) {
  // Duplicate the frames so the -50% translate loops seamlessly.
  const strip = [...frames, ...frames]

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #2e2b25 0%, #272521 50%, #1a1917 100%)",
        boxShadow: "0 18px 44px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="flex w-max"
        style={{
          animationName: "reel-run",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDuration: `${durationSeconds}s`,
        }}
      >
        {strip.map((frame, i) => (
          <div
            key={`${frame.key}-${i}`}
            className="flex flex-none flex-col gap-[7px] px-[7px] py-[9px]"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Perforations />
            <button
              onClick={() => onOpen(frame)}
              className="block w-[218px] cursor-pointer border-0 bg-transparent p-0 transition-opacity hover:opacity-90"
            >
              <div
                className="w-full overflow-hidden bg-well"
                style={{ aspectRatio: "1.38", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frame.url || "/placeholder.svg"} alt={frame.dayLabel} className="block h-full w-full object-cover" />
              </div>
              <div className="flex items-baseline justify-between gap-[8.8px] px-[3px] pt-[6px]">
                <span className="text-[10px] uppercase tracking-[0.16em] text-accent">{frame.dayLabel}</span>
                <span className="text-[10px] tracking-[0.1em] text-muted-dim">{frame.dateLabel}</span>
              </div>
            </button>
            <Perforations />
          </div>
        ))}
      </div>

      {/* edge fade */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(32,30,29,0.95) 0%, rgba(32,30,29,0) 12%, rgba(32,30,29,0) 88%, rgba(32,30,29,0.95) 100%)",
        }}
      />
      {/* sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0.28) 100%)",
        }}
      />
    </div>
  )
}
