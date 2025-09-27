#!/bin/bash

echo "Installation des dépendances ShopShap..."

# Installer les dépendances principales
npm install lucide-react next-themes tailwindcss-animate clsx tailwind-merge class-variance-authority

# Installer les dépendances Radix UI
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-switch

# Installer Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

echo "Installation terminée !"
echo "Vous pouvez maintenant configurer votre projet Supabase et lancer 'npm run dev'"
