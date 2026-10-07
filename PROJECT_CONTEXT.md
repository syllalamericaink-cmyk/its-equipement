# PROJECT_CONTEXT — ITS Équipement

## Objectif
Faire d'ITS Équipement la plateforme spécialisée de ITSchool & Dynamic Group dédiée aux équipements professionnels, avec un positionnement clair centré sur les EPI et EPC, complété par les vêtements professionnels, chaussures de sécurité et services de personnalisation.

## Périmètre
ITS Équipement remplace la section EPI/EPC du site principal ITSchool. Le site doit rester spécialisé dans l'équipement et ne doit pas devenir un second site généraliste de formation ou d'immigration.

## Références
- Figma : rYwZGI9PqIc8sgu8emZXrX
- Repo cible : syllalamericaink-cmyk/its-equipement
- Repo source historique : syllalamericaink-cmyk/its-equipement-pret-pour-github
- Site institutionnel : https://itschoolci.com/

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

## Positionnement UI
- EPI et EPC sont les deux entrées commerciales principales.
- Vêtements professionnels et chaussures de sécurité sont des gammes complémentaires.
- Personnalisation = offre complémentaire pour les références compatibles.
- CTA principaux : catalogue, demande de devis, WhatsApp dédié équipement.
- Mention institutionnelle discrète : « Une activité de ITSchool & Dynamic Group ».
- Pas de statistiques commerciales non vérifiées dans l'interface.

## Refonte déjà appliquée
- Header public centré EPI/EPC.
- Homepage centrée EPI/EPC avec zones catalogue, devis entreprise, personnalisation et parcours professionnels.
- Footer recentré sur l'offre équipement.
- Les données restent dynamiques via les API publiques existantes ; la base de données pourra être connectée/peuplée ultérieurement.
- Les composants de commande, panier, devis, personnalisation et administration existants sont conservés.

## État
✅ Repo cible initialisé et application source importée.
✅ Assets statiques existants présents.
✅ Header public réaligné sur EPI/EPC.
✅ Homepage réalignée sur EPI/EPC.
✅ Footer réaligné sur l'activité équipement.
✅ Visuels SVG dédiés ajoutés pour EPI, EPC, vêtements, chaussures, personnalisation, entreprises et livraison.
🟡 Build CI à vérifier après le dernier correctif produit.
➡️ Prochaine étape : vérifier visuellement le catalogue, les fiches produits, puis le tunnel commande/devis avec la même direction visuelle.

## Contraintes
- Ne pas demander ou stocker de secrets.
- Ne pas modifier les modèles Prisma ou les workflows métier uniquement pour des raisons visuelles.
- Travailler par petits lots et valider chaque lot.
- Aucun secret ne doit être ajouté à ce fichier.
- La base de données pourra être connectée plus tard ; ne pas simuler de données commerciales présentées comme réelles.
