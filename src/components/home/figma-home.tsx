'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Eye,
  Factory,
  FileText,
  HardHat,
  Flame,
  Hand,
  Headphones,
  MessageCircle,
  Package,
  Plus,
  ShieldCheck,
  Shirt,
  Truck,
  Wrench,
} from 'lucide-react'
import { publicFetch } from '@/lib/public-api'
import { useCartStore } from '@/stores/cart-store'
import { HomeQuoteForm } from '@/components/home/home-quote-form'
import { CONTACT_WHATSAPP } from '@/constants'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  isFeatured: boolean
  _count: { products: number }
}

interface ProductImage {
  id: string
  url: string
  altText?: string | null
  sortOrder: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  sku: string
  basePrice: number
  isPersonalizable: boolean
  isActive: boolean
  homeSection?: string | null
  showOnHome?: boolean
  minQuantity?: number
  category: { id: string; name: string; slug: string }
  images: ProductImage[]
}

interface HeroSlide {
  id: string
  url: string | null
  altText: string
  title?: string | null
  text?: string | null
  ctaLabel?: string | null
  href?: string | null
  objectPosition?: string | null
}

const money = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FCFA'

const categoryTag = (name: string) => {
  const n = (name || '').toLowerCase()
  if (n.includes('epc') || n.includes('collectif')) return 'EPC'
  if (n.includes('epi') || n.includes('individuel')) return 'EPI'
  if (n.includes('vêtement') || n.includes('vetement') || n.includes('textile')) return 'VÊTEMENT'
  if (n.includes('chaussure')) return 'CHAUSSURE'
  return 'ÉQUIPEMENT'
}

const taxonomy = [
  {
    title: 'EPI',
    subtitle: 'Protection individuelle',
    href: '/produits?search=EPI',
    Icon: HardHat,
    description: 'Tête, yeux, mains, pieds, corps, antichute et autres protections.',
  },
  {
    title: 'EPC',
    subtitle: 'Protection collective',
    href: '/produits?search=EPC',
    Icon: ShieldCheck,
    description: 'Signalisation, sécurité incendie, balisage et équipements collectifs.',
  },
  {
    title: 'Vêtements professionnels',
    subtitle: 'Tenues métier',
    href: '/produits?search=vêtement',
    Icon: Shirt,
    description: 'Tenues de travail, haute visibilité et vêtements adaptés aux métiers.',
  },
  {
    title: 'Chaussures de sécurité',
    subtitle: 'Protection des pieds',
    href: '/produits?search=chaussure',
    Icon: FootnoteIcon,
    description: 'Chaussures et bottes pour chantier, industrie et environnement professionnel.',
  },
  {
    title: 'Personnalisation',
    subtitle: 'Logo & marquage',
    href: '/produits?personalizable=1',
    Icon: Wrench,
    description: 'Logo, texte, broderie ou marquage selon les produits disponibles.',
  },
]

function FootnoteIcon({ className }: { className?: string }) {
  return <Factory className={className} aria-hidden='true' />
}

