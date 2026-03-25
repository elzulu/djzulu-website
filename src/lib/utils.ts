import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWhatsAppUrl(number: string, mensaje?: string) {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

export function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function tipoLabel(tipo: string) {
  const map: Record<string, string> = {
    fiesta: 'Fiesta privada',
    corporativo: 'Corporativo',
    boda: 'Boda',
    'quinceañera': 'Quinceañera',
    festival: 'Festival',
    club: 'Club privado',
    otro: 'Evento',
  }
  return map[tipo] ?? 'Evento'
}
