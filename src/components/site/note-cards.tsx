import Link from 'next/link'

import { SanityImage } from '@/components/media/sanity-image'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import type { TravelNoteCard } from '@/sanity/lib/types'

type NoteCardsProps = {
  notes: TravelNoteCard[]
  className?: string
}

export function NoteCards({ notes, className }: NoteCardsProps) {
  if (notes.length === 0) return null

  return (
    <div className={cn('grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3', className)}>
      {notes.map((note) => (
        <article key={note._id}>
          <Link href={`/notes/${note.slug}`} className="group block">
            <SanityImage
              value={note.coverImage}
              aspect="landscape"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              imageClassName="transition-transform duration-[1100ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
            />
            <p className="mt-5 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.22em] text-planetary">
              {formatDate(note.date)}
              {note.country ? (
                <>
                  <span className="text-ink/25">&middot;</span>
                  <span className="text-ink/50">{note.country.name}</span>
                </>
              ) : null}
            </p>
            <h3 className="mt-2 text-balance font-display text-2xl transition-colors group-hover:text-planetary sm:text-[1.7rem]">
              {note.title}
            </h3>
            {note.excerpt ? (
              <p className="mt-2 text-pretty text-sm/relaxed text-ink/65">{note.excerpt}</p>
            ) : null}
          </Link>
        </article>
      ))}
    </div>
  )
}
