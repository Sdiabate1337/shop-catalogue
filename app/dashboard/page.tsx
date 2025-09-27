"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Plus, X, Check, Trash2, ExternalLink, Smartphone, Package, Sparkles } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const supabase = createClient();

interface Vendeur {
  id: string
  nom_boutique: string
  devise: string
  whatsapp: string
}

interface Catalogue {
  id: string
  slug: string
}

interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  image_url: string
}

export default function Dashboard() {
  const [vendeur, setVendeur] = useState<Vendeur | null>(null)
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null)
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    nom: '',
    description: '',
    prix: '',
    image_url: ''
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const authResponse = await supabase.auth.getUser()
      if (authResponse.error || !authResponse.data.user) {
        router.push('/auth/signin')
        return
      }

      const currentUser = authResponse.data.user as any
      const userId = currentUser.id

      // Charger les données du vendeur
      const vendeurResponse = await supabase
        .from('vendeurs')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (vendeurResponse.error || !vendeurResponse.data) {
        router.push('/onboarding')
        return
      }

      const vendeurData = vendeurResponse.data as Vendeur
      setVendeur(vendeurData)

      // Charger le catalogue
      const catalogueResponse = await supabase
        .from('catalogues')
        .select('*')
        .eq('vendeur_id', vendeurData.id)
        .single()

      if (!catalogueResponse.error && catalogueResponse.data) {
        const catalogueData = catalogueResponse.data as Catalogue
        setCatalogue(catalogueData)
        
        // Charger les produits
        const produitsResponse = await supabase
          .from('produits')
          .select('*')
          .eq('catalogue_id', catalogueData.id)
          .order('created_at', { ascending: false })

        setProduits((produitsResponse.data as Produit[]) || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catalogue) return

    try {
      const insertResponse = await supabase
        .from('produits')
        .insert({
          catalogue_id: catalogue.id,
          nom: newProduct.nom,
          description: newProduct.description,
          prix: parseFloat(newProduct.prix),
          image_url: newProduct.image_url
        })

      if ('error' in insertResponse && insertResponse.error) throw insertResponse.error

      setNewProduct({ nom: '', description: '', prix: '', image_url: '' })
      setShowAddProduct(false)
      loadUserData()
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
      alert('Erreur lors de l\'ajout du produit')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('id', productId)

      if (error) throw error
      loadUserData()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-3xl mx-auto mb-6 shadow-xl">
            <ShoppingBag className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full w-32 mx-auto animate-pulse"></div>
            <div className="h-2 bg-blue-100 dark:bg-blue-900 rounded-full w-24 mx-auto animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">Chargement de votre boutique...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Mobile-First Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md dark:bg-gray-900/95 shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between max-w-sm mx-auto sm:max-w-none sm:container">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">ShopShap</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              size="sm"
              className="rounded-full text-sm font-semibold transition-all active:scale-95 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 max-w-sm mx-auto sm:max-w-none sm:container">
        {/* Mobile Stats Cards */}
        {vendeur && catalogue && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{produits.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Produits</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{vendeur.devise}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Devise</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Mobile Profile Card */}
        <Card className="mb-8 shadow-xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-gray-800 dark:via-blue-900/10 dark:to-indigo-900/10">
          <CardContent className="p-8">
            {vendeur && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ring-4 ring-blue-100 dark:ring-blue-900/30">
                  <span className="text-3xl font-bold text-white">
                    {vendeur.nom_boutique.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-3">
                  {vendeur.nom_boutique}
                </h2>
                
                {catalogue && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Votre lien de boutique</p>
                    <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-4 rounded-2xl border-2 border-blue-100 dark:border-blue-800 shadow-lg">
                      <p className="font-mono text-base font-semibold text-blue-600 dark:text-blue-400 break-all">
                        shopshap.africa/{catalogue.slug}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-4 text-base text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-700/50 px-4 py-2 rounded-full">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{vendeur.whatsapp}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mobile Products Section */}
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              <span className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Mes produits ({produits.length})
              </span>
            </h3>
            <Button 
              onClick={() => setShowAddProduct(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all active:scale-95 sm:hidden"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              onClick={() => setShowAddProduct(true)}
              className="hidden sm:flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </div>
          {/* Add Product Form - Mobile Optimized */}
          {showAddProduct && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Plus className="w-5 h-5" />
                  Nouveau produit
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAddProduct(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="nom" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom du produit</Label>
                  <Input
                    id="nom"
                    value={newProduct.nom}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, nom: e.target.value }))}
                    className="mt-1 rounded-xl"
                    placeholder="Ex: iPhone 15 Pro"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                  <Input
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 rounded-xl"
                    placeholder="Description courte du produit"
                  />
                </div>
                <div>
                  <Label htmlFor="prix" className="text-sm font-medium text-gray-700 dark:text-gray-300">Prix ({vendeur?.devise})</Label>
                  <Input
                    id="prix"
                    type="number"
                    step="0.01"
                    className="mt-1 rounded-xl"
                    value={newProduct.prix}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, prix: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image_url" className="text-sm font-medium text-gray-700 dark:text-gray-300">URL de l'image</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, image_url: e.target.value }))}
                    className="mt-1 rounded-xl"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Ajouter
                    </span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 rounded-xl font-medium transition-all active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Annuler
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {produits.length === 0 ? (
            <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-blue-900/20 p-12 rounded-3xl shadow-2xl border-2 border-gray-100 dark:border-gray-600 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-700 dark:to-blue-800 p-8 rounded-full shadow-xl">
                  <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Aucun produit</h4>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Ajoutez votre premier produit pour commencer à vendre !
              </p>
              <Button 
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white rounded-2xl font-bold text-lg px-8 py-4 transition-all active:scale-95 shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Ajouter mon premier produit
                </span>
              </Button>
            </div>
          ) : (
            <div className="space-y-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:space-y-0">
              {produits.map((produit) => (
                <div key={produit.id} className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-1">
                  {produit.image_url && (
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden">
                      <img 
                        src={produit.image_url} 
                        alt={produit.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2">
                          {produit.nom}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {produit.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(produit.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {produit.prix} {vendeur?.devise}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
