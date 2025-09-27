"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ 
  children, 
  attribute, 
  defaultTheme, 
  enableSystem, 
  disableTransitionOnChange,
  ...props 
}: ThemeProviderProps) {
  return <div {...props}>{children}</div>
}
