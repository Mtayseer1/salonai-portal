'use client'

import Image from 'next/image'

export function CatalogOptionCard({
  label,
  imagePath,
  selected,
  onClick,
  imageClassName = 'aspect-square',
  showText = true,
  className = '',
}: {
  label: string
  description?: string
  imagePath?: string
  selected: boolean
  onClick: () => void
  imageClassName?: string
  showText?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`overflow-hidden rounded-2xl border text-left transition ${className} ${
        selected
          ? 'scale-[1.015] border-fuchsia-300/60 bg-white text-zinc-950 shadow-xl shadow-fuchsia-950/20'
          : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
      }`}
    >
      {imagePath ? (
        <span className={`relative block ${imageClassName} bg-black/25 p-2`}>
          <Image
            src={imagePath}
            alt={label}
            fill
            unoptimized
            loading="lazy"
            sizes="(max-width: 430px) 50vw, 215px"
            className="object-contain p-2"
          />
        </span>
      ) : (
        <span
          className={`grid ${imageClassName} place-items-center bg-black/25 px-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500`}
        >
          None
        </span>
      )}
      {showText && (
        <span className="block p-3">
          <span className="block text-sm font-bold">{label}</span>
        </span>
      )}
    </button>
  )
}

export function CatalogStickyActions({
  onBack,
  onContinue,
  continueDisabled,
  continueLabel = 'Continue',
}: {
  onBack: () => void
  onContinue: () => void
  continueDisabled?: boolean
  continueLabel?: string
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-white/10 bg-[#08080b]/90 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-14 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.1]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled}
          className="h-14 rounded-2xl bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-fuchsia-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}
