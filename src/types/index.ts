export type TipoEvento = 'fiesta' | 'corporativo' | 'boda' | 'quinceañera' | 'festival' | 'club' | 'otro'
export type TipoMedia = 'video' | 'imagen'

export interface Evento {
  id: string
  titulo: string
  descripcion?: string
  lugar?: string
  fecha: string
  tipo: TipoEvento
  portada_url?: string
  created_at: string
  updated_at: string
  publicado: boolean
  orden?: number
  media?: Media[]
}

export interface Media {
  id: string
  evento_id: string
  tipo: TipoMedia
  url: string
  nombre_original?: string
  duracion_seg?: number
  orden: number
  created_at: string
}

export interface Servicio {
  id: string
  nombre: string
  descripcion?: string
  icono: string
  orden: number
  activo: boolean
}

export interface Precio {
  id: string
  nombre: string
  precio: string
  periodo?: string
  destacado: boolean
  features: string[]
  orden: number
  activo: boolean
}

export interface Testimonio {
  id: string
  nombre: string
  evento?: string
  texto: string
  foto_url?: string
  orden: number
}

export interface Config {
  nombre_artistico?: string
  nombre_real?: string
  tagline?: string
  descripcion?: string
  bio?: string
  ciudad?: string
  whatsapp?: string
  youtube_url?: string
  tiktok_url?: string
  instagram_url?: string
  eventos_count?: string
  anos_experiencia?: string
  generos?: string
  logo_url?: string
  foto_perfil_url?: string
  presskit_foto_url?: string
  [key: string]: string | undefined
}
