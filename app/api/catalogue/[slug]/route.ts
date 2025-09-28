import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin client using service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Récupérer le catalogue avec le vendeur
    const { data: catalogue, error: catalogueError } = await supabaseAdmin
      .from('catalogues')
      .select(`
        *,
        vendeur:vendeurs(*)
      `)
      .eq('slug', slug)
      .single()

    if (catalogueError || !catalogue) {
      return NextResponse.json(
        { error: 'Catalogue non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les produits visibles avec leurs images
    const { data: produits, error: produitsError } = await supabaseAdmin
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
      .eq('visible', true)
      .order('created_at', { ascending: false })

    if (produitsError) {
      console.error('Erreur produits:', produitsError)
      return NextResponse.json(
        { error: 'Erreur lors du chargement des produits' },
        { status: 500 }
      )
    }

    // Trier les images par ordre pour chaque produit
    const produitsWithImages = (produits || []).map(produit => ({
      ...produit,
      images: produit.images?.sort((a: any, b: any) => a.ordre - b.ordre) || []
    }))

    return NextResponse.json({
      catalogue,
      produits: produitsWithImages
    })

  } catch (error: any) {
    console.error('Erreur dans catalogue API:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
