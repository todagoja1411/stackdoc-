'use client'

import { useRef, useCallback } from 'react'
import { Camera, Upload, X, ChevronRight, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Props {
  imageBase64: string | null
  onImageChange: (v: string | null) => void
  onNext: () => void
  onBack: () => void
}

export default function SupplementInput({ imageBase64, onImageChange, onNext, onBack }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const base64 = result.split(',')[1]
      onImageChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFileSelect(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="animate-slide-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
          <Camera className="w-4 h-4 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-white">Scan your bottles</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Take a photo of your supplement bottles or labels — AI will read them automatically.
      </p>

      {imageBase64 ? (
        <div className="relative">
          <img
            src={`data:image/jpeg;base64,${imageBase64}`}
            alt="Uploaded supplements"
            className="w-full max-h-80 object-cover rounded-2xl border border-[#1f1f1f]"
          />
          <button
            onClick={() => onImageChange(null)}
            className="absolute top-3 right-3 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="mt-3 flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <p className="text-xs text-gray-500">AI will extract supplement names from this photo</p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#2a2a2a] hover:border-brand-500/40 rounded-2xl p-14 text-center cursor-pointer transition-all hover:bg-brand-500/5 group"
        >
          <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 transition-colors">
            <Upload className="w-7 h-7 text-brand-400" />
          </div>
          <p className="text-base font-semibold text-white mb-1">Drop photo here or tap to upload</p>
          <p className="text-sm text-gray-500 mb-4">Point your camera at your supplement bottles</p>
          <p className="text-xs text-gray-700">JPG or PNG · Max 10MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
      />

      <Button
        fullWidth
        size="lg"
        className="mt-6"
        disabled={!imageBase64}
        onClick={onNext}
      >
        Analyze Photo
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
