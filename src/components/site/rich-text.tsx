import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import type { PortableText as PortableTextValue } from '@/sanity/lib/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-6 first:mt-0">{children}</p>,
    h3: ({ children }) => (
      <h3 className="mt-12 font-display text-2xl first:mt-0 sm:text-3xl">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-10 border-l border-universe pl-6 font-display text-xl italic text-galaxy sm:text-2xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-6 list-disc space-y-2 pl-5">{children}</ul>,
  },
  marks: {
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-medium text-galaxy">{children}</strong>,
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? '#'
      const internal = href.startsWith('/')
      const className = 'underline decoration-universe underline-offset-4 hover:text-planetary'

      return internal ? (
        <Link href={href} className={className}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
          {children}
        </a>
      )
    },
  },
}

type RichTextProps = {
  value?: PortableTextValue | null
  className?: string
}

export function RichText({ value, className }: RichTextProps) {
  if (!value?.length) return null

  return (
    <div className={cn('text-[1.02rem]/[1.85] text-ink/80', className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
