"use client"

import type { Frame } from "./daily-reel"

export function GalleryGrid({
  frames,
  onOpen,
}: {
  frames: Frame[]
  onOpen: (frame: Frame) => void
}) {
  return (
    <div className="flex-1 px-11 pb-[52.8px] pt-[35.2px]">
      <div className="flex items-baseline gap-[13.2px] pb-[26.4px]">
        <h2 className="m-0 font-display text-2xl font-normal text-foreground">Every frame</h2>
        <span className="text-xs uppercase tracking-[0.14em] text-muted-dim">Newest first</span>
      </div>

      {frames.length === 0 ? (
        <p className="m-0 text-[15px] text-muted">No frames yet. Add today&apos;s photo from the reel.</p>
      ) : (
        <div className="grid gap-[26.4px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {frames.map((frame) => (
            <button
              key={frame.key}
              onClick={() => onOpen(frame)}
              className="flex cursor-pointer flex-col gap-[10px] rounded-2xl border border-border bg-surface p-[10px] text-left transition-colors hover:border-accent hover:bg-border"
            >
              <div className="overflow-hidden rounded-[10px] bg-well" style={{ aspectRatio: "1.38" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frame.url || "/placeholder.svg"} alt={frame.dayLabel} className="block h-full w-full object-cover" />
              </div>
              <div className="flex items-baseline justify-between gap-[8.8px] px-[4.4px] pb-[4.4px]">
                <span className="text-[11px] uppercase tracking-[0.16em] text-accent">{frame.dayLabel}</span>
                <span className="text-[11px] text-muted-dim">{frame.dateLabel}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
