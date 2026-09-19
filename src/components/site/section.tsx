import Link from 'next/link'

import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

type SectionProps = {
  id?: string
  className?: string
  tone?: 'default' | 'meteor' | 'galaxy' | 'sky'
  children: React.ReactNode
}

const TONES = {
  default: '',
  meteor: 'bg-meteor',
  galaxy: 'bg-galaxy text-milkyway',
  sky: 'bg-sky/40',
} as const

export function Section({ id, className, tone = 'default', children }: SectionProps) {
  return (
    <section id={id} className={cn('py-16', TONES[tone], className)}>
      {children}
    </section>
  )
}

type SectionHeaderProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  href?: string
  linkLabel?: string
  align?: 'left' | 'center'
  invert?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  href,
  linkLabel,
  align = 'left',
  invert = false,
  className,
}: SectionHeaderProps) {
  if (!eyebrow && !title && !intro && !href) return null

  return (
    <div
      className={cn(
        'flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'sm:mx-auto')}>
        {eyebrow ? (
          <p className={cn('eyebrow', invert && 'text-venus')}>{eyebrow}</p>
        ) : null}
        {title ? (
          <h2
            className={cn(
              'mt-3 text-balance font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl',
              invert && 'text-milkyway',
            )}
          >
            {title}
          </h2>
        ) : null}
        {intro ? (
          <p
            className={cn(
              'mt-4 max-w-xl text-pretty text-[0.95rem]/relaxed text-ink/70',
              invert && 'text-venus',
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>

      {href ? (
        <Link
          href={href}
          className={cn(
            'group flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-planetary transition-colors hover:text-galaxy',
            invert && 'text-venus hover:text-milkyway',
          )}
        >
          {linkLabel ?? 'See all'}
          <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  )
}
