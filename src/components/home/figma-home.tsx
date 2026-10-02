'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Check, Factory, FileText, HardHat, MessageCircle, Package, Plus, Search, ShieldCheck, Truck, Utensils, Warehouse, Wrench } from 'lucide-react'
import { publicFetch } from '@/lib/public-api'
import { useCartStore } from '@/stores/cart-store'
import { HomeQuoteForm } from '@/components/home/home-quote-form'
import { CONTACT_WHATSAPP } from '@/constants'

interface Category { id: string; name: string; slug: string; description: string | null; imageUrl: string | null; isFeatured: boolean; _count: { products: number } }
interface ProductImage { id: string; url: string; altText?: string | null; sortOrder: number }
interface Product { id: string; name: string; slug: string; description: string; sku: string; basePrice: number; isPersonalizable: boolean; isActive: boolean; homeSection?: string | null; showOnHome?: boolean; minQuantity?: number; category: { id: string; name: string; slug: string }; images: ProductImage[] }
interface HeroSlide { id: string; url: string | null; altText: string; title?: string | null; text?: string | null; ctaLabel?: string | null; href?: string | null; objectPosition?: string | null }

const money = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FCFA'
const categoryTag = (name: string) => {
  const n = (name || '').toLowerCase()
  if (n.includes('individuel')) return 'EPI'
  if (n.includes('collectif')) return 'EPC'
  if (n.includes('vêtement') || n.includes('vetement') || n.includes('textile')) return 'TEXTILE'
  if (n.includes('chaussure')) return 'PIEDS'
  return 'GAMME'
}
const sectorIcons = [HardHat, Factory, Warehouse, Utensils, Wrench]

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
    ]).then(([c, p, h]) => {
      if (!alive) return
      if (c.success && c.data) setCategories(c.data)
      if (p.success && p.data) setProducts(p.data)
      if (h.success && h.data) setHero(h.data)
      setReady(true)
    }).catch(() => setReady(true))
    return () => { alive = false }
  }, [])

  const featured = useMemo(() => products.filter((p) => p.showOnHome).length ? products.filter((p) => p.showOnHome) : products, [products])
  const epi = useMemo(() => featured.filter((p) => p.homeSection === 'EPI' || (!p.homeSection && categoryTag(p.category.name) !== 'TEXTILE' && categoryTag(p.category.name) !== 'PIEDS')).slice(0, 8), [featured])
  const apparel = useMemo(() => featured.filter((p) => p.homeSection === 'VETEMENTS' || categoryTag(p.category.name) === 'TEXTILE' || categoryTag(p.category.name) === 'PIEDS').slice(0, 8), [featured])
  const univers = useMemo(() => {
    const f = categories.filter((c) => c.isFeatured).slice(0, 5)
    if (f.length) return f.map((c, i) => ({ title: c.name, detail: c.description || 'Découvrir la gamme', href: '/categories/' + c.slug, Icon: sectorIcons[i % sectorIcons.length] }))
    return [
      { title: 'EPI', detail: 'Protection individuelle', href: '/produits', Icon: HardHat },
      { title: 'Industrie', detail: 'Environnement industriel', href: '/produits', Icon: Factory },
      { title: 'Logistique', detail: 'Entrepôt et flux', href: '/produits', Icon: Warehouse },
      { title: 'Restauration', detail: 'Hygiène et métiers de bouche', href: '/produits', Icon: Utensils },
      { title: 'Maintenance', detail: 'Outillage et intervention', href: '/produits', Icon: Wrench },
    ]
  }, [categories])
  const slide = hero[0]

  const addToCart = (p: Product) => {
    addItem({ id: p.id + '-home-' + Date.now(), productId: p.id, productName: p.name, productSlug: p.slug, productSku: p.sku || undefined, productImage: p.images?.[0]?.url || '', quantity: Math.max(1, Number(p.minQuantity) || 1), minQuantity: p.minQuantity, unitPrice: p.basePrice, hasPersonalization: false, personalizationOptions: [], personalization: { impression: false, logo: false, texte: '', emplacement: '' } })
    setAdded((s) => new Set(s).add(p.id))
  }

  const heroImage = slide?.url || apparel[0]?.images?.[0]?.url || epi[0]?.images?.[0]?.url
  const heroTitle = slide?.title || 'La protection terrain, sans compromis.'
  const heroText = slide?.text || 'EPI certifiés, vêtements professionnels et chaussures sélectionnés pour les équipes qui ne peuvent pas se permettre l’à-peu-près.'

  const ProductRail = (props: { title: string; items: Product[] }) => (
    <section className='bg-white py-16 sm:py-20'>
      <div className='mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16'>
        <div className='mb-8 flex items-end justify-between gap-4'>
          <div><span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Sélection terrain</span><h2 className='mt-2 text-[32px] font-black tracking-tight text-its-dark sm:text-[38px]'>{props.title}</h2></div>
          <Link href='/produits' className='hidden items-center gap-2 text-sm font-bold text-its-dark sm:inline-flex'>Voir tout <ArrowRight className='h-4 w-4' /></Link>
        </div>
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {(ready ? props.items : [1,2,3,4].map((x) => null)).slice(0, 8).map((p, i) => p ? (
            <article key={p.id} className='group overflow-hidden rounded-[10px] border border-its-border bg-white transition-shadow hover:shadow-[0_14px_34px_rgba(7,27,46,0.10)]'>
              <Link href={'/produits/' + p.slug} className='block'><div className='h-[220px] overflow-hidden bg-its-cream'>{p.images?.[0]?.url ? <img src={p.images[0].url} alt={p.name} className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]' /> : <div className='grid h-full place-items-center text-its-gray'><Package className='h-8 w-8' /></div>}</div></Link>
              <div className='p-4'><span className='text-[9px] font-extrabold uppercase tracking-wide text-its-gray'>{categoryTag(p.category.name)}</span><Link href={'/produits/' + p.slug} className='mt-2 block line-clamp-2 text-sm font-bold leading-5 text-its-dark'>{p.name}</Link><div className='mt-4 flex items-center justify-between gap-3'><span className='text-sm font-extrabold'>{p.basePrice > 0 ? money(p.basePrice) : 'Sur devis'}</span><button type='button' onClick={() => addToCart(p)} aria-label={'Ajouter ' + p.name} className={'grid h-9 w-9 place-items-center rounded-lg ' + (added.has(p.id) ? 'bg-its-lime text-its-dark' : 'bg-its-dark text-white hover:bg-its-panel')}>{added.has(p.id) ? <Check className='h-4 w-4' /> : <Plus className='h-4 w-4' />}</button></div></div>
            </article>
          ) : <div key={i} className='h-[360px] rounded-[10px] bg-its-cream animate-pulse' />)}
        </div>
      </div>
    </section>
  )

  return (
    <div className='bg-white text-its-dark'>
      <section className='relative overflow-hidden bg-its-dark text-white'>
        <div className='relative min-h-[540px] lg:min-h-[650px]'>
          {heroImage ? <img src={heroImage} alt={slide?.altText || 'Équipements professionnels'} className='absolute inset-0 h-full w-full object-cover' style={{ objectPosition: slide?.objectPosition === 'top' ? 'center top' : slide?.objectPosition === 'bottom' ? 'center bottom' : 'center center' }} /> : null}
          <div className='absolute inset-0 bg-gradient-to-r from-its-dark via-its-dark/90 via-[55%] to-its-dark/10' />
          <div className='relative z-10 mx-auto flex min-h-[540px] max-w-[1440px] items-center px-5 py-16 sm:px-8 lg:min-h-[650px] lg:px-16'>
            <div className='max-w-[660px]'>
              <span className='inline-flex rounded-full bg-[#DDF8FB] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-its-panel'>Équipement professionnel · France & Afrique de l’Ouest</span>
              <h1 className='mt-6 text-[44px] font-black leading-[1.04] tracking-[-0.03em] sm:text-[54px] lg:text-[60px]'>{heroTitle}</h1>
              <p className='mt-5 max-w-[580px] text-[15px] leading-7 text-[#C7D4DE] sm:text-[17px]'>{heroText}</p>
              <div className='mt-7 flex flex-wrap gap-3'><Link href={slide?.href || '/produits'} className='inline-flex h-12 items-center gap-2 rounded-lg bg-[#FF7A1A] px-5 text-sm font-bold text-white'><ArrowRight className='h-4 w-4' />{slide?.ctaLabel || 'Explorer le catalogue'}</Link><Link href='/demande-devis' className='inline-flex h-12 items-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-its-dark'><FileText className='h-4 w-4' />Obtenir un devis</Link></div>
              <div className='mt-9 flex flex-wrap gap-7 text-[11px] font-bold'><span className='inline-flex items-center gap-2'><ShieldCheck className='h-4 w-4 text-its-lime' />EPI certifiés</span><span className='inline-flex items-center gap-2'><Package className='h-4 w-4 text-its-lime' />Stock vérifié</span><span className='inline-flex items-center gap-2'><BadgeCheck className='h-4 w-4 text-its-lime' />Conseil métier</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className='border-b border-its-border bg-its-cream py-8 sm:py-10'><div className='mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-16'><div className='w-full lg:w-[300px]'><span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Besoin d’aller vite ?</span><h2 className='mt-2 text-[26px] font-black'>Votre devis en 2 minutes</h2><p className='mt-2 text-xs leading-5 text-its-gray'>Décrivez le besoin. Notre équipe confirme les références et le délai.</p></div><div className='min-w-0 flex-1 rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(7,27,46,0.08)]'><HomeQuoteForm /></div></div></section>
      <ProductRail title='Les essentiels qui font équipe' items={epi} />

      <section className='bg-white pb-8 sm:pb-12'><div className='mx-auto grid max-w-[1440px] gap-5 px-5 sm:px-8 lg:grid-cols-2 lg:px-16'>{[{ title: 'Vêtements professionnels', description: 'Des tenues pensées pour travailler, identifier les équipes et tenir la durée.', href: '/produits?search=vêtement', image: apparel[0]?.images?.[0]?.url }, { title: 'Équipements qui tiennent la cadence', description: 'Une sélection terrain pour protéger, équiper et accompagner chaque intervention.', href: '/produits', image: epi[1]?.images?.[0]?.url }].map((item) => <Link key={item.title} href={item.href} className='group relative min-h-[340px] overflow-hidden rounded-[14px] bg-its-dark text-white sm:min-h-[410px]'>{item.image ? <img src={item.image} alt='' className='absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-[1.03]' /> : null}<div className='absolute inset-0 bg-gradient-to-t from-its-dark via-its-dark/55 to-transparent' /><div className='relative flex h-full flex-col justify-end p-7 sm:p-9'><span className='mb-3 inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide'>Univers produit</span><h3 className='max-w-[540px] text-3xl font-black leading-tight sm:text-4xl'>{item.title}</h3><p className='mt-3 max-w-[540px] text-sm text-white/80'>{item.description}</p><span className='mt-5 inline-flex items-center gap-2 text-sm font-bold text-its-lime'>Découvrir <ArrowRight className='h-4 w-4' /></span></div></Link>)}</div></section>

      <section className='bg-white py-16 sm:py-20'><div className='mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16'><div className='mb-8'><span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Univers métiers</span><h2 className='mt-2 text-[32px] font-black tracking-tight sm:text-[38px]'>Équipés pour chaque réalité terrain</h2><p className='mt-2 max-w-2xl text-sm text-its-gray'>Des gammes adaptées aux environnements où la protection, le confort et la continuité d’activité comptent.</p></div><div className='grid grid-cols-2 gap-3 md:grid-cols-5'>{univers.map(({ title, detail, href, Icon }) => <Link key={title} href={href} className='rounded-[12px] border border-its-border p-5 transition-colors hover:border-its-lime hover:bg-its-cream'><span className='grid h-11 w-11 place-items-center rounded-lg bg-its-cream text-its-dark'><Icon className='h-5 w-5' /></span><h3 className='mt-6 text-base font-extrabold'>{title}</h3><p className='mt-2 text-xs leading-5 text-its-gray'>{detail}</p></Link>)}</div></div></section>

      <section className='bg-its-dark py-16 text-white sm:py-20'><div className='mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-16'><div><span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Preuves de confiance</span><div className='mt-6 max-w-xl'><div className='text-5xl font-black text-its-lime'>“</div><p className='mt-2 text-2xl font-semibold leading-tight sm:text-3xl'>Équiper les équipes avec des références claires, des délais compréhensibles et un suivi simple.</p><p className='mt-5 text-sm text-white/60'>ITS Équipement · Protection & équipement professionnel</p></div></div><div className='grid grid-cols-2 gap-4'>{[['12+', 'années d’expérience terrain'], ['4,8/5', 'satisfaction moyenne'], ['98%', 'commandes livrées conformes'], ['48 h', 'objectif de réponse devis']].map(([v,l]) => <div key={v} className='rounded-[12px] border border-white/10 bg-white/[0.04] p-5 sm:p-6'><div className='text-3xl font-black text-its-lime sm:text-4xl'>{v}</div><div className='mt-2 text-xs text-white/60'>{l}</div></div>)}</div></div></section>

      <section className='py-16 sm:py-20'><div className='mx-auto grid max-w-[1440px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-16'><div className='overflow-hidden rounded-[14px] bg-its-cream'>{apparel[0]?.images?.[0]?.url ? <img src={apparel[0].images[0].url} alt='Personnalisation de vêtements professionnels' className='h-[360px] w-full object-cover sm:h-[450px]' /> : <div className='grid h-[360px] place-items-center text-its-gray sm:h-[450px]'>Personnalisation professionnelle</div>}</div><div><span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Personnalisation</span><h2 className='mt-2 max-w-xl text-[34px] font-black leading-tight sm:text-[42px]'>Personnalisez vos tenues métier</h2><p className='mt-4 max-w-xl text-sm leading-6 text-its-gray'>Logo, nom de service ou fonction. Nous cadrons le besoin, préparons le rendu et validons le BAT avant production.</p><div className='mt-7 space-y-3 text-sm font-semibold'>{['Définition du besoin et des emplacements', 'Préparation du marquage', 'Validation du BAT avant lancement'].map((t,i) => <div key={t} className='flex items-center gap-3'><span className='grid h-7 w-7 place-items-center rounded-full bg-its-lime text-xs font-black text-its-dark'>{i + 1}</span>{t}</div>)}</div><div className='mt-8 flex flex-wrap gap-3'><Link href='/produits?personalizable=1' className='inline-flex h-12 items-center gap-2 rounded-lg bg-its-dark px-5 text-sm font-bold text-white'>Voir les produits <ArrowRight className='h-4 w-4' /></Link><a href={CONTACT_WHATSAPP} target='_blank' rel='noopener noreferrer' className='inline-flex h-12 items-center gap-2 rounded-lg border border-its-border px-5 text-sm font-bold text-its-dark'><MessageCircle className='h-4 w-4' />Parler du projet</a></div></div></div></section>

      <section className='bg-its-cream py-16 sm:py-20'><div className='mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-16'><div className='rounded-[14px] border border-its-border bg-white p-7 sm:p-9'><span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-its-lime'>Livraison</span><h2 className='mt-2 text-[32px] font-black leading-tight sm:text-[40px]'>De la commande à la livraison, sans zone grise.</h2><p className='mt-4 max-w-xl text-sm leading-6 text-its-gray'>Livraison à Abidjan et dans les principales zones de Côte d’Ivoire, avec préparation et suivi adaptés aux besoins professionnels.</p><div className='mt-6 flex flex-wrap gap-2'><span className='rounded-full bg-its-cream px-3 py-1 text-xs font-bold'>Abidjan</span><span className='rounded-full bg-its-cream px-3 py-1 text-xs font-bold'>Côte d’Ivoire</span><span className='rounded-full bg-its-cream px-3 py-1 text-xs font-bold'>Retrait possible</span></div></div><div className='grid gap-3 sm:grid-cols-3'>{[['Commande','Validation et préparation',BadgeCheck],['Préparation','Contrôle des références',Package],['Livraison','Expédition vers votre zone',Truck]].map(([t,d,Icon]) => <div key={String(t)} className='rounded-[12px] border border-its-border bg-white p-5'><Icon className='h-6 w-6 text-its-dark' /><h3 className='mt-5 text-base font-extrabold'>{String(t)}</h3><p className='mt-2 text-xs leading-5 text-its-gray'>{String(d)}</p></div>)}</div></div></section>

      <section className='bg-its-lime py-12 sm:py-14'><div className='mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-16'><div><h2 className='max-w-2xl text-[30px] font-black leading-tight text-its-dark sm:text-[38px]'>Votre équipe mérite un équipement à la hauteur.</h2><p className='mt-2 text-sm text-its-dark/70'>Produits, devis, personnalisation et livraison : choisissez votre point d’entrée.</p></div><div className='flex flex-wrap gap-3'><Link href='/produits' className='inline-flex h-12 items-center gap-2 rounded-lg bg-its-dark px-5 text-sm font-bold text-white'><Package className='h-4 w-4' />Explorer le catalogue</Link><Link href='/demande-devis' className='inline-flex h-12 items-center gap-2 rounded-lg border border-its-dark/20 bg-white px-5 text-sm font-bold text-its-dark'><MessageCircle className='h-4 w-4' />Demander un devis</Link></div></div></section>
    </div>
  )
}
