import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Utiliser le service role key pour les opérations serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Fonction pour envoyer un message WhatsApp
async function sendWhatsAppMessage(phoneNumber: string, code: string) {
  // Option 1: Twilio WhatsApp API
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER // Format: whatsapp:+14155238886
  
  if (!accountSid || !authToken || !whatsappNumber) {
    console.log('⚠️ Variables Twilio manquantes - mode développement')
    return
  }
  
  const message = `Votre code de vérification ShopShap : ${code}\n\nCe code expire dans 10 minutes.\n\nNe partagez jamais ce code avec personne.`
  
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: whatsappNumber,
        To: `whatsapp:${phoneNumber}`,
        Body: message,
      }),
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Twilio error: ${error}`)
    }
    
    const result = await response.json()
    console.log('✅ Message WhatsApp envoyé:', result.sid)
    
  } catch (error) {
    console.error('❌ Erreur Twilio WhatsApp:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, vendeurId } = await request.json()
    
    console.log('📱 Envoi code de vérification:', { phoneNumber, vendeurId })
    
    // Générer un code de vérification à 6 chiffres
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  
    console.log('🔑 Code généré:', verificationCode)
  
    // Sauvegarder le code en base
    const { error: updateError } = await supabaseAdmin
      .from('vendeurs')
      .update({
        verification_code: verificationCode,
        verification_expires_at: expiresAt
      })
      .eq('id', vendeurId)
    
    if (updateError) {
      console.error('❌ Erreur sauvegarde code:', updateError)
      throw updateError
    }
    
    // Envoyer le code via WhatsApp
    try {
      await sendWhatsAppMessage(phoneNumber, verificationCode)
      console.log('✅ Code envoyé via WhatsApp')
    } catch (whatsappError) {
      console.error('❌ Erreur envoi WhatsApp:', whatsappError)
      // En cas d'échec WhatsApp, on continue avec le code sauvegardé
      // L'utilisateur pourra voir le code en mode dev
    }
    
    // En développement, on retourne le code (à supprimer en production)
    return NextResponse.json({ 
      success: true, 
      message: 'Code envoyé via WhatsApp',
      // ATTENTION: Supprimer cette ligne en production !
      devCode: verificationCode 
    })
    
  } catch (error: any) {
    console.error('💥 Erreur envoi code:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi du code' },
      { status: 500 }
    )
  }
}
