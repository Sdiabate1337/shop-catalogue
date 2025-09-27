"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, X } from 'lucide-react'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

export function LogoutModal({ isOpen, onClose, onConfirm, loading = false }: LogoutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-2xl shadow-lg">
              <LogOut className="h-6 w-6 text-white" />
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
            Confirmer la déconnexion
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir vous déconnecter de votre boutique ?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              💡 Vous devrez vous reconnecter avec Google pour accéder à nouveau à votre dashboard.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Déconnexion...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
