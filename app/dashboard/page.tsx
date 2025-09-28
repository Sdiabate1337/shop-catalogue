"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ShoppingBag, Plus, X, Check, Trash2, ExternalLink, Smartphone, Package, Sparkles, TrendingUp, BadgeCheck, AlertCircle } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutModal } from "@/components/logout-modal";
import { SettingsDropdown } from "@/components/settings-dropdown";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { DeleteAccountModal } from "@/components/delete-account-modal";
import AuthHandler from "./auth-handler";

interface Vendeur {
  id: string
  nom_boutique: string
  devise: string
  whatsapp: string
  whatsapp_verified: boolean
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
  const [showLogout, setShowLogout] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [verificationToastShown, setVerificationToastShown] = useState(false)
  const [newProduct, setNewProduct] = useState({
    nom: '',
    description: '',
    prix: '',
    image_url: ''
  })
  const router = useRouter()
  const { toast } = useToast()
  // Le client Supabase est déjà importé depuis lib/supabase.ts

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        router.push('/auth/signin')
        return
      }

      console.log('🔍 Chargement données utilisateur...')
      
      // Utiliser l'API route serveur pour contourner les problèmes RLS
      const response = await fetch('/api/dashboard-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      console.log('📋 Réponse API dashboard:', data)

      if (!response.ok) {
        if (data.needsOnboarding) {
          console.log('❌ Profil vendeur manquant - redirection onboarding')
          router.push('/onboarding')
          return
        }
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      // Mettre à jour les états avec les données reçues
      setVendeur(data.vendeur)
      if (data.catalogue) {
        setCatalogue(data.catalogue)
      }
      if (data.produits) {
        setProduits(data.produits)
      }

      console.log('✅ Données dashboard chargées avec succès')
      
      // Afficher le toast de vérification si le vendeur n'est pas vérifié
      if (data.vendeur && !data.vendeur.whatsapp_verified && !verificationToastShown) {
        showVerificationToast()
        setVerificationToastShown(true)
      }

    } catch (error) {
      console.error('💥 Erreur chargement:', error)
      router.push('/auth/signin')
    } finally {
      setLoading(false)
    }
  }

  const showVerificationToast = () => {
    toast({
      variant: "warning",
      title: "🔔 Vérifiez votre compte",
      description: "Confirmez votre numéro WhatsApp pour débloquer toutes les fonctionnalités.",
      action: (
        <ToastAction 
          altText="Vérifier maintenant"
          onClick={() => router.push('/verify-whatsapp')}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Vérifier ton compte
        </ToastAction>
      ),
    })
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
    setLogoutLoading(true)
    
    try {
      console.log('🚪 Déconnexion en cours...')
      
      // Nettoyer les données locales
      setVendeur(null)
      setCatalogue(null)
      setProduits([])
      
      // Déconnexion Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Erreur lors de la déconnexion:', error)
        throw error
      }
      
      console.log('✅ Déconnexion réussie')
      
      // Fermer la modal et rediriger
      setShowLogout(false)
      window.location.href = '/'
      
    } catch (error: any) {
      console.error('💥 Erreur de déconnexion:', error)
      alert(`Erreur lors de la déconnexion: ${error.message}`)
      setLogoutLoading(false)
    }
  }

  const generateSlug = (nom: string) => {
    return nom
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleUpdateProfile = async (data: { nomBoutique: string; devise: string; whatsapp: string }) => {
    setUpdateLoading(true)
    
    try {
      console.log('🔄 Mise à jour du profil...')
      
      if (!vendeur || !catalogue) throw new Error('Données manquantes')
      
      const newSlug = generateSlug(data.nomBoutique)
      
      // Mettre à jour le vendeur
      const { error: vendeurError } = await supabase
        .from('vendeurs')
        .update({
          nom_boutique: data.nomBoutique,
          devise: data.devise,
          whatsapp: data.whatsapp
        })
        .eq('id', vendeur.id)
      
      if (vendeurError) throw vendeurError
      
      // Mettre à jour le slug du catalogue si le nom a changé
      if (data.nomBoutique !== vendeur.nom_boutique) {
        console.log('🔗 Mise à jour du slug:', newSlug)
        
        const { error: catalogueError } = await supabase
          .from('catalogues')
          .update({ slug: newSlug })
          .eq('id', catalogue.id)
        
        if (catalogueError) throw catalogueError
        
        // Mettre à jour l'état local du catalogue
        setCatalogue(prev => prev ? { ...prev, slug: newSlug } : null)
      }
      
      // Mettre à jour l'état local du vendeur
      setVendeur(prev => prev ? { ...prev, nom_boutique: data.nomBoutique, devise: data.devise, whatsapp: data.whatsapp } : null)
      setShowEditProfile(false)
      
      console.log('✅ Profil et slug mis à jour')
      
    } catch (error: any) {
      console.error('💥 Erreur mise à jour:', error)
      alert(`Erreur lors de la mise à jour: ${error.message}`)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    
    try {
      console.log('🗑️ Suppression complète du compte...')
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('Non authentifié')
      
      console.log('📊 Suppression des données métier...')
      // Supprimer le vendeur (cascade supprimera catalogues et produits)
      const { error: deleteError } = await supabase
        .from('vendeurs')
        .delete()
        .eq('user_id', user.id)
      
      if (deleteError) throw deleteError
      console.log('✅ Données métier supprimées')
      
      console.log('🔐 Tentative de suppression du compte Auth...')
      // Note: supabase.auth.admin.deleteUser nécessite des privilèges admin côté serveur
      // Pour l'instant, on se contente de supprimer les données métier
      console.log('⚠️ Suppression Auth admin non disponible côté client')
      console.log('📝 Seules les données métier sont supprimées')
      
      // Déconnexion locale (nettoie la session côté client)
      await supabase.auth.signOut()
      
      console.log('✅ Suppression complète terminée')
      window.location.href = '/'
      
    } catch (error: any) {
      console.error('💥 Erreur suppression:', error)
      alert(`Erreur lors de la suppression: ${error.message}`)
      setDeleteLoading(false)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-orange-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-950 dark:to-orange-950">
      <AuthHandler />
      
      {/* Header cohérent avec la page d'accueil */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">ShopShap</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ThemeToggle />
            </div>
            <SettingsDropdown
              onEditProfile={() => setShowEditProfile(true)}
              onLogout={() => setShowLogout(true)}
              onDeleteAccount={() => setShowDeleteAccount(true)}
            />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">

          {/* Stats Cards - Design moderne et clean */}
          {vendeur && catalogue && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Produits</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{produits.length}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Devise</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{vendeur.devise}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 w-12 h-12 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Boutique</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">{vendeur.nom_boutique}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 w-12 h-12 rounded-xl flex items-center justify-center ml-3">
                      <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">WhatsApp</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">{vendeur.whatsapp}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 w-12 h-12 rounded-xl flex items-center justify-center ml-3">
                      <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        
          {/* Carte de profil améliorée */}
          {vendeur && catalogue && (
            <Card className="mb-8 shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden rounded-xl">
              <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 h-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-orange-500/10"></div>
                <div className="absolute -bottom-8 left-6">
                  <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                      {vendeur.nom_boutique.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-12 pb-6 px-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {vendeur.nom_boutique}
                    </h2>
                    <Badge
                      variant={vendeur.whatsapp_verified ? "secondary" : "destructive"}
                      className={vendeur.whatsapp_verified ? "bg-green-500 text-white dark:bg-green-600" : "bg-red-500 text-white dark:bg-red-600"}
                    >
                      {vendeur.whatsapp_verified ? (
                        <><BadgeCheck className="h-3 w-3 mr-1" />Vérifiée</>
                      ) : (
                        <><AlertCircle className="h-3 w-3 mr-1" />Non vérifiée</>
                      )}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Votre boutique en ligne</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Lien de votre boutique</p>
                      <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                        shopshap.africa/{catalogue.slug}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => window.open(`https://shopshap.africa/${catalogue.slug}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Produits */}
          <div className="space-y-6">
            {/* En-tête de section */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Mes produits
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {produits.length} produit{produits.length !== 1 ? 's' : ''} dans votre catalogue
                </p>
              </div>
              <Button 
                onClick={() => setShowAddProduct(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouveau produit
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
              <Card className="text-center py-16 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/30 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Votre catalogue est vide</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                    Ajoutez votre premier produit pour commencer à vendre en ligne et partager votre catalogue.
                  </p>
                  <Button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Ajouter mon premier produit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {produits.map((produit) => (
                  <Card key={produit.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                    <div className="relative">
                      {/* Image du produit */}
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 flex items-center justify-center relative overflow-hidden">
                        {produit.image_url ? (
                          <img 
                            src={produit.image_url} 
                            alt={produit.nom}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <Package className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Bouton de suppression */}
                      <Button
                        onClick={() => handleDeleteProduct(produit.id)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-red-500 hover:text-red-700 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-6">
                      <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {produit.nom}
                      </h4>
                      
                      {produit.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                          {produit.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                          {produit.prix} {vendeur?.devise}
                        </span>
                        <div className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/50 dark:to-orange-950/50 px-3 py-1 rounded-full">
                          <Sparkles className="w-4 h-4 text-orange-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleSignOut}
        loading={logoutLoading}
      />
      
      {vendeur && (
        <>
          <EditProfileModal
            isOpen={showEditProfile}
            onClose={() => setShowEditProfile(false)}
            onSave={handleUpdateProfile}
            initialData={{
              nomBoutique: vendeur.nom_boutique,
              devise: vendeur.devise,
              whatsapp: vendeur.whatsapp
            }}
            loading={updateLoading}
          />
          
          <DeleteAccountModal
            isOpen={showDeleteAccount}
            onClose={() => setShowDeleteAccount(false)}
            onConfirm={handleDeleteAccount}
            boutiqueName={vendeur.nom_boutique}
            loading={deleteLoading}
          />
        </>
      )}
    </div>
  )
}
