import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center py-32">
      <div className="shell max-w-xl text-center">
        <p className="eyebrow">Off the map</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Nothing here</h1>
        <p className="mt-6 text-[1.02rem]/[1.85] text-ink/70">
          This page took a wrong turn somewhere. The photographs are still where you left them.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/countries"
            className="rounded-full bg-galaxy px-7 py-4 text-xs font-medium uppercase tracking-[0.18em] text-milkyway transition-colors hover:bg-planetary"
          >
            Open the map
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-galaxy/25 px-7 py-4 text-xs font-medium uppercase tracking-[0.18em] text-galaxy transition-colors hover:bg-galaxy/5"
          >
            Browse the gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
