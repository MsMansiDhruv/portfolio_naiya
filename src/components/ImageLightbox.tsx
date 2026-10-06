import { useEffect } from 'react'

type ImageLightboxProps = {
  src: string | null
  alt?: string
  onClose: () => void
}

/**
 * High-performance full-screen image lightbox modal.
 */
export function ImageLightbox({ src, alt = '', onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!src) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Full size image viewer"
    >
      {/* Top right close button */}
      <button
        type="button"
        className="fixed top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-xl font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
        onClick={onClose}
        aria-label="Close full size view"
      >
        ✕
      </button>

      {/* Full-size Image Container */}
      <div
        className="relative max-w-[95vw] max-h-[92vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          decoding="async"
          loading="eager"
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/15 animate-zoom-in"
        />
      </div>
    </div>
  )
}
