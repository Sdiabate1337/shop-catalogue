#!/bin/bash

echo "🚀 Démarrage de ShopShap..."

# Arrêter les processus Next.js existants
pkill -f "next dev" 2>/dev/null || true

# Attendre un peu
sleep 2

# Démarrer le serveur de développement
cd /Users/macook/Desktop/shopshap
npm run dev
