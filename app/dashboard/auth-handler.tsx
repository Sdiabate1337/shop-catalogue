'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔍 Vérification de la session après callback...')
        
        // Vérifier si on a des tokens dans l'URL fragment
        if (window.location.hash.includes('access_token=')) {
          console.log('🎯 Tokens détectés dans l\'URL du dashboard')
          
          // Attendre un peu pour que Supabase traite les tokens
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        // Supabase détecte automatiquement les tokens dans l'URL
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error)
          router.push('/auth/auth-code-error')
          return
        }

        if (session) {
          console.log('✅ Session active:', session.user.email)
          console.log('👤 Utilisateur connecté:', {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name
          })
          
          // Nettoyer l'URL des tokens pour plus de propreté
          if (window.location.hash.includes('access_token=')) {
            window.history.replaceState({}, document.title, '/dashboard')
          }
        } else {
          console.log('❌ Aucune session trouvée')
          router.push('/auth/signin')
        }
      } catch (error) {
        console.error('💥 Erreur dans AuthHandler:', error)
        router.push('/auth/auth-code-error')
      }
    }

    handleAuthCallback()
  }, [router])

  return null
}
