"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Sparkles, Store, Globe, Smartphone, TrendingUp, Info } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const supabase = createClient();

const devises = [
  { code: 'XOF', name: 'Franc CFA', countries: 'Sénégal, Côte d’Ivoire, Mali...', flag: 'SN' },
  { code: 'MAD', name: 'Dirham', countries: 'Maroc', flag: 'MA' },
  { code: 'TND', name: 'Dinar', countries: 'Tunisie', flag: 'TN' },
  { code: 'DZD', name: 'Dinar', countries: 'Algérie', flag: 'DZ' },
  { code: 'NGN', name: 'Naira', countries: 'Nigéria', flag: 'NG' },
  { code: 'GHS', name: 'Cedi', countries: 'Ghana', flag: 'GH' },
  { code: 'KES', name: 'Shilling', countries: 'Kenya', flag: 'KE' },
  { code: 'USD', name: 'Dollar US', countries: 'International', flag: 'US' },
  { code: 'EUR', name: 'Euro', countries: 'Europe', flag: 'EU' }
]

export default function Onboarding() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nomBoutique: '',
    devise: 'XOF',
    whatsapp: ''
  })
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (nom: string) => {
    return nom
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('Non authentifié')

      const slug = generateSlug(formData.nomBoutique)

      console.log('🔍 Données utilisateur:', user)
      console.log('📝 Données du formulaire:', formData)
      console.log('🏷️ Slug généré:', slug)

      // Vérifier si l'utilisateur a déjà une boutique (unicité par email pour v1)
      console.log('🔍 Vérification boutique existante...')
      const { data: existingVendeur, error: existingError } = await supabase
        .from('vendeurs')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingVendeur && !existingError) {
        console.log('⚠️ Boutique déjà existante pour cet utilisateur')
        router.push('/dashboard')
        return
      }

      // Créer le vendeur
      console.log('👤 Création du vendeur...')
      const vendeurResponse = await supabase
        .from('vendeurs')
        .insert({
          nom_boutique: formData.nomBoutique,
          devise: formData.devise,
          whatsapp: formData.whatsapp,
          user_id: user.id
        })
        .select()
        .single()

      console.log('📡 Réponse vendeur:', vendeurResponse)

      if (vendeurResponse.error) {
        console.error('❌ Erreur vendeur:', vendeurResponse.error)
        // Si erreur d'unicité, rediriger vers dashboard
        if (vendeurResponse.error.code === '23505') {
          console.log('⚠️ Boutique déjà créée (contrainte unicité)')
          router.push('/dashboard')
          return
        }
        throw vendeurResponse.error
      }

      const vendeur = vendeurResponse.data
      if (!vendeur) throw new Error('Erreur lors de la création du vendeur')

      console.log('✅ Vendeur créé:', vendeur)

      // Créer le catalogue
      console.log('📚 Création du catalogue...')
      const catalogueResponse = await supabase
        .from('catalogues')
        .insert({
          vendeur_id: vendeur.id,
          slug: slug
        })
        .select()
        .single()

      console.log('📡 Réponse catalogue:', catalogueResponse)

      if (catalogueResponse.error) {
        console.error('❌ Erreur catalogue:', catalogueResponse.error)
        throw catalogueResponse.error
      }

      console.log('✅ Catalogue créé:', catalogueResponse.data)

      // Vérifier que le vendeur existe bien avant redirection
      console.log('🔍 Vérification existence vendeur avant redirection...')
      const { data: vendeurCheck, error: vendeurCheckError } = await supabase
        .from('vendeurs')
        .select('*')
        .eq('id', vendeur.id)
        .single()
      
      console.log('📋 Vérification vendeur:', { vendeurCheck, vendeurCheckError })
      
      if (vendeurCheckError || !vendeurCheck) {
        console.error('❌ Vendeur non trouvé après création !', { vendeurId: vendeur.id, vendeurCheckError })
        throw new Error('Erreur de synchronisation base de données')
      }
      
      // Attendre un peu pour s'assurer que la transaction est commitée
      await new Promise(resolve => setTimeout(resolve, 500))

      // Rediriger directement vers le dashboard
      console.log('🚀 Redirection vers dashboard')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Erreur lors de la création:', error)
      console.error('Message d\'erreur:', error?.message)
      console.error('Détails de l\'erreur:', error?.details)
      console.error('Code d\'erreur:', error?.code)
      alert(`Erreur: ${error?.message || 'Une erreur est survenue. Veuillez réessayer.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-slate-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      {/* Floating Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Mobile-First Onboarding */}
      <div className="max-w-sm mx-auto sm:max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-3xl mx-auto mb-6 shadow-xl w-fit">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">Créez votre boutique</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Quelques infos pour lancer votre boutique en ligne
            </span>
          </p>
        </div>
        
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="nomBoutique" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Nom de votre boutique
                </span>
              </Label>
              <Input
                id="nomBoutique"
                placeholder="Ex: Safiatou Boutique"
                value={formData.nomBoutique}
                onChange={(e) => setFormData(prev => ({ ...prev, nomBoutique: e.target.value }))}
                className="rounded-2xl h-12 text-base"
                required
              />
              {formData.nomBoutique && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Votre lien: <span className="font-mono">{typeof window !== 'undefined' ? window.location.host : 'shopshap.africa'}/{generateSlug(formData.nomBoutique)}</span>
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="devise" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Devise de vente
              </Label>
              <select
                id="devise"
                className="flex h-12 w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all"
                value={formData.devise}
                onChange={(e) => setFormData(prev => ({ ...prev, devise: e.target.value }))}
              >
                {devises.map((devise) => (
                  <option key={devise.code} value={devise.code}>
                    {devise.name} ({devise.code}) - {devise.countries}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Numéro WhatsApp
                </span>
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="Ex: +221771234567"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="rounded-2xl h-12 text-base"
                required
              />
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-2xl">
                <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Format international avec indicatif pays (ex: +221 pour Sénégal)
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl text-lg font-semibold transition-all active:scale-98 shadow-xl" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Créer ma boutique
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
