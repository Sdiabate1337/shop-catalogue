import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérification des variables d'environnement
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL manquante dans .env')
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY manquante dans .env')
}

// Création du client Supabase
export const supabase = createSupabaseClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Fonction helper pour créer le client (compatibilité)
export const createClient = () => supabase

export type Database = {
  public: {
    Tables: {
      vendeurs: {
        Row: {
          id: string
          nom_boutique: string
          devise: string
          whatsapp: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          nom_boutique: string
          devise: string
          whatsapp: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          nom_boutique?: string
          devise?: string
          whatsapp?: string
          user_id?: string
          created_at?: string
        }
      }
      catalogues: {
        Row: {
          id: string
          vendeur_id: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          vendeur_id: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          vendeur_id?: string
          slug?: string
          created_at?: string
        }
      }
      produits: {
        Row: {
          id: string
          catalogue_id: string
          nom: string
          description: string
          prix: number
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          catalogue_id: string
          nom: string
          description: string
          prix: number
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          catalogue_id?: string
          nom?: string
          description?: string
          prix?: number
          image_url?: string
          created_at?: string
        }
      }
    }
  }
}
