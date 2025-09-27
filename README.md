# ShopShap 🛍️

**SaaS de gestion e-commerce pour l'Afrique**

Transformez vos ventes TikTok et WhatsApp en boutique professionnelle. Créez votre catalogue, partagez votre lien unique et vendez directement via WhatsApp.

## 🌟 Fonctionnalités

- ✅ **Catalogue en ligne** - Créez facilement votre catalogue avec photos, prix et descriptions
- ✅ **Lien unique** - Obtenez votre lien personnalisé `shopshap.africa/votre-boutique`
- ✅ **Commandes WhatsApp** - Vos clients commandent directement via WhatsApp
- ✅ **Multi-devises** - Support des devises africaines (XOF, MAD, TND, etc.)
- ✅ **Mode sombre/clair** - Interface moderne et responsive
- ✅ **Authentification Google** - Connexion simple et sécurisée

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth + Database + Storage)
- **Déploiement**: Vercel

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/shopshap.git
cd shopshap
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Copiez le fichier `.env.example` vers `.env.local`
3. Remplissez les variables d'environnement :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configuration de la base de données

Exécutez le script SQL dans `supabase/migrations/001_initial_schema.sql` dans l'éditeur SQL de Supabase.

### 5. Configuration de l'authentification Google

1. Dans Supabase, allez dans Authentication > Providers
2. Activez Google OAuth
3. Configurez vos Client ID et Client Secret Google
4. Ajoutez `http://localhost:3000/auth/callback` dans les URLs de redirection

### 6. Lancer le projet
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
shopshap/
├── app/
│   ├── [slug]/           # Pages catalogue publiques
│   ├── auth/             # Authentification
│   ├── dashboard/        # Dashboard vendeur
│   ├── onboarding/       # Configuration initiale
│   └── page.tsx          # Page d'accueil
├── components/
│   ├── ui/               # Composants UI (shadcn/ui)
│   └── theme-provider.tsx
├── lib/
│   ├── supabase.ts       # Configuration Supabase
│   └── utils.ts          # Utilitaires
└── supabase/
    └── migrations/       # Scripts SQL
```

## 🗄️ Base de données

### Tables principales :

- **vendeurs** - Informations des vendeurs
- **catalogues** - Catalogues avec slug unique
- **produits** - Produits avec prix et images

## 🌍 Parcours utilisateur

1. **Inscription** via Google
2. **Onboarding** - Configuration boutique (nom, devise, WhatsApp)
3. **Dashboard** - Ajout/gestion des produits
4. **Catalogue public** - Partage du lien unique
5. **Commandes** - Clients commandent via WhatsApp

## 🎨 Design System

- **Couleurs principales** : Bleu (#2563EB) et Orange (#F97316)
- **Mode sombre/clair** avec next-themes
- **Composants UI** avec shadcn/ui
- **Police** : Inter

## 📱 Exemple de lien catalogue

`https://shopshap.africa/safiatou-boutique`

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repo GitHub à Vercel
2. Ajoutez les variables d'environnement
3. Déployez automatiquement

### Variables d'environnement pour la production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🌍 Fait avec ❤️ pour l'Afrique

ShopShap est conçu spécifiquement pour les entrepreneurs africains qui vendent sur TikTok et WhatsApp.

---

**Contact** : [votre-email@example.com](mailto:votre-email@example.com)
