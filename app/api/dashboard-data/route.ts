import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Utiliser le service role key pour les opérations serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'utilisateur depuis l'en-tête Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Vérifier le token avec Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      console.error('❌ Erreur authentification:', authError)
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    console.log('🔍 Chargement données pour userId:', user.id)

    // Récupérer les données du vendeur
    const { data: vendeur, error: vendeurError } = await supabaseAdmin
      .from('vendeurs')
      .select('*')
      .eq('user_id', user.id)
      .single()

    console.log('📋 Données vendeur:', { vendeur: !!vendeur, error: vendeurError?.code })

    if (vendeurError || !vendeur) {
      return NextResponse.json(
        { error: 'Profil vendeur non trouvé', needsOnboarding: true },
        { status: 404 }
      )
    }

    // Récupérer le catalogue
    const { data: catalogue, error: catalogueError } = await supabaseAdmin
      .from('catalogues')
      .select('*')
      .eq('vendeur_id', vendeur.id)
      .single()

    // Récupérer les produits avec leurs images si catalogue existe
    let produits = []
    if (catalogue && !catalogueError) {
      const { data: produitsData, error: produitsError } = await supabaseAdmin
        .from('produits')
        .select(`
          *,
          images:images_produit(
            id,
            image_url,
            ordre
          )
        `)
        .eq('catalogue_id', catalogue.id)
        .order('created_at', { ascending: false })

      if (!produitsError && produitsData) {
        // Trier les images par ordre pour chaque produit
        produits = produitsData.map(produit => ({
          ...produit,
          images: produit.images?.sort((a: any, b: any) => a.ordre - b.ordre) || []
        }))
      }
    }

    console.log('✅ Données chargées:', { 
      vendeur: !!vendeur, 
      catalogue: !!catalogue, 
      produits: produits.length 
    })

    return NextResponse.json({
      vendeur,
      catalogue,
      produits
    })

  } catch (error: any) {
    console.error('💥 Erreur dans dashboard-data:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
