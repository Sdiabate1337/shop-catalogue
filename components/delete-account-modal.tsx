"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, X, AlertTriangle } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  boutiqueName: string
  loading?: boolean
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm, boutiqueName, loading = false }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const isConfirmValid = confirmText === boutiqueName

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isConfirmValid) {
      onConfirm()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-2xl shadow-lg">
              <Trash2 className="h-6 w-6 text-white" />
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
          <CardTitle className="text-xl font-bold text-red-600 dark:text-red-400">
            Supprimer le compte
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Cette action est irréversible et supprimera définitivement votre boutique
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800 dark:text-red-200 mb-1">Attention !</p>
                <ul className="text-red-700 dark:text-red-300 space-y-1">
                  <li>• Tous vos produits seront supprimés</li>
                  <li>• Votre catalogue sera inaccessible</li>
                  <li>• Cette action ne peut pas être annulée</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="confirmText" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pour confirmer, tapez le nom de votre boutique : <span className="font-bold">{boutiqueName}</span>
              </Label>
              <Input
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="mt-2 rounded-xl"
                placeholder={boutiqueName}
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !isConfirmValid}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Suppression...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Supprimer définitivement
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
