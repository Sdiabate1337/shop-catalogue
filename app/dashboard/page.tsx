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
import { ShoppingBag, Plus, X, Check, Trash2, ExternalLink, Smartphone, Package, Sparkles, TrendingUp, BadgeCheck, AlertCircle, Edit, Eye, EyeOff } from "@/components/icons";
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
  visible: boolean
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
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null)
  const [editForm, setEditForm] = useState<{ nom: string; description: string; prix: string; imageFile: File | null; imagePreview: string }>({
    nom: '',
    description: '',
    prix: '',
    imageFile: null,
    imagePreview: ''
  })
  const [editUploading, setEditUploading] = useState(false)
  const [editUploadProgress, setEditUploadProgress] = useState(0)
  const [productToDelete, setProductToDelete] = useState<Produit | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [newProduct, setNewProduct] = useState<{
    nom: string
    description: string
    prix: string
    imageFile: File | null
    imagePreview: string
  }>({
    nom: '',
    description: '',
    prix: '',
    imageFile: null,
    imagePreview: ''
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
          'Accept': 'application/json'
        }
      })

      // Lire la réponse en texte pour éviter les erreurs JSON.parse sur body vide
      const raw = await response.text()
      let data: any = null
      if (raw && raw.trim().length > 0) {
        try {
          data = JSON.parse(raw)
        } catch (e) {
          console.error('💥 Réponse non JSON:', raw)
          throw new Error('Réponse serveur invalide (non JSON)')
        }
      } else {
        console.error('💥 Réponse vide du serveur')
        throw new Error('Réponse vide du serveur')
      }

      console.log('📋 Réponse API dashboard:', data)

      if (!response.ok) {
        if (data && data.needsOnboarding) {
          console.log('❌ Profil vendeur manquant - redirection onboarding')
          router.push('/onboarding')
          return
        }
        throw new Error((data && data.error) || 'Erreur lors du chargement')
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
      // S'assurer que le bucket 'products' existe (appel serveur avec service role)
      const initRes = await fetch('/api/init-storage', { method: 'POST' })
      if (!initRes.ok) {
        const msg = await initRes.text()
        throw new Error(`Initialisation du stockage échouée: ${msg || initRes.status}`)
      }

      // Uploader l'image si présente
      let imageUrl: string | null = null
      if (newProduct.imageFile) {
        const file = newProduct.imageFile
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
        const filePath = `${catalogue.id}/${Date.now()}.${ext}`

        // Récupérer le token utilisateur pour uploader via XHR avec suivi de progression
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Session manquante pour l’upload')

        const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/products/${filePath}`

        setUploading(true)
        setUploadProgress(0)

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', uploadUrl)
          xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
          xhr.setRequestHeader('x-upsert', 'false')
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100)
              setUploadProgress(percent)
            }
          }
          xhr.onerror = () => reject(new Error('Erreur réseau pendant l’upload'))
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve()
            } else {
              reject(new Error(`Upload échoué (${xhr.status})`))
            }
          }
          xhr.send(file)
        })

        // Comme le bucket est public, on peut fabriquer l’URL publique directe
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${filePath}`

        // Vérifier l'accessibilité publique de l'image (HEAD)
        try {
          const headRes = await fetch(imageUrl, { method: 'HEAD' })
          if (!headRes.ok) {
            console.warn('⚠️ Image non accessible publiquement', { status: headRes.status, imageUrl })
            throw new Error(`Image non accessible (status ${headRes.status}). Vérifiez que le bucket est public et que les policies SELECT existent.`)
          }
        } catch (e) {
          console.error('HEAD check failed for image URL', imageUrl, e)
          throw e
        }
      }

      const insertResponse = await supabase
        .from('produits')
        .insert({
          catalogue_id: catalogue.id,
          nom: newProduct.nom,
          description: newProduct.description,
          prix: parseFloat(newProduct.prix),
          image_url: imageUrl
        })

      if ('error' in insertResponse && insertResponse.error) throw insertResponse.error

      setNewProduct({ nom: '', description: '', prix: '', imageFile: null, imagePreview: '' })
      setUploadProgress(0)
      setUploading(false)
      setShowAddProduct(false)
      loadUserData()
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
      alert('Erreur lors de l\'ajout du produit')
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (produit: Produit) => {
    setProductToDelete(produit)
  }

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return
    
    setDeleting(true)
    try {
      // Supprimer l'image du storage si elle existe
      if (productToDelete.image_url && productToDelete.image_url.includes('/storage/v1/object/public/products/')) {
        const imagePath = productToDelete.image_url.split('/storage/v1/object/public/products/')[1]
        if (imagePath) {
          const { error: storageError } = await supabase.storage
            .from('products')
            .remove([imagePath])
          
          if (storageError) {
            console.warn('Erreur suppression image:', storageError)
          }
        }
      }

      // Supprimer le produit de la base de données
      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('id', productToDelete.id)

      if (error) throw error

      toast({
        title: "✅ Produit supprimé",
        description: `"${productToDelete.nom}" a été supprimé avec succès.`,
        variant: "default"
      })

      setProductToDelete(null)
      loadUserData()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast({
        title: "❌ Erreur",
        description: "Impossible de supprimer le produit. Réessayez.",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
    }
  }

  // Edition de produit
  const openEditProduct = (p: Produit) => {
    setEditingProduct(p)
    setEditForm({
      nom: p.nom,
      description: p.description || '',
      prix: String(p.prix ?? ''),
      imageFile: null,
      imagePreview: p.image_url || ''
    })
  }

  const handleToggleVisibility = async (productId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('produits')
        .update({ visible: !currentVisibility })
        .eq('id', productId)

      if (error) throw error
      loadUserData()
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error)
      alert('Erreur lors du changement de visibilité')
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !catalogue) return

    try {
      const initRes = await fetch('/api/init-storage', { method: 'POST' })
      if (!initRes.ok) {
        const msg = await initRes.text()
        throw new Error(`Initialisation du stockage échouée: ${msg || initRes.status}`)
      }

      let imageUrl: string | null = editingProduct.image_url || null
      if (editForm.imageFile) {
        const file = editForm.imageFile
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
        const filePath = `${catalogue.id}/${editingProduct.id}-${Date.now()}.${ext}`
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Session manquante pour l\'upload')
        const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/products/${filePath}`

        setEditUploading(true)
        setEditUploadProgress(0)
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', uploadUrl)
          xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
          xhr.setRequestHeader('x-upsert', 'false')
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) setEditUploadProgress(Math.round((ev.loaded / ev.total) * 100))
          }
          xhr.onerror = () => reject(new Error('Erreur réseau pendant l\'upload'))
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve()
            else reject(new Error(`Upload échoué (${xhr.status})`))
          }
          xhr.send(file)
        })
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${filePath}`
        const headRes = await fetch(imageUrl, { method: 'HEAD' })
        if (!headRes.ok) throw new Error(`Image non accessible (status ${headRes.status})`)
      }

      const { error: updateErr } = await supabase
        .from('produits')
        .update({
          nom: editForm.nom,
          description: editForm.description,
          prix: parseFloat(editForm.prix),
          image_url: imageUrl
        })
        .eq('id', editingProduct.id)
      if (updateErr) throw updateErr

      setEditingProduct(null)
      setEditUploading(false)
      setEditUploadProgress(0)
      loadUserData()
    } catch (err) {
      console.error('Erreur lors de la mise à jour du produit:', err)
      alert('Erreur lors de la mise à jour du produit')
      setEditUploading(false)
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
                    <Label htmlFor="image_file" className="text-sm font-medium text-gray-700 dark:text-gray-300">Image du produit</Label>
                    <Input
                      id="image_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        setNewProduct(prev => ({
                          ...prev,
                          imageFile: file,
                          imagePreview: file ? URL.createObjectURL(file) : ''
                        }))
                      }}
                      className="mt-1 rounded-xl"
                    />
                    {newProduct.imagePreview && (
                      <div className="mt-3 flex items-center gap-4">
                        <img src={newProduct.imagePreview} alt="Prévisualisation" className="h-28 w-28 object-cover rounded-xl border" />
                        {uploading && (
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-gray-600 dark:text-gray-300">Upload en cours</span>
                              <span className="text-xs font-medium text-gray-900 dark:text-white">{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-2 bg-blue-600 dark:bg-blue-500 transition-all"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="submit" 
                      disabled={uploading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all active:scale-95"
                    >
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {uploading ? `Upload ${uploadProgress}%` : 'Ajouter'}
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
                        onClick={() => handleDeleteProduct(produit)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-red-500 hover:text-red-700 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {/* Bouton d'édition */}
                      <Button
                        onClick={() => openEditProduct(produit)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 text-blue-600 hover:text-blue-800 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {/* Bouton de visibilité */}
                      <Button
                        onClick={() => handleToggleVisibility(produit.id, produit.visible)}
                        variant="ghost"
                        size="sm"
                        className={`absolute top-14 left-3 bg-white/90 dark:bg-gray-800/90 ${produit.visible ? 'text-green-600 hover:text-green-800' : 'text-gray-500 hover:text-gray-700'} hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300`}
                      >
                        {produit.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
          {/* Drawer d'édition de produit mobile-friendly */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setEditingProduct(null)} />
              <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 flex flex-col" style={{ height: 'min(90vh, 100dvh - env(keyboard-inset-height, 0px))' }}>
                {/* Header avec poignée */}
                <div className="flex flex-col items-center pt-4 pb-2 flex-shrink-0">
                  <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-4"></div>
                  <div className="flex items-center justify-between w-full px-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Modifier le produit</h3>
                    <Button variant="ghost" size="sm" onClick={() => setEditingProduct(null)} className="text-gray-500">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Contenu du formulaire - scrollable */}
                <div className="flex-1 overflow-y-auto px-6">
                  <form onSubmit={handleUpdateProduct} className="space-y-6 pb-4">
                    <div>
                      <Label htmlFor="edit_nom" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom du produit</Label>
                      <Input 
                        id="edit_nom" 
                        value={editForm.nom} 
                        onChange={(e)=>setEditForm(prev=>({...prev, nom: e.target.value}))} 
                        className="mt-2 rounded-xl h-12 text-base" 
                        placeholder="Ex: iPhone 15 Pro"
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                      <Input 
                        id="edit_description" 
                        value={editForm.description} 
                        onChange={(e)=>setEditForm(prev=>({...prev, description: e.target.value}))} 
                        className="mt-2 rounded-xl h-12 text-base" 
                        placeholder="Description du produit"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_prix" className="text-sm font-medium text-gray-700 dark:text-gray-300">Prix ({vendeur?.devise})</Label>
                      <Input 
                        id="edit_prix" 
                        type="number" 
                        step="0.01" 
                        value={editForm.prix} 
                        onChange={(e)=>setEditForm(prev=>({...prev, prix: e.target.value}))} 
                        className="mt-2 rounded-xl h-12 text-base" 
                        placeholder="0.00"
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_image" className="text-sm font-medium text-gray-700 dark:text-gray-300">Image du produit</Label>
                      <Input 
                        id="edit_image" 
                        type="file" 
                        accept="image/*" 
                        className="mt-2 rounded-xl h-12 text-base" 
                        onChange={(e)=>{
                          const file = e.target.files?.[0] || null
                          setEditForm(prev=>({
                            ...prev,
                            imageFile: file,
                            imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview
                          }))
                        }} 
                      />
                      {editForm.imagePreview && (
                        <div className="mt-4">
                          <div className="flex items-center gap-4">
                            <img src={editForm.imagePreview} alt="Prévisualisation" className="h-32 w-32 object-cover rounded-xl border shadow-sm" />
                            {editUploading && (
                              <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">Upload en cours</span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{editUploadProgress}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className="h-3 bg-blue-600 dark:bg-blue-500 transition-all duration-300" style={{ width: `${editUploadProgress}%` }} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                
                {/* Boutons d'action - toujours visibles en bas */}
                <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 pb-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      disabled={editUploading} 
                      onClick={handleUpdateProduct}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold h-12 text-base shadow-lg active:scale-95 transition-transform"
                    >
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {editUploading ? `${editUploadProgress}%` : 'Enregistrer'}
                      </span>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditingProduct(null)} 
                      className="flex-1 rounded-xl font-semibold h-12 text-base shadow-lg border-2 active:scale-95 transition-transform"
                    >
                      <span className="flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Annuler
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de confirmation de suppression */}
          {productToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50" onClick={() => setProductToDelete(null)} />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Supprimer le produit</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cette action est irréversible</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    {productToDelete.image_url ? (
                      <img 
                        src={productToDelete.image_url} 
                        alt={productToDelete.nom}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{productToDelete.nom}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {productToDelete.prix} {vendeur?.devise}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Êtes-vous sûr de vouloir supprimer <strong>"{productToDelete.nom}"</strong> ? 
                  Cette action supprimera définitivement le produit et son image.
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setProductToDelete(null)}
                    variant="outline"
                    className="flex-1 rounded-xl font-medium"
                    disabled={deleting}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={confirmDeleteProduct}
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-medium"
                  >
                    {deleting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Suppression...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
