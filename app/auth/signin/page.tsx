"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignIn() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Vérifier si on a des tokens dans l'URL (retour de Google OAuth)
    if (window.location.hash.includes('access_token=')) {
      console.log('🎯 Tokens détectés dans l\'URL de signin - traitement automatique')
      handleAuthCallback()
    }
  }, [])

  const handleAuthCallback = async () => {
    try {
      console.log('🔍 Traitement des tokens OAuth...')
      
      // Attendre que Supabase traite les tokens
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Erreur lors de la récupération de session:', error)
        return
      }

      if (session) {
        console.log('✅ Session créée:', session.user.email)
        
        // Vérifier si l'utilisateur existe dans la base
        const { data: vendeur, error: vendeurError } = await supabase
          .from('vendeurs')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
        
        if (vendeurError || !vendeur) {
          console.log('👤 Nouvel utilisateur - redirection vers onboarding')
          window.location.href = '/onboarding'
        } else {
          console.log('🏪 Utilisateur existant - redirection vers dashboard')
          window.location.href = '/dashboard'
        }
        
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, '/auth/signin')
      }
    } catch (error) {
      console.error('💥 Erreur dans handleAuthCallback:', error)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      console.log('🚀 Début de l\'authentification Google')
      
      // Vérifier la configuration
      console.log('📋 Configuration Supabase:')
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Définie' : '❌ Manquante')
      console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      
      console.log('📡 Réponse Supabase:', { data, error })
      
      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
      if (data?.url) {
        console.log('🔗 Redirection vers:', data.url)
        window.location.href = data.url
      } else {
        throw new Error('URL de redirection manquante')
      }
      
    } catch (error: any) {
      console.error('💥 Erreur:', error)
      setLoading(false)
      
      // Messages d'erreur détaillés
      if (error.message?.includes('Invalid API key')) {
        alert('❌ Clé API Supabase invalide. Vérifiez votre .env')
      } else if (error.message?.includes('Invalid URL')) {
        alert('❌ URL Supabase invalide. Vérifiez votre .env')
      } else {
        alert(`❌ Erreur: ${error.message || 'Problème de connexion'}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">ShopShap</h1>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bienvenue</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            Créez votre boutique professionnelle en quelques clics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300 active:scale-98 border border-blue-500/20"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                Connexion en cours...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </div>
            )}
          </Button>
          
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
