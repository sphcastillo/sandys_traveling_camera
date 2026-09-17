# Sandy's Traveling Camera

A travel photography site for Sandy, built on Next.js 16 with Sanity as the entire backend.
The Studio is mounted inside the app at `/studio`, and `sanity.config.ts` stays at the repo
root so it can also be served standalone on Vite for fast schema work.

## Getting started

```bash
pnpm install
pnpm dev          # Next.js on http://localhost:3000, Studio at /studio
```

`.env.local` already points at project `u0t97g4u` / dataset `production`. Adding a Viewer
token as `SANITY_API_READ_TOKEN` turns on the Live Content API so edits appear without a
refresh; without one the site still renders published content normally.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server, Studio included at `/studio` |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm studio:dev` | Standalone Studio on :3333 (Vite — much faster for schema edits) |
| `pnpm seed` | Fill the dataset with dummy content and ~290 uploaded photographs |
| `pnpm seed:reset` | Delete everything the seed created, then reseed |
| `pnpm map:generate` | Regenerate the world map SVG paths |

## Seeding

`pnpm seed` runs through `sanity exec --with-user-token`, borrowing the credentials from
`sanity login` — there is no API token to create. It builds 6 continents, 24 countries,
12 photographs each, 4 trips, 6 travel notes and the three singletons.

Photographs are pulled from picsum.photos with a deterministic seed per photo, then uploaded
as real Sanity assets, which is what makes hotspots, LQIP blur placeholders and CDN
transforms work. Every seeded document carries a hidden `seedKey`, so re-running only creates
what is missing and `--reset` can clean up precisely what it made.

## Content model

- `continent` — the six groupings used by the gallery
- `country` — the main page type: cover, short intro, stacked gallery sections, and a travel
  story that always renders last, beneath every photograph
- `photo` — its own document, so one asset can appear in a grid, a carousel and a trip
- `trip` — powers the "Most Recent Trip" section
- `travelNote` — short written pieces
- Singletons: `homePage`, `aboutPage`, `siteSettings` (contact email, Instagram, quote bank)

## Images

One high-quality source file per photograph lives in Sanity; every size, crop and format is
derived on request.

- `SanityImage` ([src/components/media/sanity-image.tsx](src/components/media/sanity-image.tsx))
  builds a hotspot-aware URL with `urlFor()` and `auto('format')`
- A global loader ([sanity/lib/image-loader.ts](sanity/lib/image-loader.ts)) rewrites
  `w` and `h` per srcset entry so the crop is identical at every width, and Next never
  re-optimizes what the CDN already did
- Every query asks for `asset->metadata{ lqip, dimensions }`, which gives blur placeholders
  and lets masonry tiles reserve the right height before the image arrives

## The world map

`/countries` renders an inline SVG with one path per country and no map library in the browser.
[scripts/generate-world-map.mts](scripts/generate-world-map.mts) projects Natural Earth's
public-domain TopoJSON with d3-geo's Equal Earth projection and writes the paths to
[src/components/map/world-paths.generated.ts](src/components/map/world-paths.generated.ts).
Countries are matched to Sanity documents by ISO 3166-1 numeric code.

## Hero video

The hero supports either image slides (cross-fading, with a slow zoom) or video. To use video,
open the home page in the Studio, switch the hero media type to Video, set the URL to something
like `/video/hero.mp4` (drop the file in `public/video/`) and upload a poster image. The poster
is required and is what small screens and slow connections get — Sanity `file` assets are
deliberately not used for video, since they are served as raw downloads with no transcoding.
# sandys_traveling_camera
