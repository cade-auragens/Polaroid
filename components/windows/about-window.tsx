"use client"

import { TitleBar, Win95Button, useDragWindow } from "@/components/win95"

export function AboutWindow({
  z,
  onFocus,
  onClose,
}: {
  z?: number
  onFocus: () => void
  onClose: () => void
}) {
  const { ref, onMouseDown } = useDragWindow(onFocus)

  return (
    <div
      ref={ref}
      data-window="about"
      onMouseDown={onFocus}
      className="absolute bg-face p-[3px] bevel w-[372px]"
      style={{
        right: 32,
        top: 80,
        zIndex: z ?? 16,
        boxShadow:
          "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 3px 0 rgba(0,0,0,0.35)",
      }}
    >
      <TitleBar title="Read Me" onClose={onClose} onMouseDown={onMouseDown} extraControls={false} />

      <div className="p-3">
        <img
          src="/title.png"
          alt="The Daily Polaroid Project — by Cam Labrecque"
          className="block w-full max-h-[240px] object-cover"
          style={{ boxShadow: "inset 1px 1px 0 #808080, 0 0 0 1px #0a0a0a" }}
        />
        <p className="mt-3 mb-0 text-xs leading-relaxed text-[#0a0a0a]">
          One photograph a day, kept in the order it was taken. The reel spools left; the album holds every frame.
          Nothing is deleted and nothing is reordered.
        </p>
        <div className="flex justify-end mt-3">
          <Win95Button onClick={onClose} className="min-w-[76px] h-6 text-xs">
            OK
          </Win95Button>
        </div>
      </div>
    </div>
  )
}
