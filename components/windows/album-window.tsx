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
      className="absolute bg-face p-[3px] bevel"
      style={{
        left: 236,
        top: 300,
        width: "min(760px, calc(100% - 280px))",
        zIndex: z ?? 14,
        boxShadow:
          "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 3px 0 rgba(0,0,0,0.35)",
      }}
    >
      <TitleBar title="Photo Album — all frames" onClose={onClose} onMouseDown={onMouseDown} extraControls={false} />

      <div
        className="mt-1 mx-[3px] mb-[3px] p-3.5 max-h-[380px] overflow-y-auto bg-white sunk"
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
          {frames.map((f) => (
            <PhotoFrame
              key={f.iso}
              url={f.url}
              topLabel={f.dayLabel}
              bottomLabel={f.dateLabel}
              hoverBg="#ffffcc"
              onClick={() => onOpenFrame(f)}
            />
          ))}
        </div>
        {count === 0 && (
          <p className="m-0 py-[30px] text-center text-xs text-[#606060]">
            The album is empty. Add a frame from the reel window.
          </p>
        )}
      </div>

      <div className="m-[3px] px-1.5 py-[3px] text-[11px] groove">{countLabel}</div>
    </div>
  )
}
