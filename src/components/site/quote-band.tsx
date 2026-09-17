import { SanityImage } from '@/components/media/sanity-image'
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

  const hasImage = Boolean(quote.image?.asset)

  return (
    <aside
      className={cn(
        'relative isolate overflow-hidden py-24 sm:py-36',
        hasImage ? 'text-milkyway' : TONES[tone],
        className,
      )}
    >
      {hasImage ? (
        <>
          <div className="absolute inset-0 -z-10">
            <SanityImage
              value={quote.image}
              fill
              sizes="100vw"
              quality={80}
              alt=""
              imageClassName="object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-galaxy/85 via-galaxy/55 to-galaxy/45" />
        </>
      ) : null}

      <figure className="shell text-center">
        <blockquote className="mx-auto max-w-4xl text-balance font-display text-3xl leading-[1.15] italic sm:text-4xl lg:text-5xl">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        {quote.attribution ? (
          <figcaption
            className={cn(
              'mt-8 text-[0.7rem] font-medium uppercase tracking-[0.28em]',
              hasImage || tone === 'dark' ? 'text-venus' : 'text-planetary',
            )}
          >
            {quote.attribution}
          </figcaption>
        ) : null}
      </figure>
    </aside>
  )
}
