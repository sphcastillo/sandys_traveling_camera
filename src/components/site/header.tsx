'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'
import { CloseIcon, InstagramIcon, MailIcon, MenuIcon } from '@/components/ui/icons'

const NAV = [
  { href: '/countries', label: 'Countries' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/notes', label: 'Travel Notes' },
  { href: '/about', label: 'Meet Sandy' },
]

type HeaderProps = {
  siteTitle: string
  email: string
  instagramUrl: string
}

export function Header({ siteTitle, email, instagramUrl }: HeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Only the homepage has a full-bleed hero for the header to float over.
  const overHero = pathname === '/'
  const solid = scrolled || !overHero || menuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        solid
          ? 'border-b border-galaxy/10 bg-milkyway/90 text-galaxy backdrop-blur-md'
          : 'border-b border-transparent text-milkyway',
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link href="/" className="font-display text-lg leading-none tracking-tight sm:text-xl">
          {siteTitle}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative text-[0.8rem] font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-70',
                  active && 'after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-current',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <SocialLinks email={email} instagramUrl={instagramUrl} />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-mr-2 grid size-10 place-items-center md:hidden"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            {menuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-galaxy/10 bg-milkyway text-galaxy md:hidden"
      >
        <nav aria-label="Primary" className="shell flex flex-col py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-galaxy/10 py-4 font-display text-2xl last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function SocialLinks({ email, instagramUrl }: { email: string; instagramUrl: string }) {
  return (
    <>
      <a
        href={`mailto:${email}`}
        className="grid size-10 place-items-center transition-opacity hover:opacity-60"
      >
        <span className="sr-only">Email Sandy</span>
        <MailIcon className="size-5" />
      </a>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="grid size-10 place-items-center transition-opacity hover:opacity-60"
      >
        <span className="sr-only">Sandy on Instagram</span>
        <InstagramIcon className="size-5" />
      </a>
    </>
  )
}