export default function FigmaHome() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [hero, setHero] = useState<HeroSlide[]>([])
  const [ready, setReady] = useState(false)
  const [added, setAdded] = useState<Set<string>>(new Set())
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    let alive = true
    Promise.all([
      publicFetch<Category[]>('/api/public/categories'),
      publicFetch<Product[]>('/api/public/products?page=1&limit=24'),
      publicFetch<HeroSlide[]>('/api/public/hero'),
    ])
      .then(([c, p, h]) => {
        if (!alive) return
        if (c.success && c.data) setCategories(c.data)
        if (p.success && p.data) setProducts(p.data)
        if (h.success && h.data) setHero(h.data)
        setReady(true)
      })
      .catch(() => setReady(true))

    return () => {
      alive = false
    }
  }, [])

  const featured = useMemo(
    () => (products.some((p) => p.showOnHome) ? products.filter((p) => p.showOnHome) : products),
    [products]
  )

  const epi = useMemo(
    () =>
      featured
        .filter((p) => p.homeSection === 'EPI' || (!p.homeSection && categoryTag(p.category.name) === 'EPI'))
        .slice(0, 8),
    [featured]
  )

  const epc = useMemo(
    () =>
      featured
        .filter((p) => p.homeSection === 'EPC' || (!p.homeSection && categoryTag(p.category.name) === 'EPC'))
        .slice(0, 8),
    [featured]
  )

  const apparel = useMemo(
    () =>
      featured
        .filter(
          (p) =>
            p.homeSection === 'VETEMENTS' ||
            categoryTag(p.category.name) === 'VÊTEMENT' ||
            categoryTag(p.category.name) === 'CHAUSSURE'
        )
        .slice(0, 8),
    [featured]
  )

  const slide = hero[0]
  const heroImage = slide?.url || epi[0]?.images?.[0]?.url || epc[0]?.images?.[0]?.url
  const heroTitle = slide?.title || 'EPI & EPC pour protéger vos équipes'
  const heroText =
    slide?.text ||
    'Équipements de protection individuelle et collective, vêtements professionnels et chaussures de sécurité pour les entreprises et professionnels en Côte d’Ivoire.'

  const addToCart = (p: Product) => {
    addItem({
      id: p.id + '-home-' + Date.now(),
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      productSku: p.sku || undefined,
      productImage: p.images?.[0]?.url || '',
      quantity: Math.max(1, Number(p.minQuantity) || 1),
      minQuantity: p.minQuantity,
      unitPrice: p.basePrice,
      hasPersonalization: false,
      personalizationOptions: [],
      personalization: { impression: false, logo: false, texte: '', emplacement: '' },
    })
    setAdded((s) => new Set(s).add(p.id))
  }

  const ProductRail = ({ title, eyebrow, items }: { title: string; eyebrow: string; items: Product[] }) => (
    <section className='bg-white py-14 sm:py-18'>
      <div className='mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16'>
        <div className='mb-8 flex items-end justify-between gap-4'>
          <div>
            <span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>{eyebrow}</span>
            <h2 className='mt-2 text-[32px] font-black tracking-tight text-its-dark sm:text-[38px]'>{title}</h2>
          </div>
          <Link href='/produits' className='hidden items-center gap-2 text-sm font-bold text-its-dark sm:inline-flex'>
            Voir le catalogue <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {!ready
            ? [1, 2, 3, 4].map((x) => <div key={x} className='h-[350px] animate-pulse rounded-[12px] bg-its-cream' />)
            : items.length === 0
              ? (
                  <div className='col-span-full rounded-[12px] border border-dashed border-its-border bg-its-cream p-8 text-center'>
                    <Package className='mx-auto h-8 w-8 text-its-gray' />
                    <p className='mt-3 text-sm font-semibold text-its-dark'>Catalogue en cours de préparation</p>
                    <p className='mt-1 text-xs text-its-gray'>Les produits apparaîtront ici dès que le catalogue sera connecté.</p>
                    <Link href='/demande-devis' className='mt-4 inline-flex items-center gap-2 text-sm font-bold text-its-dark'>
                      Demander un devis <ArrowRight className='h-4 w-4' />
                    </Link>
                  </div>
                )
              : items.map((p) => (
                  <article
                    key={p.id}
                    className='group overflow-hidden rounded-[10px] border border-its-border bg-white transition-shadow hover:shadow-[0_14px_34px_rgba(7,27,46,0.10)]'
                  >
                    <Link href={'/produits/' + p.slug} className='block'>
                      <div className='h-[220px] overflow-hidden bg-its-cream'>
                        {p.images?.[0]?.url ? (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                          />
                        ) : (
                          <div className='grid h-full place-items-center text-its-gray'>
                            <Package className='h-8 w-8' />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className='p-4'>
                      <span className='text-[9px] font-extrabold uppercase tracking-wide text-its-gray'>
                        {categoryTag(p.category.name)}
                      </span>
                      <Link
                        href={'/produits/' + p.slug}
                        className='mt-2 block line-clamp-2 text-sm font-bold leading-5 text-its-dark'
                      >
                        {p.name}
                      </Link>
                      <div className='mt-4 flex items-center justify-between gap-3'>
                        <span className='text-sm font-extrabold'>{p.basePrice > 0 ? money(p.basePrice) : 'Sur devis'}</span>
                        <button
                          type='button'
                          onClick={() => addToCart(p)}
                          aria-label={'Ajouter ' + p.name}
                          className={
                            'grid h-9 w-9 place-items-center rounded-lg ' +
                            (added.has(p.id) ? 'bg-its-lime text-its-dark' : 'bg-its-dark text-white hover:bg-its-panel')
                          }
                        >
                          {added.has(p.id) ? <Check className='h-4 w-4' /> : <Plus className='h-4 w-4' />}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
        </div>
      </div>
    </section>
  )

  return (
    <div className='bg-white text-its-dark'>
      <section className='relative overflow-hidden bg-its-dark text-white'>
        <div className='relative min-h-[560px] lg:min-h-[650px]'>
          {heroImage ? (
            <img
              src={heroImage}
              alt={slide?.altText || 'EPI et EPC pour les professionnels'}
              className='absolute inset-0 h-full w-full object-cover'
              style={{
                objectPosition:
                  slide?.objectPosition === 'top'
                    ? 'center top'
                    : slide?.objectPosition === 'bottom'
                      ? 'center bottom'
                      : 'center center',
              }}
            />
          ) : null}
          <div className='absolute inset-0 bg-gradient-to-r from-its-dark via-its-dark/95 via-[58%] to-its-dark/15' />

          <div className='relative z-10 mx-auto flex min-h-[560px] max-w-[1440px] items-center px-5 py-16 sm:px-8 lg:min-h-[650px] lg:px-16'>
            <div className='max-w-[720px]'>
              <span className='inline-flex rounded-full bg-[#DDF8FB] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-its-panel'>
                ITS Équipement · ITSchool & Dynamic Group
              </span>
              <h1 className='mt-6 text-[44px] font-black leading-[1.04] tracking-[-0.03em] sm:text-[54px] lg:text-[60px]'>
                {heroTitle}
              </h1>
              <p className='mt-5 max-w-[610px] text-[15px] leading-7 text-[#C7D4DE] sm:text-[17px]'>{heroText}</p>

              <div className='mt-7 flex flex-wrap gap-3'>
                <Link
                  href={slide?.href || '/produits'}
                  className='inline-flex h-12 items-center gap-2 rounded-lg bg-[#FF7A1A] px-5 text-sm font-bold text-white'
                >
                  <Package className='h-4 w-4' />
                  Explorer les équipements
                </Link>
                <Link
                  href='/demande-devis'
                  className='inline-flex h-12 items-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-its-dark'
                >
                  <FileText className='h-4 w-4' />
                  Obtenir un devis
                </Link>
              </div>

              <div className='mt-9 flex flex-wrap gap-6 text-[11px] font-bold'>
                <span className='inline-flex items-center gap-2'>
                  <ShieldCheck className='h-4 w-4 text-its-lime' />
                  EPI & EPC
                </span>
                <span className='inline-flex items-center gap-2'>
                  <BadgeCheck className='h-4 w-4 text-its-lime' />
                  Pour professionnels & entreprises
                </span>
                <span className='inline-flex items-center gap-2'>
                  <MessageCircle className='h-4 w-4 text-its-lime' />
                  Conseil par WhatsApp
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='border-b border-its-border bg-its-cream py-8 sm:py-10'>
        <div className='mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-16'>
          <div className='w-full lg:w-[310px]'>
            <span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Entreprises</span>
            <h2 className='mt-2 text-[26px] font-black'>Besoin de plusieurs références ?</h2>
            <p className='mt-2 text-xs leading-5 text-its-gray'>
              Décrivez votre besoin en EPI/EPC et notre équipe prépare une proposition adaptée.
            </p>
          </div>
          <div className='min-w-0 flex-1 rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(7,27,46,0.08)]'>
            <HomeQuoteForm />
          </div>
        </div>
      </section>

      <section className='bg-white py-14 sm:py-18'>
        <div className='mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16'>
          <div className='mb-8'>
            <span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Catalogue</span>
            <h2 className='mt-2 text-[32px] font-black tracking-tight sm:text-[38px]'>Tout l’équipement au même endroit</h2>
            <p className='mt-2 max-w-2xl text-sm leading-6 text-its-gray'>
              Une navigation pensée d’abord pour l’EPI et l’EPC, puis pour les vêtements et équipements complémentaires.
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
            {taxonomy.map(({ title, subtitle, href, Icon, description }) => (
              <Link
                key={title}
                href={href}
                className='group rounded-[14px] border border-its-border bg-white p-5 transition-all hover:-translate-y-1 hover:border-its-lime hover:shadow-[0_14px_30px_rgba(7,27,46,0.08)]'
              >
                <span className='grid h-12 w-12 place-items-center rounded-xl bg-its-cream text-its-dark group-hover:bg-its-lime'>
                  <Icon className='h-5 w-5' />
                </span>
                <p className='mt-5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-its-gray'>{subtitle}</p>
                <h3 className='mt-2 text-lg font-black'>{title}</h3>
                <p className='mt-2 text-xs leading-5 text-its-gray'>{description}</p>
                <span className='mt-5 inline-flex items-center gap-2 text-xs font-bold'>
                  Voir la gamme <ArrowRight className='h-3.5 w-3.5' />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductRail title='Les essentiels EPI' eyebrow='Protection individuelle' items={epi} />
      <ProductRail title='Les indispensables EPC' eyebrow='Protection collective' items={epc} />

      <section className='bg-its-dark py-16 text-white sm:py-20'>
        <div className='mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16'>
          <div className='grid gap-6 lg:grid-cols-4'>
            {[
              { Icon: HardHat, title: 'Protection de la tête', text: 'Casques et équipements associés.' },
              { Icon: Eye, title: 'Protection des yeux', text: 'Lunettes et protections adaptées.' },
              { Icon: Hand, title: 'Protection des mains', text: 'Gants et solutions pour les métiers.' },
              { Icon: Flame, title: 'Sécurité incendie', text: 'Équipements collectifs et prévention.' },
            ].map(({ Icon, title, text }) => (
              <div key={title} className='rounded-[12px] border border-white/10 bg-white/[0.04] p-6'>
                <Icon className='h-6 w-6 text-its-lime' />
                <h3 className='mt-5 text-base font-extrabold'>{title}</h3>
                <p className='mt-2 text-sm leading-6 text-white/60'>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white py-16 sm:py-20'>
        <div className='mx-auto grid max-w-[1440px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-16'>
          <div>
            <span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Pour les entreprises</span>
            <h2 className='mt-2 max-w-2xl text-[34px] font-black leading-tight sm:text-[42px]'>
              Équiper une équipe entière ? Passez par le devis.
            </h2>
            <p className='mt-4 max-w-xl text-sm leading-6 text-its-gray'>
              Ajoutez plusieurs références, précisez les quantités, les besoins de personnalisation et les contraintes de livraison.
              Le parcours de demande de devis est conçu pour les commandes professionnelles.
            </p>
            <div className='mt-7 grid gap-3 sm:grid-cols-2'>
              {[
                'Plusieurs références dans une même demande',
                'Quantités et variantes',
                'Personnalisation selon les produits',
                'Échange avec l’équipe commerciale',
              ].map((item) => (
                <div key={item} className='flex items-start gap-3 text-sm font-semibold'>
                  <span className='mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-its-lime text-its-dark'>
                    <Check className='h-3.5 w-3.5' />
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <div className='mt-8 flex flex-wrap gap-3'>
              <Link href='/demande-devis' className='inline-flex h-12 items-center gap-2 rounded-lg bg-its-dark px-5 text-sm font-bold text-white'>
                <FileText className='h-4 w-4' />
                Faire une demande
              </Link>
              <a
                href={CONTACT_WHATSAPP}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex h-12 items-center gap-2 rounded-lg border border-its-border px-5 text-sm font-bold text-its-dark'
              >
                <MessageCircle className='h-4 w-4' />
                Écrire sur WhatsApp
              </a>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            {[
              { Icon: Factory, title: 'Industrie', text: 'Équiper les équipes et zones de travail.' },
              { Icon: HardHat, title: 'BTP', text: 'Protection individuelle et collective sur chantier.' },
              { Icon: Truck, title: 'Logistique', text: 'Tenues et protections pour les opérations.' },
              { Icon: Wrench, title: 'Maintenance', text: 'Équipements adaptés aux interventions.' },
            ].map(({ Icon, title, text }) => (
              <div key={title} className='rounded-[14px] border border-its-border bg-its-cream p-6'>
                <Icon className='h-6 w-6 text-its-dark' />
                <h3 className='mt-5 font-extrabold'>{title}</h3>
                <p className='mt-2 text-xs leading-5 text-its-gray'>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-its-cream py-16 sm:py-20'>
        <div className='mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-16'>
          <div className='rounded-[14px] border border-its-border bg-white p-7 sm:p-9'>
            <span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Personnalisation</span>
            <h2 className='mt-2 text-[32px] font-black leading-tight sm:text-[40px]'>Tenues et équipements à vos couleurs</h2>
            <p className='mt-4 text-sm leading-6 text-its-gray'>
              Pour les références compatibles, ajoutez votre logo, un texte ou des indications de marquage pendant la demande.
            </p>
            <Link href='/produits?personalizable=1' className='mt-6 inline-flex items-center gap-2 text-sm font-bold text-its-dark'>
              Voir les produits personnalisables <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid gap-3 sm:grid-cols-3'>
            {[
              { Icon: ShieldCheck, title: 'EPI', text: 'Protection individuelle au catalogue.' },
              { Icon: Package, title: 'EPC', text: 'Protection collective et sécurité.' },
              { Icon: Shirt, title: 'Tenues', text: 'Vêtements et chaussures professionnels.' },
            ].map(({ Icon, title, text }) => (
              <div key={title} className='rounded-[12px] border border-its-border bg-white p-5'>
                <Icon className='h-6 w-6 text-its-dark' />
                <h3 className='mt-5 text-base font-extrabold'>{title}</h3>
                <p className='mt-2 text-xs leading-5 text-its-gray'>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-its-lime py-12 sm:py-14'>
        <div className='mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-16'>
          <div>
            <p className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-dark/65'>ITS Équipement</p>
            <h2 className='mt-2 max-w-2xl text-[30px] font-black leading-tight text-its-dark sm:text-[38px]'>
              EPI, EPC et équipements professionnels, au même endroit.
            </h2>
            <p className='mt-2 text-sm text-its-dark/70'>Catalogue, commande, devis entreprise et personnalisation.</p>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Link href='/produits' className='inline-flex h-12 items-center gap-2 rounded-lg bg-its-dark px-5 text-sm font-bold text-white'>
              <Package className='h-4 w-4' />
              Explorer le catalogue
            </Link>
            <Link href='/demande-devis' className='inline-flex h-12 items-center gap-2 rounded-lg border border-its-dark/20 bg-white px-5 text-sm font-bold text-its-dark'>
              <FileText className='h-4 w-4' />
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {categories.length === 0 ? null : null}
    </div>
  )
}
