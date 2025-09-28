"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, X, Check, Store, Smartphone, Globe, Info } from 'lucide-react'

const devises = [
  { code: 'XOF', name: 'Franc CFA', countries: 'Sénégal, Côte d\'Ivoire, Mali...', flag: 'SN' },
  { code: 'MAD', name: 'Dirham', countries: 'Maroc', flag: 'MA' },
  { code: 'TND', name: 'Dinar', countries: 'Tunisie', flag: 'TN' },
  { code: 'DZD', name: 'Dinar', countries: 'Algérie', flag: 'DZ' },
  { code: 'NGN', name: 'Naira', countries: 'Nigéria', flag: 'NG' },
  { code: 'GHS', name: 'Cedi', countries: 'Ghana', flag: 'GH' },
  { code: 'KES', name: 'Shilling', countries: 'Kenya', flag: 'KE' },
  { code: 'USD', name: 'Dollar US', countries: 'International', flag: 'US' },
  { code: 'EUR', name: 'Euro', countries: 'Europe', flag: 'EU' }
]

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { nomBoutique: string; devise: string; whatsapp: string }) => void
  initialData: {
    nomBoutique: string
    devise: string
    whatsapp: string
  }
  loading?: boolean
}

export function EditProfileModal({ isOpen, onClose, onSave, initialData, loading = false }: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Modifier le profil
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Mettez à jour les informations de votre boutique
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nomBoutique" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Nom de votre boutique
                </span>
              </Label>
              <Input
                id="nomBoutique"
                value={formData.nomBoutique}
                onChange={(e) => setFormData(prev => ({ ...prev, nomBoutique: e.target.value }))}
                className="rounded-2xl h-12 text-base mt-1"
                placeholder="Ex: Safiatou Boutique"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="devise" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Devise de vente
              </Label>
              <select
                id="devise"
                className="flex h-12 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all mt-1"
                value={formData.devise}
                onChange={(e) => setFormData(prev => ({ ...prev, devise: e.target.value }))}
                disabled={loading}
              >
                {devises.map((devise) => (
                  <option key={devise.code} value={devise.code}>
                    {devise.name} ({devise.code}) - {devise.countries}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Numéro WhatsApp
                </span>
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="rounded-2xl h-12 text-base mt-1"
                placeholder="Ex: +221771234567"
                required
                disabled={loading}
              />
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-2xl mt-2">
                <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Format international avec indicatif pays (ex: +221 pour Sénégal)
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 rounded-2xl h-12 font-medium"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl h-12 font-semibold shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sauvegarde...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Sauvegarder
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
