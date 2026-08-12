"use client"

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-[5px] bg-transparent border border-dotted border-transparent p-1 cursor-pointer font-[inherit] hover:border-white/55"
    >
      {children}
      <span
        className="text-white text-[11px] leading-tight text-center"
        style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.6)" }}
      >
        {label}
      </span>
    </button>
  )
}

export function DesktopIcons({
  todayDayNum,
  onReel,
  onAlbum,
  onCalendar,
  onAbout,
}: {
  todayDayNum: string
  onReel: () => void
  onAlbum: () => void
  onCalendar: () => void
  onAbout: () => void
}) {
  return (
    <div className="absolute left-3.5 top-3.5 flex flex-col gap-[18px] w-[92px] z-[2]">
      <IconButton label="Daily Reel" onClick={onReel}>
        <img
          src="/logo.png"
          alt=""
          className="w-11 h-11 object-cover"
          style={{ objectPosition: "center 38%", imageRendering: "pixelated", boxShadow: "0 0 0 1px rgba(255,255,255,0.25)" }}
        />
      </IconButton>

      <IconButton label="Photo Album" onClick={onAlbum}>
        <span className="grid grid-cols-2 gap-[3px] w-11 h-11 p-1 bg-face bevel">
          <span className="bg-accent" />
          <span className="bg-white" />
          <span className="bg-white" />
          <span className="bg-[#000080]" />
        </span>
      </IconButton>

      <IconButton label="On This Day" onClick={onCalendar}>
        <span className="flex flex-col w-11 h-11 bg-white bevel">
          <span className="h-3 bg-[#000080]" />
          <span className="flex-1 flex items-center justify-center text-[17px] font-bold text-[#000080]">
            {todayDayNum}
          </span>
        </span>
      </IconButton>

      <IconButton label="Read Me" onClick={onAbout}>
        <span className="flex items-center justify-center w-11 h-11 bg-face text-[#000080] text-[26px] font-bold italic bevel">
          i
        </span>
      </IconButton>
    </div>
  )
}
