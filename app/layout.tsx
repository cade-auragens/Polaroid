import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "The Daily Polaroid Project",
  description:
    "One photograph a day, kept in the order it was taken. A Windows 95-style photo diary by Cam Labrecque.",
}

export const viewport: Viewport = {
  themeColor: "#0a1180",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-desktop">
      <body className="bg-desktop text-[color:var(--ink)] font-sans antialiased">{children}</body>
    </html>
  )
}
