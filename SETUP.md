# Setup — The Daily Polaroid Project

Next.js (App Router) + TypeScript + Tailwind v4. To import into v0: **+ →
Upload from computer**, then select the zip.

## What needs configuring once

Photos are stored in **Vercel Blob** — real shared storage — so every visitor
sees the same photos on any device. Two one-time steps:

### 1. Connect a Blob store

In your v0/Vercel project: **Storage → Create Database → Blob → Create**, and
connect it to this project.

This adds a `BLOB_READ_WRITE_TOKEN` environment variable automatically. You
don't need to touch it — the code already reads it.

### 2. Set your upload password

The login (taskbar clock, username `POLAROID`) checks its password against a
server-side secret, rather than one hard-coded in the site's code where anyone
could read it in their browser's dev tools.

Add an environment variable named **`UPLOAD_PASSWORD`** set to whatever you
want your password to be. In v0: **Project Settings → Environment Variables**.

Until both are set, the site still loads and shows the seeded photos — it just
can't accept uploads yet, and says so plainly instead of failing silently.

## Adding a specific day's photo directly

To bake a photo into the site instead of uploading it through the login: drop
the image in `public/seed/` and add a row to `lib/seed-photos.ts` with its
date. Any date that also has a real upload will use the upload.

## Notes for working in v0

- **Don't re-add `X-Frame-Options` to `next.config.mjs`.** It blocks the site
  from rendering inside an iframe, which is how v0 and Vercel show previews —
  adding it back makes the preview pane go blank.
- **Avoid `window.alert` / `window.confirm`.** v0's preview runs in a sandboxed
  iframe where native dialogs are silently ignored. This project uses the
  in-app `MessageWindow` component instead — reuse it for new prompts.
- **The Win95 styling lives in `app/globals.css`** (`.bevel`, `.sunk`,
  `.groove`, `.font-w95fa`, the `spool` animation). If v0 regenerates
  `globals.css`, make sure those survive or the look breaks.
- This project doesn't use shadcn/ui. If you have v0 add a shadcn component,
  it will scaffold that setup itself.

## Local development

```
npm install
npm run dev
```

For local uploads, create `.env.local` (see `.env.example`) with your
`UPLOAD_PASSWORD`, and run `vercel env pull` for `BLOB_READ_WRITE_TOKEN`.

## Hosting elsewhere?

Storage uses `@vercel/blob`, which needs a Vercel Blob store. To host
elsewhere, the storage layer in `app/api/photos/route.ts` would need swapping
for another provider (S3, Supabase Storage, etc.).
