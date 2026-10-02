'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { CONTACT_PHONE, CONTACT_EMAIL, CONTACT_ADDRESS, CONTACT_WHATSAPP } from '@/constants'

const offreLinks = [
  { href: '/produits?search=EPI', label: 'EPI' },
  { href: '/produits?search=EPC', label: 'EPC' },
  { href: '/produits?search=vêtement', label: 'Vêtements professionnels' },
  { href: '/produits?search=chaussure', label: 'Chaussures de sécurité' },
  { href: '/produits?personalizable=1', label: 'Personnalisation' },
]

const entrepriseLinks = [
  { href: '/demande-devis', label: 'Demande de devis' },
  { href: '/livraison', label: 'Zones de livraison' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

function FooterLegal() {
  return (
    <div className='mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row'>
      <p>© {new Date().getFullYear()} ITS Équipement. Tous droits réservés.</p>
      <div className='flex items-center gap-6'>
        <Link href='/legal' className='transition-colors hover:text-white'>Mentions légales</Link>
        <Link href='/legal' className='transition-colors hover:text-white'>Politique de confidentialité</Link>
      </div>
    </div>
  )
}

function FooterAccordions() {
  return (
    <div className='md:hidden'>
      <details className='border-b border-white/10'>
        <summary className='flex min-h-[52px] cursor-pointer list-none items-center justify-between text-sm font-semibold text-white [&::-webkit-details-marker]:hidden'>
          Offre
          <span aria-hidden='true' className='text-lg text-white/60'>+</span>
        </summary>
        <ul className='pb-4'>
          {offreLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className='flex min-h-[40px] items-center text-sm text-white/75'>{link.label}</Link>
            </li>
          ))}
        </ul>
      </details>

      <details className='border-b border-white/10'>
        <summary className='flex min-h-[52px] cursor-pointer list-none items-center justify-between text-sm font-semibold text-white [&::-webkit-details-marker]:hidden'>
          Entreprise
          <span aria-hidden='true' className='text-lg text-white/60'>+</span>
        </summary>
        <ul className='pb-4'>
          {entrepriseLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className='flex min-h-[40px] items-center text-sm text-white/75'>{link.label}</Link>
            </li>
          ))}
        </ul>
      </details>

      <details className='border-b border-white/10' open>
        <summary className='flex min-h-[52px] cursor-pointer list-none items-center justify-between text-sm font-semibold text-white [&::-webkit-details-marker]:hidden'>
          Nous joindre
          <span aria-hidden='true' className='text-lg text-white/60'>+</span>
        </summary>
        <div className='space-y-2 pb-4'>
          <p>
            <a href={'tel:' + CONTACT_PHONE.replace(/\s/g, '')} className='font-display text-2xl font-bold tracking-tight text-white'>{CONTACT_PHONE}</a>
          </p>
          <p>
            <a href={CONTACT_WHATSAPP} target='_blank' rel='noopener noreferrer' className='inline-flex min-h-[44px] items-center gap-2 bg-its-lime px-3.5 py-2 text-sm font-bold text-its-dark'>
              <MessageCircle className='h-4 w-4' />
              WhatsApp Équipement
            </a>
          </p>
          <p><a href={'mailto:' + CONTACT_EMAIL} className='text-sm text-white/75'>{CONTACT_EMAIL}</a></p>
          <p className='text-sm text-white/60'>{CONTACT_ADDRESS}</p>
        </div>
      </details>
    </div>
  )
}

function FooterColumns() {
  return (
    <div className='hidden grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 md:grid'>
      <div>
        <div className='flex items-center gap-3'>
          <img src='/logo-its-equipement.jpg' alt='Logo ITS Équipement' className='h-11 w-11 shrink-0 rounded-md object-cover' />
          <div>
            <span className='font-display text-xl font-bold tracking-tight'>ITS ÉQUIPEMENT</span>
            <p className='mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-its-lime'>EPI · EPC · Équipement professionnel</p>
          </div>
        </div>
        <p className='mt-5 max-w-xs text-sm leading-relaxed text-white/60'>
          Plateforme dédiée aux équipements de protection individuelle et collective, aux vêtements professionnels, aux chaussures de sécurité et à la personnalisation.
        </p>
        <p className='mt-4 text-xs font-semibold text-white/45'>Une activité de ITSchool & Dynamic Group</p>
      </div>

      <div>
        <h3 className='text-xs font-bold uppercase tracking-[0.18em] text-its-lime'>Offre</h3>
        <ul className='mt-4 space-y-2.5'>
          {offreLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className='flex min-h-[32px] items-center text-sm text-white/80 transition-colors hover:text-its-lime'>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className='text-xs font-bold uppercase tracking-[0.18em] text-its-lime'>Entreprises</h3>
        <ul className='mt-4 space-y-2.5'>
          {entrepriseLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className='flex min-h-[32px] items-center text-sm text-white/80 transition-colors hover:text-its-lime'>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className='text-xs font-bold uppercase tracking-[0.18em] text-its-lime'>Contact équipement</h3>
        <p className='mt-4'>
          <a href={'tel:' + CONTACT_PHONE.replace(/\s/g, '')} className='font-display text-2xl font-bold tracking-tight text-white'>{CONTACT_PHONE}</a>
        </p>
        <p className='mt-2'>
          <a href={CONTACT_WHATSAPP} target='_blank' rel='noopener noreferrer' className='inline-flex min-h-[44px] items-center gap-2 bg-its-lime px-3.5 py-2 text-sm font-bold text-its-dark'>
            <MessageCircle className='h-4 w-4' />
            Écrire sur WhatsApp
          </a>
        </p>
        <p className='mt-2'><a href={'mailto:' + CONTACT_EMAIL} className='text-sm text-white/80'>{CONTACT_EMAIL}</a></p>
        <p className='mt-2 text-sm text-white/60'>{CONTACT_ADDRESS}</p>
      </div>
    </div>
  )
}

export function PublicFooter() {
  return (
    <footer className='bg-its-dark text-white' role='contentinfo'>
      <div className='container mx-auto px-4 pb-8 pt-10 sm:pt-14'>
        <div className='mb-6 flex items-center gap-3 md:hidden'>
          <img src='/logo-its-equipement.jpg' alt='Logo ITS Équipement' className='h-9 w-9 shrink-0 rounded-md object-cover' />
          <div>
            <span className='font-display text-base font-bold tracking-tight'>ITS ÉQUIPEMENT</span>
            <p className='text-[9px] font-bold uppercase tracking-[0.15em] text-its-lime'>EPI · EPC</p>
          </div>
        </div>
        <FooterAccordions />
        <FooterColumns />
        <FooterLegal />
      </div>
    </footer>
  )
}
