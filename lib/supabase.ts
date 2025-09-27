// Temporary mock implementation until Supabase is properly installed
export const createClient = () => ({
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithOAuth: (options: any) => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null }),
    exchangeCodeForSession: (code: string) => Promise.resolve({ error: null })
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null })
      }),
      single: () => Promise.resolve({ data: null, error: null })
    }),
    insert: (data: any) => ({
      select: (columns?: string) => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ error: null })
    })
  })
})

export const createServerClient = () => createClient()

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
