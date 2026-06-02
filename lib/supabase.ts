import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Producto = {
  id: number
  nombre: string
  descripcion: string | null
  marca_id: number | null
  categoria_id: number | null
  precio: number
  precio_oferta: number | null
  tamano: string | null
  imagen_url: string | null
  badge: string | null
  activo: boolean
  destacado: boolean
  mas_vendido: boolean
  agotado: boolean
  created_at: string
  marcas?: { nombre: string }
  categorias?: { nombre: string }
}

export type Categoria = {
  id: number
  nombre: string
  slug: string
}

export type Marca = {
  id: number
  nombre: string
  slug: string
}
