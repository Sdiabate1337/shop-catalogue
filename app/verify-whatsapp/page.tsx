"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Smartphone, Shield, Clock, RefreshCw, AlertTriangle } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

function VerifyWhatsAppContent() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [vendeurId, setVendeurId] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes en secondes
  const [devCode, setDevCode] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const vendeurIdParam = searchParams.get('vendeurId')
    const phoneParam = searchParams.get('phone')
    
    console.log('🔍 Paramètres URL reçus:', { vendeurIdParam, phoneParam })
    
    if (!vendeurIdParam || !phoneParam) {
      console.log('❌ Paramètres manquants, redirection vers onboarding')
      router.push('/onboarding')
      return
    }
    
    setVendeurId(vendeurIdParam)
    setPhoneNumber(phoneParam)
    
    // Envoyer automatiquement le code au chargement
    sendVerificationCode(vendeurIdParam, phoneParam)
  }, [searchParams, router])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const sendVerificationCode = async (vendeurId: string, phone: string) => {
    setSendingCode(true)
    
    try {
      console.log('📱 Envoi du code de vérification...')
      
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phone,
          vendeurId: vendeurId
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }
      
      console.log('✅ Code envoyé avec succès')
      
      // En mode développement, afficher le code
      if (data.devCode) {
        setDevCode(data.devCode)
        console.log('🔑 Code de développement:', data.devCode)
      }
      
      setTimeLeft(600) // Reset timer
      
    } catch (error: any) {
      console.error('💥 Erreur envoi code:', error)
      alert(`Erreur: ${error.message}`)
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!vendeurId || code.length !== 6) return
    
    setLoading(true)
    
    try {
      console.log('🔍 Vérification du code...', { code, vendeurId })
      
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          vendeurId: vendeurId
        })
      })
      
      const data = await response.json()
      console.log('📡 Réponse API verify-code:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Code incorrect')
      }
      
      console.log('✅ Numéro vérifié avec succès')
      router.push('/dashboard')
      
    } catch (error: any) {
      console.error('💥 Erreur vérification:', error)
      alert(`Erreur: ${error.message}`)
      setCode('') // Reset le code en cas d'erreur
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = () => {
    if (vendeurId && phoneNumber) {
      sendVerificationCode(vendeurId, phoneNumber)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-slate-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      {/* Floating Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Verification Form */}
      <div className="max-w-sm mx-auto sm:max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-3xl mx-auto mb-6 shadow-xl w-fit">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Vérifiez votre WhatsApp
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Code envoyé sur WhatsApp au {phoneNumber}
            </span>
          </p>
        </div>
        
        {/* Dev Code Display (Development only) */}
        {devCode && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <strong>Mode développement:</strong> Code = {devCode}
            </p>
          </div>
        )}
        
        {/* Verification Card */}
        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border">
          <CardContent className="p-6">
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Code de vérification (6 chiffres)
                </Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="rounded-2xl h-12 text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* Timer */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Code expire dans {formatTime(timeLeft)}</span>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl text-lg font-semibold shadow-xl" 
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Vérification...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Vérifier le code
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={sendingCode || timeLeft > 540} // Désactivé pendant les 60 premières secondes
                  className="w-full h-10 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 rounded-2xl"
                >
                  {sendingCode ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Envoi...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Renvoyer le code
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Vous n'avez pas reçu le code ? Vérifiez vos messages WhatsApp
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyWhatsApp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-slate-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    }>
      <VerifyWhatsAppContent />
    </Suspense>
  )
}
