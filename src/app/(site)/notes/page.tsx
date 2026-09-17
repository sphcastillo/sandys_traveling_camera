import type { Metadata } from 'next'

import { NoteCards } from '@/components/site/note-cards'
import { Section, SectionHeader } from '@/components/site/section'
import { sanityFetch } from '@/sanity/lib/live'
import { NOTES_QUERY } from '@/sanity/lib/queries'
import type { TravelNoteCard } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Travel Notes',
  description: 'Short pieces about getting there, waiting around and occasionally getting lucky.',
}

export default async function NotesPage() {
  const { data } = await sanityFetch({ query: NOTES_QUERY })
  const notes = data as TravelNoteCard[]

  return (
    <Section className="pt-32 sm:pt-40">
      <div className="shell">
        <SectionHeader
          eyebrow={`${notes.length} notes`}
          title="Travel Notes"
          intro="Short pieces about getting there, waiting around and occasionally getting lucky."
          align="center"
        />
        <NoteCards notes={notes} className="mt-16" />
      </div>
    </Section>
  )
}
