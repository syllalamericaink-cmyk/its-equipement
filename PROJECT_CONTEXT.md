# PROJECT_CONTEXT — ITS Équipement

## Objectif
Refondre progressivement l'interface ITS Équipement selon le fichier Figma de référence tout en conservant l'architecture métier, les API, les workflows de commande/devis, le panier, l'administration et la base PostgreSQL/Prisma existants.

## Références
- Figma : rYwZGI9PqIc8sgu8emZXrX
- Repo cible : syllalamericaink-cmyk/its-equipement
- Repo source historique : syllalamericaink-cmyk/its-equipement-pret-pour-github

## Stack
Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui/Radix, Framer Motion, Lucide, Prisma 6, PostgreSQL, NextAuth v4, Zod, react-hook-form, PDFKit.

## Architecture conservée
- Pages publiques sous src/app/(public)
- Back-office sous src/app/admin
- API publiques sous src/app/api/public
- API admin sous src/app/api/admin
- Services métier sous src/lib/services
- Prisma sous prisma/schema.prisma
- Panier Zustand sous src/stores
- Auth NextAuth sous src/app/api/auth

## Refonte UI
- Nouvelle direction visuelle : bleu nuit #071B2E, cyan #19C3D6, gris clair #F3F6F8, panneau #102C44, CTA orange #FF7A1A.
- Header public rapproché du Figma.
- Accueil refondu dans src/components/home/figma-home.tsx.
- Les données restent dynamiques via les API publiques existantes.
- Le formulaire de devis métier existant est conservé.
- Le panier et l'ajout rapide aux demandes restent branchés sur le store existant.
- Produits, catégories et bannières continuent d'être pilotables depuis le back-office.

## État
✅ Repo cible initialisé et application source importée.
✅ Assets statiques existants présents.
✅ Header public refondu.
✅ Page d'accueil remplacée par une version Figma adaptée aux APIs existantes.
🟡 Vérification build/CI à exécuter.
➡️ Prochaine étape : vérifier le build puis appliquer la même méthode au catalogue, à la fiche produit, au tunnel de commande et au back-office.

## Contraintes
- Ne pas demander ou stocker de secrets.
- Ne pas modifier les modèles Prisma ou les workflows métier uniquement pour des raisons visuelles.
- Travailler par petits lots et valider chaque lot.
- Aucun secret ne doit être ajouté à ce fichier.
