// Real dated frames baked into the site itself. Since this app stores uploads in
// each visitor's own browser (no shared server), any photo that should be visible
// to every visitor — not just the person who uploaded it — needs to live here as a
// checked-in file instead of going through the login/upload flow.
//
// To add a day: drop the image in /public/seed/, then add a row below.
export const SEED_PHOTOS: { date: string; url: string }[] = [
  { date: "2026-08-13", url: "/seed/2026-08-13.jpeg" },
]
