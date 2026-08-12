"use client"

import type React from "react"
import { useCallback, useRef } from "react"

/**
 * Makes a window draggable by its title bar. Returns an onMouseDown handler
 * for the title bar and brings the window to the front on grab.
 */
export function useDragWindow(onFocus?: () => void) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Don't start a drag when a control inside the title bar is clicked.
      if ((e.target as HTMLElement).closest("button")) return
      const win = ref.current
      if (!win) return
      onFocus?.()

      const host = (win.offsetParent as HTMLElement) || document.body
      const hr = host.getBoundingClientRect()
      const r = win.getBoundingClientRect()

      // Convert any right/bottom anchoring to absolute left/top before dragging.
      win.style.right = "auto"
      win.style.bottom = "auto"
      win.style.left = `${r.left - hr.left}px`
      win.style.top = `${r.top - hr.top}px`

      const dx = e.clientX - r.left
      const dy = e.clientY - r.top

      const move = (ev: MouseEvent) => {
        win.style.left = `${Math.max(0, ev.clientX - dx - hr.left)}px`
        win.style.top = `${Math.max(0, ev.clientY - dy - hr.top)}px`
      }
      const up = () => {
        window.removeEventListener("mousemove", move)
        window.removeEventListener("mouseup", up)
      }
      window.addEventListener("mousemove", move)
      window.addEventListener("mouseup", up)
      e.preventDefault()
    },
    [onFocus],
  )

  return { ref, onMouseDown }
}

export function TitleBar({
  title,
  icon,
  onClose,
  onMouseDown,
  extraControls = true,
}: {
  title: string
  icon?: string
  onClose: () => void
  onMouseDown: (e: React.MouseEvent) => void
  extraControls?: boolean
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="flex items-center gap-1.5 px-[3px] py-[3px] pl-1.5 cursor-move select-none"
      style={{ background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)" }}
    >
      {icon ? (
        <img
          src={icon || "/placeholder.svg"}
          alt=""
          className="w-4 h-4 object-cover"
          style={{ objectPosition: "center 38%", imageRendering: "pixelated" }}
        />
      ) : null}
      <span className="flex-1 text-white text-xs font-bold tracking-tight truncate">{title}</span>
      <span className="flex gap-0.5">
        {extraControls && (
          <>
            <span className="flex items-end justify-center w-[17px] h-[15px] pb-[3px] bg-face bevel">
              <span className="w-[7px] h-0.5 bg-[#0a0a0a]" />
            </span>
            <span className="flex items-center justify-center w-[17px] h-[15px] bg-face bevel">
              <span className="w-[9px] h-2 border border-[#0a0a0a] border-t-2" />
            </span>
          </>
        )}
        <button
          onClick={onClose}
          className="flex items-center justify-center w-[17px] h-[15px] bg-face bevel text-[#0a0a0a] text-[11px] font-bold leading-none cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
      </span>
    </div>
  )
}

/** A raised Windows-95 button. */
export function Win95Button({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`win95-btn bg-face bevel text-[#0a0a0a] font-[inherit] cursor-pointer ${className}`}
    >
      {children}
    </button>
  )
}

/** The polaroid-frame photo tile used on the reel, album, and day windows. */
export function PhotoFrame({
  url,
  topLabel,
  bottomLabel,
  onClick,
  width,
  hoverBg = "#ffffff",
}: {
  url: string
  topLabel: string
  bottomLabel: string
  onClick: () => void
  width?: number
  hoverBg?: string
}) {
  return (
    <button
      onClick={onClick}
      className="group relative border-0 cursor-pointer font-[inherit] bg-[color:var(--paper)] p-[9px] pb-[30px]"
      style={{
        width: width ? `${width}px` : "100%",
        boxShadow: "3px 3px 0 rgba(0,0,0,0.4)",
      }}
    >
      <span
        className="block w-full transition-colors"
        style={{
          width: width ? `${width - 18}px` : "100%",
          aspectRatio: "1",
          backgroundColor: "#000080",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 0 0 1px #0a0a0a",
          backgroundImage: `url(${url})`,
        }}
      />
      <span className="absolute left-[9px] right-[9px] bottom-2 flex justify-between text-[11px] text-[#303030]">
        <span className="font-bold">{topLabel}</span>
        <span>{bottomLabel}</span>
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{ background: hoverBg, mixBlendMode: "multiply", opacity: 0 }}
      />
    </button>
  )
}
