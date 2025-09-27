import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin, hash } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    console.log('🔄 Callback reçu')
    console.log('Code:', code ? '✅' : '❌')
    console.log('Hash:', hash || 'Aucun')
    console.log('URL complète:', request.url)

    // Vérifier si on a des tokens dans l'URL (mode implicit flow)
    if (request.url.includes('access_token=')) {
      console.log('🎯 Tokens détectés dans l\'URL - redirection vers signin pour traitement')
      // Rediriger vers signin avec les tokens pour que le client les traite et décide de la redirection
      const urlWithTokens = request.url.replace('/auth/callback', '/auth/signin')
      return NextResponse.redirect(urlWithTokens)
    }

    if (code) {
      console.log('🔑 Échange du code pour une session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Erreur lors de l\'échange:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      console.log('✅ Session créée avec succès:', data.user?.email)
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.log('❌ Ni code ni tokens trouvés')
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    
  } catch (error) {
    console.error('💥 Erreur dans le callback:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/auth-code-error`)
  }
}
