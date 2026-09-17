/**
 * The Sanity Studio, mounted inside the Next.js app at `/studio`.
 *
 * `sanity.config.ts` stays at the repo root so `pnpm studio:dev` can also serve
 * it standalone on :3333 (Vite) for fast schema iteration and TypeGen watch.
 */
import { Studio } from './studio'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <Studio />
}
