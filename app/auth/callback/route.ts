import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Client admin pour vérifications serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    console.log('🔄 OAuth Callback - Code:', !!code)

    if (!code) {
      console.log('❌ Pas de code OAuth')
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    // Échanger le code pour une session
    const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(code)
    
    if (error || !data.user) {
      console.error('❌ Erreur échange code:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    console.log('✅ Session créée pour:', data.user.email)
    
    // Vérifier l'état du profil utilisateur
    const { data: vendeur, error: vendeurError } = await supabaseAdmin
      .from('vendeurs')
      .select('id')
      .eq('user_id', data.user.id)
      .single()
    
    // Décision de redirection basée sur l'état
    if (vendeurError?.code === 'PGRST116' || !vendeur) {
      // Nouveau utilisateur - pas de profil vendeur
      console.log('👤 Nouveau utilisateur → onboarding')
      return NextResponse.redirect(`${origin}/onboarding`)
    }
    
    // Utilisateur avec profil vendeur → dashboard directement
    console.log('🏪 Utilisateur avec profil → dashboard')
    return NextResponse.redirect(`${origin}/dashboard`)

  } catch (error) {
    console.error('💥 Erreur callback:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/auth-code-error`)
  }
}
