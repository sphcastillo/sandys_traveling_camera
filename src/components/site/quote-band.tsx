import { cn } from '@/lib/cn'
import type { QuoteValue } from '@/sanity/lib/types'

type QuoteBandProps = {
  quote?: QuoteValue | null
  tone?: 'light' | 'dark' | 'sky'
  className?: string
}

const TONES = {
  light: 'bg-meteor text-galaxy',
  dark: 'bg-galaxy text-milkyway',
  sky: 'bg-sky/50 text-galaxy',
} as const

export function QuoteBand({ quote, tone = 'light', className }: QuoteBandProps) {
  if (!quote?.text) return null

  return (
    <aside className={cn('py-20 sm:py-28', TONES[tone], className)}>
      <figure className="shell text-center">
        <blockquote className="mx-auto max-w-4xl text-balance font-display text-3xl leading-[1.15] italic sm:text-4xl lg:text-5xl">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        {quote.attribution ? (
          <figcaption
            className={cn(
              'mt-8 text-[0.7rem] font-medium uppercase tracking-[0.28em]',
              tone === 'dark' ? 'text-venus' : 'text-planetary',
            )}
          >
            {quote.attribution}
          </figcaption>
        ) : null}
      </figure>
    </aside>
  )
}
