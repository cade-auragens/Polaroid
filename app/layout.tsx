import type { Metadata, Viewport } from "next"
import { Caprasimo, Figtree } from "next/font/google"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
})

const caprasimo = Caprasimo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caprasimo",
})

export const metadata: Metadata = {
  title: "Daily Reel — One frame a day",
  description: "One frame a day, spooled in order. A daily photo diary on an animated film reel.",
}

export const viewport: Viewport = {
  themeColor: "#201e1d",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${figtree.variable} ${caprasimo.variable} bg-background`}>
      <body className="bg-background text-foreground font-sans antialiased">{children}</body>
    </html>
  )
}
