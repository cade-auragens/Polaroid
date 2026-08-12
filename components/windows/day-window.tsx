"use client"

import { TitleBar, Win95Button, useDragWindow, PhotoFrame } from "@/components/win95"
import type { Frame } from "@/components/desktop"

export function DayWindow({
  z,
  onFocus,
  onClose,
  title,
  frames,
  onPrevDay,
  onNextDay,
  onOpenFrame,
}: {
  z?: number
  onFocus: () => void
  onClose: () => void
  title: string
  frames: Frame[]
  onPrevDay: () => void
  onNextDay: () => void
  onOpenFrame: (f: Frame) => void
}) {
  const { ref, onMouseDown } = useDragWindow(onFocus)
  const dayCountLabel = `${frames.length} ${frames.length === 1 ? "frame" : "frames"} on this date`

  return (
    <div
      ref={ref}
      data-window="day"
      onMouseDown={onFocus}
      className="absolute bg-face p-[3px] bevel"
      style={{
        left: 300,
        top: 200,
        width: "min(620px, calc(100% - 340px))",
        zIndex: z ?? 18,
        boxShadow:
          "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 3px 0 rgba(0,0,0,0.35)",
      }}
    >
      <TitleBar title={title} onClose={onClose} onMouseDown={onMouseDown} extraControls={false} />

      <div className="flex items-center gap-1.5 px-1.5 py-[5px]">
        <Win95Button onClick={onPrevDay} className="h-[22px] px-2 text-[11px]">
          ◀ Previous day
        </Win95Button>
        <Win95Button onClick={onNextDay} className="h-[22px] px-2 text-[11px]">
          Next day ▶
        </Win95Button>
        <span className="flex-1" />
        <span className="text-[11px] text-[#404040]">{dayCountLabel}</span>
      </div>

      <div className="mx-[3px] mb-[3px] p-3.5 max-h-[340px] overflow-y-auto bg-white sunk">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {frames.map((f) => (
            <PhotoFrame
              key={f.iso}
              url={f.url}
              topLabel={f.yearLabel}
              bottomLabel={f.dayLabel}
              hoverBg="#ffffcc"
              onClick={() => onOpenFrame(f)}
            />
          ))}
        </div>
        {frames.length === 0 && (
          <p className="m-0 py-[26px] text-center text-xs text-[#606060]">
            No frames on this date yet — in any year.
          </p>
        )}
      </div>
    </div>
  )
}
