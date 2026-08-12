"use client"

import { useEffect } from "react"
import { Win95Button } from "@/components/win95"
import type { LightboxState } from "@/components/desktop"

export function Lightbox({
  state,
  onClose,
  onThisDay,
}: {
  state: NonNullable<LightboxState>
  onClose: () => void
  onThisDay: () => void
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
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="bg-face p-[3px] bevel"
        style={{
          width: "min(520px, 90%)",
          boxShadow:
            "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 4px 4px 0 rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-1.5 px-[3px] py-[3px] pl-1.5"
          style={{ background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)" }}
        >
          <span className="flex-1 text-white text-xs font-bold">Preview — {state.day}</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-[17px] h-[15px] bg-face bevel text-[#0a0a0a] text-[11px] font-bold cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-3.5">
          <div
            className="relative p-3 pb-[34px] bg-[color:var(--paper)]"
            style={{ boxShadow: "2px 2px 0 rgba(0,0,0,0.35)" }}
          >
            <span
              className="block w-full"
              style={{
                aspectRatio: "1",
                backgroundColor: "#000080",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 0 0 1px #0a0a0a",
                backgroundImage: `url(${state.url})`,
              }}
            />
            <span className="absolute left-3 right-3 bottom-2.5 flex justify-between text-xs text-[#303030]">
              <span className="font-bold">{state.day}</span>
              <span>{state.date}</span>
            </span>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <Win95Button onClick={onThisDay} className="h-6 px-2.5 whitespace-nowrap text-xs">
              Every year on this date
            </Win95Button>
            <Win95Button onClick={onClose} className="min-w-[76px] h-6 text-xs">
              Close
            </Win95Button>
          </div>
        </div>
      </div>
    </div>
  )
}
