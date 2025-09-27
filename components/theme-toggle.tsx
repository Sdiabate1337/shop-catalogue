"use client"

import { useTheme } from "@/hooks/use-theme"
import { Sun, Moon, Monitor } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-10 h-10 rounded-xl p-0 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm"
      >
        <Sun className="h-4 w-4 text-amber-500" />
      </Button>
    )
  }

  const cycleTheme = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    const iconClass = `h-4 w-4 transition-all duration-300 ${isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`
    
    switch (theme) {
      case 'light':
        return <Sun className={`${iconClass} text-amber-500 drop-shadow-sm`} />
      case 'dark':
        return <Moon className={`${iconClass} text-indigo-400 drop-shadow-sm`} />
      case 'system':
        return <Monitor className={`${iconClass} text-emerald-500 drop-shadow-sm`} />
      default:
        return <Sun className={iconClass} />
    }
  }

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'Mode clair • Cliquez pour mode sombre'
      case 'dark':
        return 'Mode sombre • Cliquez pour mode système'
      case 'system':
        return 'Mode système • Cliquez pour mode clair'
      default:
        return 'Changer le thème'
    }
  }

  const getButtonStyle = () => {
    switch (theme) {
      case 'light':
        return "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/20"
      case 'dark':
        return "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/50 dark:to-blue-900/50 border-indigo-200 dark:border-indigo-700 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-800/50 dark:hover:to-blue-800/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20"
      case 'system':
        return "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/50 border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/50 dark:hover:to-teal-800/50 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20"
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className={`w-10 h-10 rounded-xl p-0 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${getButtonStyle()}`}
      title={getTooltip()}
    >
      <div className="relative">
        {getIcon()}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
        )}
      </div>
    </Button>
  )
}

export function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center space-x-3 p-1">
        <Sun className="h-5 w-5 text-amber-400" />
        <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100 shadow-inner">
          <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform translate-x-1 border border-amber-200" />
        </div>
        <Moon className="h-5 w-5 text-slate-400" />
      </div>
    )
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const toggleTheme = () => {
    setIsToggling(true)
    setTimeout(() => setIsToggling(false), 400)
    setTheme(isDark ? 'light' : 'dark')
  }

  const getSwitchBackground = () => {
    if (isDark) {
      return "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/25"
    }
    return "bg-gradient-to-r from-amber-200 to-orange-200 shadow-inner"
  }

  const getKnobStyle = () => {
    const baseStyle = "inline-block h-5 w-5 transform rounded-full shadow-lg transition-all duration-300 border"
    
    if (isDark) {
      return `${baseStyle} bg-white border-indigo-200 ${isDark ? 'translate-x-6' : 'translate-x-1'} ${isToggling ? 'scale-110' : 'scale-100'}`
    }
    return `${baseStyle} bg-white border-amber-200 ${isDark ? 'translate-x-6' : 'translate-x-1'} ${isToggling ? 'scale-110' : 'scale-100'}`
  }

  return (
    <div className="flex items-center space-x-3 p-1">
      <Sun className={`h-5 w-5 transition-all duration-300 ${!isDark ? 'text-amber-500 scale-110 drop-shadow-sm' : 'text-slate-400 scale-100'}`} />
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 active:scale-95 ${getSwitchBackground()} ${
          isDark ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'
        }`}
        role="switch"
        aria-checked={isDark}
        aria-label={`Basculer vers le mode ${isDark ? 'clair' : 'sombre'}`}
        title={`Mode ${isDark ? 'sombre' : 'clair'} actif • Cliquez pour changer`}
      >
        <span className={getKnobStyle()}>
          {isToggling && (
            <div className="absolute inset-0 rounded-full bg-current opacity-30 animate-pulse" />
          )}
        </span>
        
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
          isDark ? 'bg-indigo-400 opacity-20' : 'bg-amber-400 opacity-20'
        } ${isToggling ? 'animate-ping' : ''}`} />
      </button>
      <Moon className={`h-5 w-5 transition-all duration-300 ${isDark ? 'text-indigo-400 scale-110 drop-shadow-sm' : 'text-slate-400 scale-100'}`} />
    </div>
  )
}
