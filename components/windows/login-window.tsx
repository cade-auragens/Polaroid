"use client"

import { useEffect, useRef, useState } from "react"
import { TitleBar, Win95Button, useDragWindow } from "@/components/win95"

export function LoginWindow({
  z,
  onFocus,
  onClose,
  error,
  onSubmit,
}: {
  z?: number
  onFocus: () => void
  onClose: () => void
  error: boolean
  onSubmit: (user: string, pass: string) => void
}) {
  const { ref, onMouseDown } = useDragWindow(onFocus)
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const userRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  const submit = () => onSubmit(user, pass)
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !(e.nativeEvent as any).isComposing && e.keyCode !== 229) submit()
  }

  const fieldClass =
    "flex-1 h-[22px] px-1.5 border-0 bg-white font-[inherit] text-xs text-[#0a0a0a] outline-none sunk"

  return (
    <div
      ref={ref}
      data-window="login"
      onMouseDown={onFocus}
      className="absolute z-50"
      style={{ right: 24, bottom: 66, zIndex: z ?? 50 }}
    >
      <div
        className="w-[336px] bg-face p-[3px] bevel"
        style={{
          boxShadow:
            "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 4px 4px 0 rgba(0,0,0,0.4)",
        }}
      >
        <TitleBar
          title="Log On to The Daily Polaroid Project"
          onClose={onClose}
          onMouseDown={onMouseDown}
          extraControls={false}
        />

        <div className="p-3.5">
          <div className="flex gap-3 items-start">
            <img
              src="/logo.png"
              alt=""
              className="w-[42px] h-[42px] object-cover"
              style={{ objectPosition: "center 38%", imageRendering: "pixelated", boxShadow: "0 0 0 1px #808080" }}
            />
            <div className="flex-1 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs">
                <span className="w-[66px]">User name:</span>
                <input
                  ref={userRef}
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  onKeyDown={onKey}
                  className={fieldClass}
                />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-[66px]">Password:</span>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  onKeyDown={onKey}
                  className={fieldClass}
                />
              </label>
            </div>
          </div>

          {error && (
            <p className="mt-2.5 mb-0 text-[11px] font-bold text-[#a00000]">
              Incorrect user name or password. Try again.
            </p>
          )}

          <div className="flex justify-end gap-2 mt-3.5">
            <Win95Button onClick={submit} className="min-w-[78px] h-6 text-xs font-bold">
              OK
            </Win95Button>
            <Win95Button onClick={onClose} className="min-w-[78px] h-6 text-xs">
              Cancel
            </Win95Button>
          </div>
        </div>
      </div>
    </div>
  )
}
