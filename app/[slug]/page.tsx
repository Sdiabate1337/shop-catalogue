"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, MessageCircle, Moon, Sun } from "@/components/icons"
import { useTheme } from "@/hooks/use-theme"
import { notFound } from "next/navigation"

interface Vendeur {
  id: string
  nom_boutique: string
  devise: string
  whatsapp: string
}

interface Catalogue {
  id: string
  slug: string
  vendeur: Vendeur
}

interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  image_url: string
}

export default function CataloguePage({ params }: { params: Promise<{ slug: string }> }) {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null)
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')
  const { theme, setTheme } = useTheme()
  const supabase = createClient()

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    initializeParams()
  }, [params])

  useEffect(() => {
    if (slug) {
      loadCatalogue()
    }
  }, [slug])

  const loadCatalogue = async () => {
    try {
      // Charger le catalogue avec les infos du vendeur
      const catalogueResponse = await supabase
        .from('catalogues')
        .select(`
          *,
          vendeur:vendeurs(*)
        `)
        .eq('slug', slug)
        .single()

      if (catalogueResponse.error || !catalogueResponse.data) {
        notFound()
        return
      }

      const catalogueData = catalogueResponse.data as any
      setCatalogue(catalogueData)

      // Charger les produits
      const { data: produitsData } = await supabase
        .from('produits')
        .select('*')
        .eq('catalogue_id', catalogueData.id)
        .order('created_at', { ascending: false })

      setProduits(produitsData || [])
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const generateWhatsAppMessage = (produit: Produit) => {
    const message = `Bonjour, je veux commander ${produit.nom} - ${produit.prix} ${catalogue?.vendeur.devise}`
    return `https://wa.me/${catalogue?.vendeur.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
  }

  const generateWhatsAppContact = () => {
    const message = `Bonjour, j'ai vu votre boutique ${catalogue?.vendeur.nom_boutique} sur ShopShap. Je souhaiterais avoir plus d'informations.`
    return `https://wa.me/${catalogue?.vendeur.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p>Chargement de la boutique...</p>
        </div>
      </div>
    )
  }

  if (!catalogue) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {catalogue.vendeur.nom_boutique}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Boutique en ligne
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              
              <Button 
                onClick={() => window.open(generateWhatsAppContact(), '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contacter
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenue chez {catalogue.vendeur.nom_boutique}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Découvrez nos produits et commandez directement via WhatsApp
          </p>
        </div>

        {/* Produits */}
        {produits.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Catalogue en préparation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Cette boutique ajoute actuellement ses produits. Revenez bientôt !
            </p>
            <Button 
              onClick={() => window.open(generateWhatsAppContact(), '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contacter le vendeur
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produits.map((produit) => (
              <Card key={produit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                  {produit.image_url ? (
                    <img
                      src={produit.image_url}
                      alt={produit.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    {produit.nom}
                  </h3>
                  
                  {produit.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {produit.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      {produit.prix} {catalogue.vendeur.devise}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => window.open(generateWhatsAppMessage(produit), '_blank')}
                    className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Commander sur WhatsApp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">ShopShap</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Créez votre boutique en ligne gratuitement
            </p>
            <Button variant="outline" asChild>
              <a href="/" target="_blank">
                Créer ma boutique
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
