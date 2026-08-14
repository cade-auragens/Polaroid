"use client"

import { useEffect } from "react"
import { TitleBar, Win95Button } from "@/components/win95"

export type DialogState = {
  title: string
  message: string
  /** When set, the dialog shows Yes/Cancel instead of a single OK button. */
  onConfirm?: () => void
  confirmLabel?: string
  tone?: "info" | "error"
} | null

export function MessageWindow({
  state,
  onClose,
}: {
  state: NonNullable<DialogState>
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const isError = state.tone === "error"

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[340px] bg-face p-[3px] bevel"
        style={{
          boxShadow:
            "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 4px 4px 0 rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TitleBar title={state.title} onClose={onClose} onMouseDown={() => {}} extraControls={false} />

        <div className="p-3.5">
          <div className="flex items-start gap-2.5">
            <span
              aria-hidden
              className={`flex-none flex items-center justify-center w-8 h-8 text-[19px] font-bold italic bevel ${
                isError ? "bg-[#a00000] text-white" : "bg-face text-[#000080]"
              }`}
            >
              {isError ? "!" : "i"}
            </span>
            <p className="m-0 pt-1 text-xs leading-relaxed text-[#0a0a0a]">{state.message}</p>
          </div>

          <div className="mt-3.5 flex justify-end gap-2">
            {state.onConfirm ? (
              <>
                <Win95Button
                  onClick={() => {
                    state.onConfirm?.()
                    onClose()
                  }}
                  className="min-w-[78px] h-6 text-xs font-bold"
                >
                  {state.confirmLabel ?? "Yes"}
                </Win95Button>
                <Win95Button onClick={onClose} className="min-w-[78px] h-6 text-xs">
                  Cancel
                </Win95Button>
              </>
            ) : (
              <Win95Button onClick={onClose} className="min-w-[78px] h-6 text-xs font-bold">
                OK
              </Win95Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
