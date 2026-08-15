"use client"

import { Win95Button, PhotoFrame } from "@/components/win95"
import type { Frame } from "@/components/desktop"

export function Hero({
  frame,
  topLabel,
  onOpenFrame,
  onAlbum,
  onAbout,
  onDonate,
  onInspiration,
}: {
  frame: Frame | null
  topLabel: string
  onOpenFrame: (f: Frame) => void
  onAlbum: () => void
  onAbout: () => void
  onDonate: () => void
  onInspiration: () => void
}) {
  return (
    <section className="relative z-[3] flex flex-col items-center gap-4 px-4 pt-6 pb-2 sm:gap-5 sm:pt-10">
      <img
        src="/title.png"
        alt="The Daily Polaroid Project — By: Cam Labrecque"
        className="w-full max-w-[380px] sm:max-w-[520px] pointer-events-none"
      />

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        <Win95Button onClick={onAlbum} className="h-8 min-w-[112px] px-3 text-xs font-bold">
          2026 Frames
        </Win95Button>
        <Win95Button onClick={onAbout} className="h-8 min-w-[140px] px-3 text-xs font-bold">
          About This Project
        </Win95Button>
        <Win95Button onClick={onDonate} className="h-8 min-w-[92px] px-3 text-xs font-bold">
          Donate
        </Win95Button>
        <Win95Button onClick={onInspiration} className="h-8 min-w-[112px] px-3 text-xs font-bold">
          Inspiration
        </Win95Button>
      </div>

      {frame ? (
        <PhotoFrame
          url={frame.url}
          topLabel={topLabel}
          bottomLabel={frame.dateLabel}
          width={240}
          onClick={() => onOpenFrame(frame)}
        />
      ) : (
        <div
          className="bg-[color:var(--paper)] p-[9px] pb-[30px]"
          style={{ width: "240px", boxShadow: "3px 3px 0 rgba(0,0,0,0.4)" }}
        >
          <div
            className="flex items-center justify-center px-3 text-center"
            style={{
              width: "222px",
              aspectRatio: "4 / 5",
              backgroundColor: "#000080",
              boxShadow: "0 0 0 1px #0a0a0a",
            }}
          >
            <span className="text-[11px] leading-relaxed text-white/80">No frames yet.</span>
          </div>
          <span className="mt-2 block text-[11px] font-bold text-[#303030]">{topLabel}</span>
        </div>
      )}
    </section>
  )
}
