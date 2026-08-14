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
      className="absolute bg-face p-[3px] bevel left-1 right-1 top-[104px] w-auto sm:left-auto sm:right-8 sm:top-20 sm:w-[372px]"
      style={{
        zIndex: z ?? 16,
        boxShadow:
          "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 3px 0 rgba(0,0,0,0.35)",
      }}
    >
      <TitleBar title="About This Project" onClose={onClose} onMouseDown={onMouseDown} extraControls={false} />

      <div className="p-3">
        <img
          src="/title.png"
          alt="The Daily Polaroid Project — by Cam Labrecque"
          className="block w-full h-auto object-contain"
          style={{ boxShadow: "inset 1px 1px 0 #808080, 0 0 0 1px #0a0a0a" }}
        />
        <p className="mt-3 mb-2 text-xs leading-relaxed text-[#0a0a0a]">
          Cam Labrecque is an entrepreneur and filmmaker with a simple obsession: paying attention to the moments
          most people scroll past. This project is his way of slowing down, one Polaroid a day, no exceptions,
          through the good stretches and the hard ones alike.
        </p>
        <p className="m-0 text-xs leading-relaxed text-[#0a0a0a]">
          There&apos;s no script here and no curation after the fact, just real days, revealed one frame at a time
          as the project unfolds. In a world where almost anything can be generated, these are the moments no AI
          could ever fake, because they actually happened.
        </p>
        <div className="mt-3 flex justify-center">
          <figure className="m-0 bg-white p-2 pb-6" style={{ boxShadow: "2px 2px 0 rgba(0,0,0,0.35), 0 0 0 1px #0a0a0a" }}>
            <img
              src="/about-portrait.jpeg"
              alt="Cam Labrecque in front of a wall of polaroid photos"
              className="block w-[180px] aspect-square object-cover"
              style={{ boxShadow: "inset 1px 1px 0 #808080, 0 0 0 1px #0a0a0a" }}
            />
            <figcaption className="font-w95fa mt-2 text-center text-[15px] leading-none text-[#000080]">
              Cam Labrecque
            </figcaption>
          </figure>
        </div>
        <div className="flex justify-end mt-3">
          <Win95Button onClick={onClose} className="min-w-[76px] h-6 text-xs">
            OK
          </Win95Button>
        </div>
      </div>
    </div>
  )
}
