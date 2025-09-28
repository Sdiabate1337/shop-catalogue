import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Utiliser le service role key pour les opérations serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { code, vendeurId } = await request.json()
    
    console.log('🔍 Vérification code:', { code, vendeurId })
    
    // Vérifier d'abord si la table vendeurs existe et est accessible
    console.log('🔍 Test de connexion à la table vendeurs...')
    const { data: testQuery, error: testError } = await supabaseAdmin
      .from('vendeurs')
      .select('count')
      .limit(1)
    
    console.log('📊 Test table vendeurs:', { testQuery, testError })
    
    if (testError) {
      console.error('❌ Problème d\'accès à la table vendeurs:', testError)
      return NextResponse.json(
        { error: `Erreur base de données: ${testError.message}` },
        { status: 500 }
      )
    }
    
    // Maintenant chercher le vendeur spécifique
    const { data: vendeurBase, error: baseError } = await supabaseAdmin
      .from('vendeurs')
      .select('*')
      .eq('id', vendeurId)
      .single()
    
    console.log('🔍 Vendeur complet:', { 
      vendeurId,
      vendeurBase, 
      baseError,
      errorCode: baseError?.code,
      errorMessage: baseError?.message,
      errorDetails: baseError?.details 
    })
    
    if (baseError) {
      if (baseError.code === 'PGRST116') {
        console.error('❌ Aucun vendeur trouvé avec cet ID')
        return NextResponse.json(
          { error: `Aucun vendeur trouvé avec l'ID: ${vendeurId}. Vérifiez que l'onboarding s'est bien déroulé.` },
          { status: 404 }
        )
      }
      
      console.error('❌ Erreur lors de la recherche du vendeur:', baseError)
      return NextResponse.json(
        { error: `Erreur base de données: ${baseError.message}` },
        { status: 500 }
      )
    }
    
    if (!vendeurBase) {
      console.error('❌ Vendeur null malgré absence d\'erreur')
      return NextResponse.json(
        { error: `Vendeur introuvable (ID: ${vendeurId})` },
        { status: 404 }
      )
    }
    
    // Vérifier si les colonnes de vérification existent
    if (!('verification_code' in vendeurBase)) {
      console.error('❌ Colonnes de vérification manquantes dans la table vendeurs')
      return NextResponse.json(
        { error: 'Migration de vérification non appliquée. Exécutez les migrations Supabase.' },
        { status: 500 }
      )
    }
    
    const vendeur = vendeurBase
    
    // Vérifier si le code a expiré
    const now = new Date()
    const expiresAt = new Date(vendeur.verification_expires_at)
    
    if (now > expiresAt) {
      console.log('⏰ Code expiré')
      return NextResponse.json(
        { error: 'Le code a expiré. Demandez un nouveau code.' },
        { status: 400 }
      )
    }
    
    // Vérifier le code (avec debug détaillé)
    console.log('🔍 Comparaison codes:', {
      codeRecu: code,
      codeStocke: vendeur.verification_code,
      typeCodeRecu: typeof code,
      typeCodeStocke: typeof vendeur.verification_code,
      longueurCodeRecu: code?.length,
      longueurCodeStocke: vendeur.verification_code?.length
    })
    
    if (vendeur.verification_code !== code) {
      console.log('❌ Code incorrect')
      console.log('📋 Détails comparaison:', {
        match: vendeur.verification_code === code,
        trimMatch: vendeur.verification_code?.trim() === code?.trim(),
        stringMatch: String(vendeur.verification_code) === String(code)
      })
      return NextResponse.json(
        { error: 'Code incorrect' },
        { status: 400 }
      )
    }
    
    // Marquer comme vérifié
    const { error: updateError } = await supabaseAdmin
      .from('vendeurs')
      .update({ 
        whatsapp_verified: true,
        verification_code: null,
        verification_expires_at: null
      })
      .eq('id', vendeurId)
    
    if (updateError) {
      console.error('❌ Erreur mise à jour:', updateError)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }
    
    console.log('✅ Numéro WhatsApp vérifié avec succès')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Numéro WhatsApp vérifié avec succès' 
    })
    
  } catch (error: any) {
    console.error('💥 Erreur vérification code:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}
