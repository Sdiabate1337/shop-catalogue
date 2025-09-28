import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = createClient()

  try {
    const { data: catalogue } = await supabase
      .from('catalogues')
      .select(`
        *,
        vendeur:vendeurs(nom_boutique)
      `)
      .eq('slug', resolvedParams.slug)
      .single()

    if (!catalogue) {
      return {
        title: 'Boutique non trouvée - ShopShap',
        description: 'Cette boutique n\'existe pas ou n\'est plus disponible.'
      }
    }

    const boutiqueName = (catalogue as any).vendeur.nom_boutique
    const title = `${boutiqueName} - Boutique en ligne`
    const description = `Découvrez les produits de ${boutiqueName} et commandez directement via WhatsApp. Boutique en ligne créée avec ShopShap.`
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/${resolvedParams.slug}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: 'ShopShap',
        type: 'website',
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: `${boutiqueName} - Boutique en ligne`
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.jpg']
      },
      robots: {
        index: true,
        follow: true
      }
    }
  } catch (error) {
    return {
      title: 'Boutique - ShopShap',
      description: 'Boutique en ligne créée avec ShopShap'
    }
  }
}

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
