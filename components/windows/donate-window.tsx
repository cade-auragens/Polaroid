"use client"

import { useEffect } from "react"
import { TitleBar, Win95Button } from "@/components/win95"

export function DonateWindow({
  onClose,
  onDonate,
}: {
  onClose: () => void
  onDonate: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[360px] flex-col bg-face p-[3px] bevel"
        style={{
          maxHeight: "88vh",
          boxShadow:
            "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 3px 0 rgba(0,0,0,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TitleBar title="Support This Project" onClose={onClose} onMouseDown={() => {}} extraControls={false} />

        <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
          <div className="flex items-start gap-2.5 p-2.5 groove bg-white">
            <span
              className="flex-none flex items-center justify-center w-7 h-7 bg-[#008cff] text-white text-base font-bold italic bevel"
              aria-hidden
            >
              V
            </span>
            <p className="m-0 text-xs leading-relaxed text-[#0a0a0a]">
              This project costs $756 a year to run. Please consider donating one month of film at $63 to help this
              lifelong project.
            </p>
          </div>

          <div className="mt-3.5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Win95Button onClick={onClose} className="h-7 px-3 text-xs">
              Maybe Later
            </Win95Button>
            <Win95Button onClick={onDonate} className="h-7 px-3 text-xs font-bold">
              Donate on Venmo
            </Win95Button>
          </div>
        </div>
      </div>
    </div>
  )
}
