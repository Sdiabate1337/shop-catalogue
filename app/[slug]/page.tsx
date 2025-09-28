"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, MessageCircle, Moon, Sun, Package, Sparkles, Eye, X, Heart, ChevronLeft, ChevronRight } from "@/components/icons"
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
  visible: boolean
}

export default function CataloguePage({ params }: { params: Promise<{ slug: string }> }) {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null)
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')
  const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [autoSlideInterval, setAutoSlideInterval] = useState<NodeJS.Timeout | null>(null)
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

  // Gestion du carousel automatique
  useEffect(() => {
    if (selectedProduct && selectedProduct.image_url) {
      // Pour l'instant, on simule plusieurs images avec la même image
      const images = [selectedProduct.image_url, selectedProduct.image_url, selectedProduct.image_url]
      
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length)
        }, 3000) // Change d'image toutes les 3 secondes
        
        setAutoSlideInterval(interval)
        
        return () => {
          clearInterval(interval)
          setAutoSlideInterval(null)
        }
      }
    }
    
    return () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval)
        setAutoSlideInterval(null)
      }
    }
  }, [selectedProduct])

  const nextImage = () => {
    if (selectedProduct) {
      const images = selectedProduct.images && selectedProduct.images.length > 0 
        ? selectedProduct.images 
        : selectedProduct.image_url ? [{ image_url: selectedProduct.image_url }] : []
      
      if (images.length > 1) {
        setCurrentImageIndex((prev: number) => (prev + 1) % images.length)
        
        // Reset auto-slide timer
        if (autoSlideInterval) {
          clearInterval(autoSlideInterval)
        }
        const newInterval = setInterval(() => {
          setCurrentImageIndex((prev: number) => (prev + 1) % images.length)
        }, 3000)
        setAutoSlideInterval(newInterval)
      }
    }
  }

  const prevImage = () => {
    if (selectedProduct) {
      const images = selectedProduct.images && selectedProduct.images.length > 0 
        ? selectedProduct.images 
        : selectedProduct.image_url ? [{ image_url: selectedProduct.image_url }] : []
      
      if (images.length > 1) {
        setCurrentImageIndex((prev: number) => (prev - 1 + images.length) % images.length)
        
        // Reset auto-slide timer
        if (autoSlideInterval) {
          clearInterval(autoSlideInterval)
        }
        const newInterval = setInterval(() => {
          setCurrentImageIndex((prev: number) => (prev + 1) % images.length)
        }, 3000)
        setAutoSlideInterval(newInterval)
      }
    }
  }

  const loadCatalogue = async () => {
    try {
      const response = await fetch(`/api/catalogue/${(await params).slug}`)
      if (!response.ok) {
        throw new Error('Catalogue non trouvé')
      }
      const data = await response.json()
      setCatalogue(data.catalogue)
      // Les produits incluent maintenant leurs images multiples
      setProduits(data.produits)
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {produits.map((produit) => (
              <Card key={produit.id} className="group overflow-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-lg border-0">
                {/* Image principale */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {produit.image_url ? (
                    <img
                      src={produit.image_url}
                      alt={produit.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Boutons overlay */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full w-10 h-10 shadow-lg"
                    >
                      <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </Button>
                  </div>

                  {/* Bouton voir détails */}
                  <div className="absolute bottom-3 right-3">
                    <Button
                      onClick={() => setSelectedProduct(produit)}
                      size="icon"
                      className="bg-white dark:bg-gray-900 rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-transform"
                    >
                      <Eye className="w-5 h-5 text-gray-900 dark:text-white" />
                    </Button>
                  </div>
                </div>
                
                {/* Contenu card */}
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {produit.nom}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                      {produit.prix} {catalogue.vendeur.devise}
                    </span>
                  </div>
                  
                  {produit.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {produit.description}
                    </p>
                  )}
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => window.open(generateWhatsAppMessage(produit), '_blank')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium h-12 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Commander
                    </Button>
                    <Button
                      onClick={() => setSelectedProduct(produit)}
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-12 h-12 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal produit détaillé */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black animate-in fade-in duration-300">
          {/* Carousel d'images fullscreen */}
          <div className="relative w-full h-full overflow-hidden">
            {(() => {
              // Utiliser les images multiples si disponibles, sinon l'image principale
              const images = selectedProduct.images && selectedProduct.images.length > 0 
                ? selectedProduct.images.map((img: any) => img.image_url)
                : selectedProduct.image_url ? [selectedProduct.image_url] : []
              
              if (images.length === 0) {
                return (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-in slide-in-from-top duration-700 ease-out">
                    <Package className="h-20 w-20 text-gray-400" />
                  </div>
                )
              }

              const currentImage = images[currentImageIndex] || images[0]
              
              return (
                <>
                  {/* Image principale */}
                  <div className="relative w-full h-full">
                    <img
                      src={currentImage}
                      alt={selectedProduct.nom}
                      className="w-full h-full object-cover animate-in slide-in-from-top duration-700 ease-out"
                    />
                    
                    {/* Overlay gradient pour les boutons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />
                  </div>

                  {/* Flèches de navigation - seulement si plusieurs images */}
                  {images.length > 1 && (
                    <>
                      <Button
                        onClick={prevImage}
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 shadow-lg z-10 hover:scale-110 transition-all opacity-80 hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </Button>

                      <Button
                        onClick={nextImage}
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 shadow-lg z-10 hover:scale-110 transition-all opacity-80 hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </Button>

                      {/* Indicateurs de pagination */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              currentImageIndex === index 
                                ? 'bg-white scale-125' 
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )
            })()}
            
            {/* Bouton fermer */}
            <Button
              onClick={() => {
                setSelectedProduct(null)
                setCurrentImageIndex(0)
                if (autoSlideInterval) {
                  clearInterval(autoSlideInterval)
                  setAutoSlideInterval(null)
                }
              }}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 shadow-lg z-20 animate-in slide-in-from-top-2 duration-700 ease-out hover:scale-110 transition-transform"
            >
              <X className="w-6 h-6 text-white" />
            </Button>

            {/* Bouton coeur */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 shadow-lg z-20 animate-in slide-in-from-top-2 duration-700 delay-100 ease-out hover:scale-110 transition-transform"
            >
              <Heart className="w-6 h-6 text-white" />
            </Button>
          </div>

          {/* Drawer détails */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-8 shadow-2xl max-h-[50vh] overflow-y-auto animate-in slide-in-from-bottom duration-700 delay-300 ease-out">
            {/* Miniatures (placeholder pour futures images multiples) */}
            <div className="flex gap-2 mb-6 justify-center">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 ${
                    i === 2 ? 'border-gray-900 dark:border-white' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {selectedProduct.image_url ? (
                    <img
                      src={selectedProduct.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Détails produit */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedProduct.nom}
              </h2>
              
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                  {selectedProduct.prix} {catalogue?.vendeur.devise}
                </span>
              </div>

              {selectedProduct.description && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedProduct.description}
                </p>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-6">
                <Button 
                  onClick={() => window.open(generateWhatsAppMessage(selectedProduct), '_blank')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Commander sur WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">Boutique créée avec ❤️ sur ShopShap</p>
            <p className="text-sm">Créez votre boutique en ligne gratuitement</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
