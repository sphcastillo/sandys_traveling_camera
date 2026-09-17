import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SanityImage } from '@/components/media/sanity-image'
import { RichText } from '@/components/site/rich-text'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons'
import { formatDate } from '@/lib/format'
import { client } from '@/sanity/lib/client'
import { sanityFetch } from '@/sanity/lib/live'
import { NOTE_QUERY, NOTE_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { TravelNoteDoc } from '@/sanity/lib/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, stega: false })
    .fetch<{ slug: string }[]>(NOTE_SLUGS_QUERY)

  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await sanityFetch({ query: NOTE_QUERY, params: await params, stega: false })
  const note = data as TravelNoteDoc | null
  if (!note) return {}

  return {
    title: note.title,
    description: note.excerpt ?? undefined,
  }
}

export default async function NotePage({ params }: Props) {
  const { data } = await sanityFetch({ query: NOTE_QUERY, params: await params })
  const note = data as TravelNoteDoc | null

  if (!note) notFound()

  return (
    <article className="pt-32 sm:pt-40">
      <header className="shell max-w-3xl">
        <Link
          href="/notes"
          className="group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-planetary transition-colors hover:text-galaxy"
        >
          <ArrowLeftIcon className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Travel Notes
        </Link>

        <h1 className="mt-6 text-balance font-display text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
          {note.title}
        </h1>

        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] uppercase tracking-[0.22em] text-ink/50">
          {formatDate(note.date)}
          {note.country ? (
            <>
              <span className="text-ink/25">&middot;</span>
              <Link
                href={`/countries/${note.country.slug}`}
                className="text-planetary transition-opacity hover:opacity-70"
              >
                {note.country.name}
              </Link>
            </>
          ) : null}
        </p>
      </header>

      <div className="shell mt-12">
        <SanityImage
          value={note.coverImage}
          aspect="wide"
          sizes="(max-width: 1024px) 100vw, 90vw"
          priority
          quality={85}
        />
      </div>

      <div className="shell mt-14">
        <div className="mx-auto max-w-2xl">
          {note.excerpt ? (
            <p className="text-balance font-display text-2xl leading-snug text-galaxy sm:text-[1.75rem]">
              {note.excerpt}
            </p>
          ) : null}
          <RichText value={note.body} className="mt-8" />

          {note.country ? (
            <Link
              href={`/countries/${note.country.slug}`}
              className="group mt-14 inline-flex items-center gap-3 rounded-full border border-galaxy/20 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-galaxy transition-colors hover:bg-galaxy hover:text-milkyway"
            >
              See the photographs from {note.country.name}
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  )
}
