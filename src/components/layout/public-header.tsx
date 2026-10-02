'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Menu, Search, ShoppingBag, UserRound } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { CONTACT_PHONE, CONTACT_EMAIL, CONTACT_WHATSAPP } from '@/constants'

const links = [
  { href: '/produits?search=EPI', label: 'EPI' },
  { href: '/produits?search=EPC', label: 'EPC' },
  { href: '/produits?search=vêtement', label: 'Vêtements' },
  { href: '/produits?search=chaussure', label: 'Chaussures' },
  { href: '/produits?personalizable=1', label: 'Personnalisation' },
]

function Logo() {
  return (
    <Link href='/' className='flex items-center gap-3' aria-label='ITS Équipement — Accueil'>
      <img
        src='/logo-its-equipement.jpg'
        alt='ITS Équipement'
        className='h-[38px] w-[38px] rounded-[8px] object-cover sm:h-[42px] sm:w-[42px]'
      />
      <span className='flex flex-col leading-none'>
        <span className='text-[15px] font-black tracking-tight text-its-dark sm:text-[17px]'>ÉQUIPEMENT</span>
        <span className='mt-1 hidden text-[8px] font-bold uppercase tracking-[0.14em] text-its-gray sm:block sm:text-[9px] sm:tracking-[0.18em]'>EPI · EPC · professionnel</span>
      </span>
    </Link>
  )
}

export function PublicHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const count = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0))

  const active = (href: string) => {
    if (href === '/produits?personalizable=1') return pathname === '/produits'
    if (href.startsWith('/produits?search=')) return pathname === '/produits'
    return pathname === href
  }

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push('/produits?search=' + encodeURIComponent(q))
    setQuery('')
  }

  return (
    <header className='sticky top-0 z-50 w-full bg-white'>
      <div className='hidden bg-its-dark text-white sm:block'>
        <div className='mx-auto flex h-[34px] max-w-[1440px] items-center justify-between gap-4 px-5 text-[10px] sm:px-8 lg:px-16'>
          <span className='font-semibold'>EPI & EPC · Équipement professionnel · Côte d’Ivoire</span>
          <div className='hidden items-center gap-5 sm:flex'>
            <a href={'tel:' + CONTACT_PHONE.replace(/\s/g, '')} className='hover:text-its-lime'>
              {CONTACT_PHONE}
            </a>
            <a
              href={CONTACT_WHATSAPP}
              target='_blank'
              rel='noopener noreferrer'
              className='font-bold text-its-lime'
            >
              WhatsApp Équipement ↗
            </a>
          </div>
        </div>
      </div>

      <div className='border-b border-its-border bg-white'>
        <div className='mx-auto flex min-h-[64px] max-w-[1536px] items-center justify-between gap-3 px-3 sm:min-h-[78px] sm:gap-6 sm:px-8 lg:px-16'>
          <Logo />

          <nav className='hidden flex-1 items-center justify-center gap-7 lg:flex' aria-label='Navigation principale'>
            <Link
              href='/'
              className={'relative py-3 text-[13px] font-semibold ' + (pathname === '/' ? 'text-its-dark' : 'text-its-gray hover:text-its-dark')}
            >
              Accueil
              {pathname === '/' ? <span className='absolute -bottom-[8px] left-1/2 h-2 w-2 -translate-x-1/2 bg-its-lime' /> : null}
            </Link>

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={'relative py-3 text-[13px] font-semibold ' + (active(link.href) ? 'text-its-dark' : 'text-its-gray hover:text-its-dark')}
              >
                {link.label}
                {active(link.href) ? <span className='absolute -bottom-[8px] left-1/2 h-2 w-2 -translate-x-1/2 bg-its-lime' /> : null}
              </Link>
            ))}
          </nav>

          <div className='hidden items-center gap-3 lg:flex'>
            <form onSubmit={search} className='flex h-[42px] w-[220px] items-center gap-2 rounded-[8px] bg-its-cream px-3.5' role='search'>
              <Search className='h-[17px] w-[17px] text-its-gray' />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='w-full bg-transparent text-xs text-its-dark outline-none placeholder:text-its-gray'
                placeholder='Rechercher un équipement'
                aria-label='Rechercher un équipement'
              />
            </form>

            <Link href='/auth/login' aria-label='Mon compte' className='grid h-[42px] w-[42px] place-items-center rounded-[8px] hover:bg-its-cream'>
              <UserRound className='h-5 w-5 text-its-dark' />
            </Link>

            <Link href='/panier' aria-label='Panier' className='flex items-center gap-2'>
              <ShoppingBag className='h-5 w-5 text-its-dark' />
              <span className='rounded-full bg-[#DDF8FB] px-2.5 py-1 text-[11px] font-extrabold text-its-panel'>{count}</span>
            </Link>
          </div>

          <div className='flex items-center gap-1.5 lg:hidden'>
            <button
              type='button'
              aria-label='Rechercher un équipement'
              onClick={() => router.push('/produits')}
              className='grid h-10 w-10 place-items-center rounded-lg text-its-dark hover:bg-its-cream'
            >
              <Search className='h-5 w-5' />
            </button>
            <Link href='/panier' aria-label='Panier' className='relative grid h-11 w-11 place-items-center rounded-lg'>
              <ShoppingBag className='h-5 w-5' />
              {count > 0 ? <span className='absolute right-1 top-1 min-w-4 rounded-full bg-its-lime px-1 text-center text-[9px] font-bold'>{count}</span> : null}
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='h-11 w-11 text-its-dark' aria-label='Ouvrir le menu'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[320px] p-0'>
                <SheetHeader className='border-b border-its-border px-5 py-5'>
                  <SheetTitle className='text-left'><Logo /></SheetTitle>
                </SheetHeader>
                <div className='px-5 py-5'>
                  <form onSubmit={search} className='mb-5 flex h-11 items-center rounded-lg bg-its-cream px-3'>
                    <Search className='mr-2 h-4 w-4 text-its-gray' />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className='w-full bg-transparent text-sm outline-none'
                      placeholder='Rechercher un équipement'
                      aria-label='Rechercher un équipement'
                    />
                  </form>

                  <nav className='flex flex-col'>
                    <SheetClose asChild><Link href='/' className='flex min-h-12 items-center border-b border-its-border text-sm font-bold text-its-dark'>Accueil</Link></SheetClose>
                    {links.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={'flex min-h-12 items-center border-b border-its-border text-sm ' + (active(link.href) ? 'font-bold text-its-dark' : 'text-its-gray')}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link href='/demande-devis' className='mt-5 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-its-dark px-4 font-semibold text-white'>
                        Demander un devis <ArrowRight className='h-4 w-4' />
                      </Link>
                    </SheetClose>
                  </nav>

                  <div className='mt-6 space-y-2 border-t border-its-border pt-5 text-xs text-its-gray'>
                    <p>{CONTACT_PHONE}</p>
                    <p>{CONTACT_EMAIL}</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
