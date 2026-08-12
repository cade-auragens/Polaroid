"use client"

import { TitleBar, Win95Button, useDragWindow } from "@/components/win95"

export function CalendarWindow({
  z,
  onFocus,
  onClose,
  monthName,
  calMonth,
  taken,
  onPrevMonth,
  onNextMonth,
  onOpenDay,
}: {
  z?: number
  onFocus: () => void
  onClose: () => void
  monthName: string
  calMonth: number
  taken: Set<string>
  onPrevMonth: () => void
  onNextMonth: () => void
  onOpenDay: (m: number, d: number) => void
}) {
  const { ref, onMouseDown } = useDragWindow(onFocus)

  const daysIn = new Date(2024, calMonth + 1, 0).getDate()
  const lead = new Date(2024, calMonth, 1).getDay()

  const cells: { label: string; has: boolean; day: number | null }[] = []
  for (let i = 0; i < lead; i++) cells.push({ label: "", has: false, day: null })
  for (let d = 1; d <= daysIn; d++) {
    const key = `${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    cells.push({ label: String(d), has: taken.has(key), day: d })
  }

  return (
    <div
      ref={ref}
      data-window="calendar"
      onMouseDown={onFocus}
      className="absolute bg-face p-[3px] bevel w-[320px]"
      style={{
        left: 60,
        top: 150,
        zIndex: z ?? 15,
        boxShadow:
          "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 3px 0 rgba(0,0,0,0.35)",
      }}
    >
      <TitleBar title="On This Day — pick a date" onClose={onClose} onMouseDown={onMouseDown} extraControls={false} />

      <div className="p-2">
        <div className="flex items-center gap-1.5 mb-2">
          <Win95Button onClick={onPrevMonth} className="w-6 h-[22px] text-[11px]">
            ◀
          </Win95Button>
          <span className="flex-1 text-center text-xs font-bold">{monthName}</span>
          <Win95Button onClick={onNextMonth} className="w-6 h-[22px] text-[11px]">
            ▶
          </Win95Button>
        </div>

        <div className="p-1.5 bg-white sunk">
          <div className="grid grid-cols-7 gap-[3px]">
            {cells.map((c, i) => (
              <div key={i} className="flex">
                {c.day === null ? (
                  <span className="w-full h-[26px]" />
                ) : c.has ? (
                  <button
                    onClick={() => onOpenDay(calMonth, c.day!)}
                    className="w-full h-[26px] bg-accent border-0 cursor-pointer font-[inherit] text-[11px] font-bold text-[#0a0a0a] hover:bg-[#ffe680] groove"
                  >
                    {c.label}
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenDay(calMonth, c.day!)}
                    className="w-full h-[26px] bg-white border-0 cursor-pointer font-[inherit] text-[11px] text-[#606060] hover:bg-[#000080] hover:text-white"
                  >
                    {c.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-2 mb-0 text-[11px] text-[#404040]">
          Yellow days already have frames. Pick any date to see every year at once.
        </p>
      </div>
    </div>
  )
}
