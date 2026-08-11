"use client"

import { useEffect } from "react"
import type { Frame } from "./daily-reel"

export function Lightbox({
  frame,
  onClose,
}: {
  frame: Frame
  onClose: () => void
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
      role="dialog"
      aria-modal="true"
      aria-label={`${frame.dayLabel}, ${frame.dateLabel}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-[35.2px]"
      style={{ background: "rgba(8,8,7,0.88)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl border border-border bg-surface p-[13.2px]"
        style={{ maxWidth: "min(720px, 92vw)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frame.url || "/placeholder.svg"}
          alt={frame.dayLabel}
          className="block w-full rounded-lg bg-well object-contain"
          style={{ maxHeight: "70vh" }}
        />
        <div className="flex items-baseline justify-between gap-[13.2px] px-[4.4px] pb-[4.4px] pt-[13.2px]">
          <span className="font-display text-xl text-accent">{frame.dayLabel}</span>
          <span className="text-[13px] tracking-[0.1em] text-muted">{frame.dateLabel}</span>
        </div>
      </div>
    </div>
  )
}
