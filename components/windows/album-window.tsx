"use client"

import { TitleBar, useDragWindow, PhotoFrame } from "@/components/win95"
import type { Frame } from "@/components/desktop"

export function AlbumWindow({
  z,
  onFocus,
  onClose,
  frames,
  count,
  onOpenFrame,
}: {
  z?: number
  onFocus: () => void
  onClose: () => void
  frames: Frame[]
  count: number
  onOpenFrame: (f: Frame) => void
}) {
  const { ref, onMouseDown } = useDragWindow(onFocus)
  const countLabel = `${count} ${count === 1 ? "frame" : "frames"}`

  return (
    <div
      ref={ref}
      data-window="album"
      onMouseDown={onFocus}
      className="absolute bg-face p-[3px] bevel left-1 top-[104px] w-[calc(100%-8px)] sm:left-[236px] sm:top-[300px] sm:w-[min(760px,calc(100%-280px))]"
      style={{
        zIndex: z ?? 14,
        boxShadow:
          "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 3px 0 rgba(0,0,0,0.35)",
      }}
    >
      <TitleBar title="2026 Frames" onClose={onClose} onMouseDown={onMouseDown} extraControls={false} />

      <div
        className="mt-1 mx-[3px] mb-[3px] p-3.5 max-h-[60vh] sm:max-h-[380px] overflow-y-auto bg-white sunk"
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}>
          {frames.map((f) => (
            <div key={f.iso} className="flex flex-col items-center gap-1.5">
              <PhotoFrame
                url={f.url}
                topLabel={f.dayLabel}
                bottomLabel=""
                hoverBg="#ffffcc"
                onClick={() => onOpenFrame(f)}
              />
              <span className="font-w95fa text-[15px] leading-none text-[#000080]">{f.dateLabel}</span>
            </div>
          ))}
        </div>
        {count === 0 && (
          <p className="m-0 py-[30px] text-center text-xs text-[#606060]">
            No 2026 frames yet. Add a frame from the reel window to start the year.
          </p>
        )}
      </div>

      <div className="m-[3px] px-1.5 py-[3px] text-[11px] groove">{countLabel}</div>
    </div>
  )
}
