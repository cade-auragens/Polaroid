"use client"

export function Taskbar({
  clock,
  authed,
  onAbout,
  onClock,
  reelOpen,
  albumOpen,
  loginOpen,
  onReel,
  onAlbum,
  onLogin,
}: {
  clock: string
  authed: boolean
  onAbout: () => void
  onClock: () => void
  reelOpen: boolean
  albumOpen: boolean
  loginOpen: boolean
  onReel: () => void
  onAlbum: () => void
  onLogin: () => void
}) {
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-30 flex items-center gap-1 h-[30px] px-1 py-[3px] bg-face"
      style={{ boxShadow: "inset 0 1px 0 #ffffff, inset 0 2px 0 #dfdfdf" }}
    >
      <button
        onClick={onAbout}
        className="win95-btn flex items-center gap-[5px] h-[22px] pl-1 pr-2 bg-face bevel text-[#0a0a0a] text-xs font-bold cursor-pointer font-[inherit]"
      >
        <img
          src="/logo.png"
          alt=""
          className="w-4 h-4 object-cover"
          style={{ objectPosition: "center 38%", imageRendering: "pixelated" }}
        />
        Polaroid
      </button>

      <span className="w-0.5 h-[22px] mx-0.5" style={{ boxShadow: "inset -1px 0 0 #ffffff, inset 1px 0 0 #808080" }} />

      {reelOpen && (
        <button
          onClick={onReel}
          className="h-[22px] w-[92px] sm:w-auto sm:min-w-[150px] px-2 text-left bg-face bevel-in text-[#0a0a0a] text-[11px] cursor-pointer font-[inherit] truncate"
        >
          Reel
        </button>
      )}
      {albumOpen && (
        <button
          onClick={onAlbum}
          className="win95-btn h-[22px] w-[84px] sm:w-auto sm:min-w-[130px] px-2 text-left bg-face bevel text-[#0a0a0a] text-[11px] cursor-pointer font-[inherit] truncate"
        >
          2026 Frames
        </button>
      )}
      {loginOpen && (
        <button
          onClick={onLogin}
          className="win95-btn h-[22px] w-[76px] sm:w-auto sm:min-w-[120px] px-2 text-left bg-face bevel text-[#0a0a0a] text-[11px] cursor-pointer font-[inherit] truncate"
        >
          Log On
        </button>
      )}

      <span className="flex-1" />

      <button
        onClick={onClock}
        title={authed ? "Signed in as POLAROID" : "Log on"}
        className="flex items-center gap-2 h-[22px] px-2.5 bg-face groove text-[#0a0a0a] text-[11px] cursor-pointer font-[inherit]"
      >
        <span className="w-2.5 h-2.5 bg-accent" style={{ boxShadow: "0 0 0 1px #0a0a0a" }} />
        {clock}
      </button>
    </div>
  )
}
