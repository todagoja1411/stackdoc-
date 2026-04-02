'use client'

import { useState, useRef, useCallback } from 'react'
import { Type, Camera, Upload, X, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Props {
  supplements: string
  onSupplementsChange: (v: string) => void
  imageBase64: string | null
  onImageChange: (v: string | null) => void
  onNext: () => void
}

const PLACEHOLDER = `e.g.
Creatine Monohydrate 5g
Whey Protein 30g
Vitamin D3 2000 IU
Magnesium Glycinate 400mg
Omega-3 2g
Zinc 15mg`

export default function SupplementInput({
  supplements,
  onSupplementsChange,
  imageBase64,
  onImageChange,
  onNext,
}: Props) {
  const [mode, setMode] = useState<'text' | 'photo'>(imageBase64 ? 'photo' : 'text')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canProceed = mode === 'text' ? supplements.trim().length > 3 : imageBase64 !== null

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      // Strip the data URL prefix to get raw base64
      const base64 = result.split(',')[1]
      onImageChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFileSelect(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-white mb-2">Add your supplements</h1>
      <p className="text-gray-400 text-sm mb-6">
        Type each supplement with its dose, or upload a photo of your bottles.
      </p>

      {/* Mode toggle */}
      <div className="flex bg-[#111111] border border-[#1f1f1f] rounded-xl p-1 mb-6">
        <button
          onClick={() => setMode('text')}
          className={[
            'flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-medium transition-all',
            mode === 'text'
              ? 'bg-[#1f1f1f] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300',
          ].join(' ')}
        >
          <Type className="w-4 h-4" />
          Type List
        </button>
        <button
          onClick={() => setMode('photo')}
          className={[
            'flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-medium transition-all',
            mode === 'photo'
              ? 'bg-[#1f1f1f] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300',
          ].join(' ')}
        >
          <Camera className="w-4 h-4" />
          Upload Photo
        </button>
      </div>

      {/* Text mode */}
      {mode === 'text' && (
        <div>
          <textarea
            value={supplements}
            onChange={(e) => onSupplementsChange(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={10}
            className={[
              'w-full bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-3',
              'text-sm text-white placeholder-gray-600 font-mono',
              'resize-none focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20',
              'transition-colors',
            ].join(' ')}
          />
          <p className="text-xs text-gray-600 mt-2">
            Include dosages if known — this improves analysis accuracy.
          </p>
        </div>
      )}

      {/* Photo mode */}
      {mode === 'photo' && (
        <div>
          {imageBase64 ? (
            <div className="relative">
              <img
                src={`data:image/jpeg;base64,${imageBase64}`}
                alt="Uploaded supplements"
                className="w-full max-h-72 object-cover rounded-xl border border-[#1f1f1f]"
              />
              <button
                onClick={() => onImageChange(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Claude will extract supplement names from this image
              </p>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={[
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all',
                dragging
                  ? 'border-brand-500/60 bg-brand-500/5'
                  : 'border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#111111]',
              ].join(' ')}
            >
              <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-300 mb-1">
                Drop your photo here or click to browse
              </p>
              <p className="text-xs text-gray-600">JPG or PNG · Max 10MB</p>
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
        </div>
      )}

      <Button
        fullWidth
        size="lg"
        className="mt-6"
        disabled={!canProceed}
        onClick={onNext}
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
