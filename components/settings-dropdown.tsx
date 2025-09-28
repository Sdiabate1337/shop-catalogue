"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Settings, User, LogOut, Trash2, ChevronDown } from 'lucide-react'

interface SettingsDropdownProps {
  onEditProfile: () => void
  onLogout: () => void
  onDeleteAccount: () => void
}

export function SettingsDropdown({ onEditProfile, onLogout, onDeleteAccount }: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 text-sm font-medium"
      >
        <Settings className="h-4 w-4 mr-2" />
        Paramètres
        <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le menu */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu déroulant */}
          <Card className="absolute right-0 top-full mt-2 w-56 z-20 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-2">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-3"
                  onClick={() => {
                    onEditProfile()
                    setIsOpen(false)
                  }}
                >
                  <User className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Modifier le profil</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Boutique, devise, WhatsApp</p>
                  </div>
                </Button>
                
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-red-50 dark:hover:bg-red-900/20 p-3"
                  onClick={() => {
                    onLogout()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="h-4 w-4 mr-3 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Se déconnecter</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fermer la session</p>
                  </div>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-red-50 dark:hover:bg-red-900/20 p-3"
                  onClick={() => {
                    onDeleteAccount()
                    setIsOpen(false)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-3 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-medium text-red-600 dark:text-red-400">Supprimer le compte</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Action irréversible</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
