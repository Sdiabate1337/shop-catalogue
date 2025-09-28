'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthHandler() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Erreur session:', error)
          router.push('/auth/signin')
          return
        }

        if (!session) {
          console.log('❌ Aucune session - redirection signin')
          router.push('/auth/signin')
          return
        }

        console.log('✅ Session valide:', session.user.email)
        
        // Nettoyer l'URL des tokens OAuth
        if (window.location.hash.includes('access_token=')) {
          window.history.replaceState({}, document.title, '/dashboard')
        }
        
      } catch (error) {
        console.error('💥 Erreur AuthHandler:', error)
        router.push('/auth/signin')
      }
    }

    checkAuth()
  }, [router])

  return null
}
