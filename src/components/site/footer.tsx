import Link from 'next/link'

import { InstagramIcon, MailIcon } from '@/components/ui/icons'

const NAV = [
  { href: '/countries', label: 'Countries' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/notes', label: 'Travel Notes' },
  { href: '/about', label: 'Meet Sandy' },
]

type FooterProps = {
  siteTitle: string
  tagline?: string | null
  email: string
  instagramUrl: string
  footerNote?: string | null
}

export function Footer({ siteTitle, tagline, email, instagramUrl, footerNote }: FooterProps) {
  return (
    <footer className="mt-24 bg-galaxy text-milkyway sm:mt-32">
      <div className="shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-display text-2xl text-milkyway sm:text-3xl">{siteTitle}</p>
          {tagline ? <p className="mt-3 text-sm/relaxed text-venus">{tagline}</p> : null}
          <p className="mt-8 font-display text-xl italic text-sky">Adventure is out there.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <p className="eyebrow text-venus">Wander</p>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-fit text-sm text-milkyway/90 transition-opacity hover:opacity-60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="eyebrow text-venus">Say hello</p>
          <a
            href={`mailto:${email}`}
            className="flex w-fit items-center gap-3 text-sm text-milkyway/90 transition-opacity hover:opacity-60"
          >
            <MailIcon className="size-5 shrink-0" />
            {email}
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-fit items-center gap-3 text-sm text-milkyway/90 transition-opacity hover:opacity-60"
          >
            <InstagramIcon className="size-5 shrink-0" />
            Instagram
          </a>
        </div>
      </div>

      <div className="border-t border-milkyway/15">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-venus sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteTitle}
          </p>
          <p>{footerNote || 'YOLO — you only live once.'}</p>
        </div>
      </div>
    </footer>
  )
}
