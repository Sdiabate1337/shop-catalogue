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
  images?: Array<{
    id: string
    image_url: string
    ordre: number
  }>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produits.map((produit) => (
              <Card key={produit.id} className="group overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl border-0 transition-all duration-300 hover:-translate-y-1">
                {/* Image principale */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  {produit.image_url ? (
                    <img
                      src={produit.image_url}
                      alt={produit.nom}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges et boutons overlay */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium">
                      ✨ Nouveau
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full w-9 h-9 shadow-lg hover:bg-pink-50 dark:hover:bg-pink-950 hover:scale-110 transition-all group/heart"
                    >
                      <Heart className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover/heart:text-pink-500 transition-colors" />
                    </Button>
                  </div>

                  {/* Bouton voir détails */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      onClick={() => setSelectedProduct(produit)}
                      size="icon"
                      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full w-10 h-10 shadow-lg hover:scale-110 transition-all"
                    >
                      <Eye className="w-4 h-4 text-gray-900 dark:text-white" />
                    </Button>
                  </div>
                </div>
                
                {/* Contenu card */}
                <CardContent className="p-5 space-y-4">
                  {/* Header avec titre et étoiles */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {produit.nom}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                    </div>
                  </div>
                  
                  {/* Prix et statut */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                        {produit.prix} {catalogue.vendeur.devise}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        En stock
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {produit.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {produit.description}
                    </p>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => window.open(generateWhatsAppMessage(produit), '_blank')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold h-11 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group/btn"
                    >
                      <MessageCircle className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      Commander
                    </Button>
                    <Button
                      onClick={() => setSelectedProduct(produit)}
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-11 h-11 shadow-lg hover:shadow-xl transition-all active:scale-95 hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Footer info */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Livraison gratuite
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      24-48h
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal produit détaillé */}
      {selectedProduct && (
        <>
          {/* Version Mobile - Fullscreen */}
          <div className="fixed inset-0 z-50 bg-black lg:hidden animate-in fade-in duration-300">
            {(() => {
              const images = selectedProduct.images && selectedProduct.images.length > 0 
                ? selectedProduct.images.map((img: any) => img.image_url)
                : selectedProduct.image_url ? [selectedProduct.image_url] : []
              
              if (images.length === 0) {
                return (
                  <div className="w-full h-full bg-black flex items-center justify-center animate-in zoom-in-95 duration-500">
                    <Package className="h-20 w-20 text-gray-400" />
                  </div>
                )
              }

              const currentImage = images[currentImageIndex] || images[0]
              
              return (
                <div className="relative w-full h-full">
                  {/* Image fullscreen */}
                  <img
                    src={currentImage}
                    alt={selectedProduct.nom}
                    className="w-full h-full object-cover animate-in zoom-in-95 duration-500"
                  />
                  
                  {/* Overlay gradient pour améliorer la lisibilité */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 animate-in fade-in duration-700" />
                  
                  {/* Header avec boutons */}
                  <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 animate-in slide-in-from-top duration-500 delay-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/20 backdrop-blur-md rounded-full w-12 h-12 text-white hover:bg-white/30 transition-all border border-white/20"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                    
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
                      className="bg-white/20 backdrop-blur-md rounded-full w-12 h-12 text-white hover:bg-white/30 transition-all border border-white/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        onClick={prevImage}
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full w-14 h-14 text-white hover:bg-white/30 transition-all border border-white/20 animate-in slide-in-from-left duration-500 delay-300"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        onClick={nextImage}
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full w-14 h-14 text-white hover:bg-white/30 transition-all border border-white/20 animate-in slide-in-from-right duration-500 delay-300"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </>
                  )}
                  
                  {/* Miniatures en bas */}
                  {images.length > 1 && (
                    <div className="absolute bottom-32 left-0 right-0 px-6 animate-in slide-in-from-bottom duration-500 delay-400">
                      <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                              index === currentImageIndex 
                                ? 'border-white shadow-2xl scale-110 ring-2 ring-white/50' 
                                : 'border-white/40 hover:border-white/70 hover:scale-105'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${selectedProduct.nom} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom drawer */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-t-3xl p-6 space-y-4 border-t border-white/20 animate-in slide-in-from-bottom duration-600 delay-500">
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
                    
                    <div className="space-y-3">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        {selectedProduct.nom}
                      </h1>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                          {selectedProduct.prix} {catalogue?.vendeur.devise}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedProduct.description && (
                      <div className="pt-2">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                          {selectedProduct.description}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        onClick={() => window.open(generateWhatsAppMessage(selectedProduct), '_blank')}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl font-semibold h-14 text-lg shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                      >
                        <MessageCircle className="h-5 w-5 mr-3" />
                        Commander sur WhatsApp
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Livraison gratuite
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Paiement sécurisé
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
          
          {/* Version Desktop/Tablet - Modal centré */}
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 hidden lg:flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="flex flex-col lg:flex-row h-full">
              {/* Section Images - Gauche */}
              <div className="lg:w-1/2 relative">
                {(() => {
                  const images = selectedProduct.images && selectedProduct.images.length > 0 
                    ? selectedProduct.images.map((img: any) => img.image_url)
                    : selectedProduct.image_url ? [selectedProduct.image_url] : []
                  
                  if (images.length === 0) {
                    return (
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Package className="h-20 w-20 text-gray-400" />
                      </div>
                    )
                  }

                  const currentImage = images[currentImageIndex] || images[0]
                  
                  return (
                    <div className="space-y-4 p-6">
                      {/* Image principale */}
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                        <img
                          src={currentImage}
                          alt={selectedProduct.nom}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Flèches de navigation - seulement si plusieurs images */}
                        {images.length > 1 && (
                          <>
                            <Button
                              onClick={prevImage}
                              variant="ghost"
                              size="icon"
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full w-10 h-10 shadow-lg hover:scale-110 transition-all duration-200"
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            </Button>

                            <Button
                              onClick={nextImage}
                              variant="ghost"
                              size="icon"
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full w-10 h-10 shadow-lg hover:scale-110 transition-all duration-200"
                            >
                              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Miniatures */}
                      {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {images.map((imageUrl: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => setCurrentImageIndex(i)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                                i === currentImageIndex 
                                  ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <img
                                src={imageUrl}
                                alt={`Image ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Section Détails - Droite */}
              <div className="lg:w-1/2 p-8 flex flex-col bg-gradient-to-br from-gray-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-800/80 backdrop-blur-sm">
                {/* Header avec bouton fermer */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-3">
                      ✨ Nouveau
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                      {selectedProduct.nom}
                    </h1>
                  </div>
                  
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
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Prix et évaluation */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                      {selectedProduct.prix} {catalogue?.vendeur.devise}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                      <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      En stock
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Livraison 24-48h
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Description
                    </h3>
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions principales */}
                <div className="mt-auto space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-14 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-pink-300 hover:bg-pink-50 dark:hover:border-pink-600 dark:hover:bg-pink-950/30 transition-all group"
                    >
                      <Heart className="w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors" />
                    </Button>
                    
                    <Button 
                      onClick={() => window.open(generateWhatsAppMessage(selectedProduct), '_blank')}
                      className="col-span-3 h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group"
                    >
                      <MessageCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                      Commander sur WhatsApp
                    </Button>
                  </div>
                  
                  {/* Garanties et informations */}
                  <div className="space-y-4 pt-6">
                    {/* Badges de confiance */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 border border-green-200/50 dark:border-green-800/50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-green-800 dark:text-green-300">Livraison</div>
                            <div className="text-xs text-green-600 dark:text-green-400">Gratuite</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-800/50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Paiement</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">Sécurisé</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Informations supplémentaires */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Satisfait</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">ou remboursé</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Support</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">24h/24</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Expédition</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">rapide</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Message de confiance */}
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Plus de 1000 clients satisfaits • Boutique vérifiée ShopShap
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
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
