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
    const handleTokensInUrl = async () => {
      console.log('🔍 Page d\'erreur chargée, vérification des tokens...')
      console.log('Hash actuel:', window.location.hash)
      
      // Vérifier si on a des tokens dans l'URL fragment
      if (window.location.hash.includes('access_token=')) {
        console.log('🎯 Tokens détectés dans la page d\'erreur - tentative de récupération de session')
        
        try {
          // Attendre un peu pour que Supabase traite les tokens
          console.log('⏳ Attente de 2 secondes pour le traitement des tokens...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Supabase détecte automatiquement les tokens dans l'URL
          const { data: { session }, error } = await supabase.auth.getSession()
          
          console.log('📡 Réponse getSession:', { session: session?.user?.email, error })
          
          if (session && !error) {
            console.log('✅ Session récupérée avec succès:', session.user.email)
            console.log('🔄 Redirection vers dashboard...')
            router.push('/dashboard')
            return
          }
          
          console.log('❌ Impossible de récupérer la session:', error)
          
          // Essayer de forcer la session avec setSession
          console.log('🔄 Tentative de création manuelle de session...')
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            const { data, error: setError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            console.log('📡 Réponse setSession:', { user: data.user?.email, error: setError })
            
            if (data.session && !setError) {
              console.log('✅ Session créée manuellement avec succès')
              router.push('/dashboard')
              return
            }
          }
          
        } catch (error) {
          console.error('💥 Erreur lors de la récupération de session:', error)
        }
      } else {
        console.log('❌ Aucun token détecté dans l\'URL')
      }
    }

    handleTokensInUrl()
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
