'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AuthCodeError() {
  const router = useRouter()

  useEffect(() => {
    const handleImplicitFlow = async () => {
      // Vérifier si on a des tokens dans l'URL fragment (flow implicit)
      if (window.location.hash.includes('access_token=')) {
        console.log('🔄 Tokens OAuth détectés - traitement du flow implicit')
        
        try {
          // Supabase détecte automatiquement les tokens dans l'URL
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (session && !error) {
            console.log('✅ Session créée:', session.user.email)
            
            // Vérifier l'état du profil utilisateur par user_id (email)
            const { data: vendeur, error: vendeurError } = await supabase
              .from('vendeurs')
              .select('id')
              .eq('user_id', session.user.id)
              .single()
            
            // Redirection selon l'état
            if (vendeurError?.code === 'PGRST116' || !vendeur) {
              console.log('👤 Nouveau utilisateur → onboarding')
              router.push('/onboarding')
            } else {
              console.log('🏪 Utilisateur avec profil → dashboard')
              router.push('/dashboard')
            }
            return
          }
          
          console.log('❌ Erreur session:', error)
        } catch (error) {
          console.error('💥 Erreur traitement tokens:', error)
        }
      }
    }

    handleImplicitFlow()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg animate-pulse">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Connexion en cours...
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
            Finalisation de votre authentification Google
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full w-32 mx-auto mb-2"></div>
              <div className="h-2 bg-blue-100 dark:bg-blue-900 rounded-full w-24 mx-auto"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vérification de votre session en cours...
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Si cette page ne se ferme pas automatiquement, cliquez sur "Réessayer"
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/auth/signin">
                Réessayer la connexion
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="w-full border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 rounded-xl transition-all duration-200"
            >
              <Link href="/">
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
