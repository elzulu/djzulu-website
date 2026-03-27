'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { UploadCloud, X, FileVideo, FileImage } from 'lucide-react'

interface Evento { id: string; titulo: string; fecha: string }

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  try {
    const testCanvas = document.createElement('canvas')
    if (!testCanvas.getContext || !testCanvas.toBlob) return file
  } catch {
    return file
  }
  return new Promise((resolve) => {
    try {
      const img = new window.Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        try {
          const MAX = 1920
          let { width, height } = img
          if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round(height * MAX / width); width = MAX }
            else { width = Math.round(width * MAX / height); height = MAX }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return resolve(file)
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file)
            const newName = file.name.replace(/\.[^.]+$/, '.webp')
            resolve(new File([blob], newName, { type: 'image/webp' }))
          }, 'image/webp', 0.82)
        } catch {
          resolve(file)
        }
      }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
      img.src = url
    } catch {
      resolve(file)
    }
  })
}

export default function MediaUploader({ eventos }: { eventos: Evento[] }) {
  const supabase = createClient()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [eventoId, setEventoId] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
    setFiles(prev => [...prev, ...dropped])
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    setFiles(prev => [...prev, ...selected])
  }

  function removeFile(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
  }

  async function upload() {
    if (!eventoId) return toast.error('Selecciona un evento primero')
    if (files.length === 0) return toast.error('Agrega al menos un archivo')

    setCompressing(true)
    toast('Comprimiendo imágenes...', { icon: '🔄' })
    const processedFiles = await Promise.all(files.map(compressImage))
    setCompressing(false)
    setUploading(true)

    let ok = 0
    for (let i = 0; i < processedFiles.length; i++) {
      const file = processedFiles[i]
      const ext = file.name.split('.').pop()
      const path = `${eventoId}/${Date.now()}-${i}.${ext}`
      const tipo = file.type.startsWith('video/') ? 'video' : 'imagen'

      const { error: storageErr } = await supabase.storage.from('media').upload(path, file, { upsert: false })
      if (storageErr) { toast.error(`Error subiendo ${file.name}`); continue }

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)

      const { error: dbErr } = await supabase.from('media').insert({
        evento_id: eventoId, tipo, url: publicUrl,
        nombre_original: files[i].name, orden: i,
      })

      if (dbErr) toast.error(`Error guardando ${file.name}`)
      else ok++

      setProgress(Math.round(((i + 1) / processedFiles.length) * 100))
    }

    toast.success(`${ok} archivo${ok !== 1 ? 's' : ''} subido${ok !== 1 ? 's' : ''} ✓`)
    setFiles([])
    setProgress(0)
    setUploading(false)
    router.refresh()
  }

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 6, padding: '11px 14px', color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer' }
  const isBusy = uploading || compressing

  return (
    <div style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 12, padding: 28 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, marginBottom: 4, color: 'rgba(255,255,255,0.7)' }}>SUBIR ARCHIVOS</h2>
      <p style={{ fontSize: 11, color: 'rgba(0,180,255,0.5)', marginBottom: 20, letterSpacing: 0.5 }}>Las fotos se comprimen automáticamente a WebP antes de subir</p>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>EVENTO</label>
        <select style={inputStyle} value={eventoId} onChange={e => setEventoId(e.target.value)}>
          <option value="">— Selecciona un evento —</option>
          {eventos.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.titulo} ({ev.fecha})</option>
          ))}
        </select>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#00b4ff' : 'rgba(0,180,255,0.2)'}`,
          borderRadius: 10, padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(0,180,255,0.05)' : 'transparent',
          transition: 'all 0.2s', marginBottom: files.length > 0 ? 16 : 0,
        }}>
        <UploadCloud size={32} color={dragging ? '#00b4ff' : 'rgba(255,255,255,0.2)'} style={{ margin: '0 auto 12px' }} />
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Arrastra fotos y videos aquí</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>o haz clic para seleccionar desde tu PC</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', marginTop: 8 }}>MP4, MOV, JPG, PNG, WEBP</p>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={onFileChange} style={{ display: 'none' }} />
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 10 }}>
            {files.length} ARCHIVO{files.length !== 1 ? 'S' : ''} SELECCIONADO{files.length !== 1 ? 'S' : ''}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
            {files.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                {f.type.startsWith('video/') ? <FileVideo size={16} color="#b44fff" /> : <FileImage size={16} color="#00b4ff" />}
                <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2 }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isBusy && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
            <span>{compressing ? '🔄 Comprimiendo imágenes...' : `⬆️ Subiendo...`}</span>
            <span>{uploading ? `${progress}%` : ''}</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', width: compressing ? '100%' : `${progress}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      )}

      <button onClick={upload} disabled={isBusy || files.length === 0 || !eventoId}
        style={{ width: '100%', padding: 13, borderRadius: 6, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 2, cursor: isBusy || files.length === 0 || !eventoId ? 'not-allowed' : 'pointer', opacity: isBusy || files.length === 0 || !eventoId ? 0.5 : 1, fontFamily: 'Rajdhani, sans-serif' }}>
        {compressing ? 'COMPRIMIENDO...' : uploading ? `SUBIENDO ${progress}%...` : `SUBIR ${files.length > 0 ? files.length + ' ARCHIVO' + (files.length !== 1 ? 'S' : '') : 'ARCHIVOS'}`}
      </button>
    </div>
  )
}
