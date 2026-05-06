'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { CatalogOptionCard, useStyleSession, useWomenCatalog } from '@/components/style-session'
import {
  LIP_COLORS,
  LIP_FINISHES,
  LIP_STYLES,
} from '@/lib/style-session/lips-catalog'
import {
  EYE_LASHES,
  EYE_LINERS,
  EYE_SHADOWS,
} from '@/lib/style-session/eyes-options'
import { BROW_OPTIONS } from '@/lib/style-session/brow-options'
import { SKIN_OPTIONS } from '@/lib/style-session/skin-options'
import {
  BLUSH_COLORS,
  BLUSH_INTENSITIES,
  BLUSH_STYLES,
} from '@/lib/style-session/blush-options'
import {
  BRONZER_TONES,
  CONTOUR_INTENSITIES,
  CONTOUR_TYPES,
} from '@/lib/style-session/contour-options'
import {
  HIGHLIGHT_FINISHES,
  HIGHLIGHT_INTENSITIES,
  HIGHLIGHT_PLACEMENTS,
  HIGHLIGHT_TONES,
} from '@/lib/style-session/highlight-options'
import { getWomenCatalogColors } from '@/lib/style-session/women-catalog'

type ReviewOption = {
  id: string
  label: string
  description?: string
  imagePath?: string
}

const INITIAL_LIMIT = 12

export default function WomenCatalogReviewPage() {
  const router = useRouter()
  const session = useStyleSession()
  const catalog = useWomenCatalog()
  const [message, setMessage] = useState('')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const colors = useMemo(
    () =>
      getWomenCatalogColors(catalog, session.hairStyleId, session.haircutId).map(
        (option) => ({
          id: option.id,
          label: option.label,
          imagePath: option.imagePath,
        }),
      ),
    [catalog, session.hairStyleId, session.haircutId],
  )

  const generateCatalogStyle = () => {
    if (!session.imageFile) {
      setMessage('Upload the client image again before generating.')
      return
    }

    setMessage('')
    session.setGenerationError(undefined)
    session.setMode('catalog')
    router.push('/style/loading')
  }

  const toggleExpanded = (section: string) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }))
  }

  return (
    <div className="space-y-6 pb-28">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Review
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Choose the look
              </h2>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2"
              onClick={() => router.push('/style/photo')}
            >
              Photo
            </Button>
          </div>

          {session.imagePreviewUrl ? (
            <div className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <Image
                src={session.imagePreviewUrl}
                alt="Selected client preview"
                fill
                unoptimized
                priority
                className="object-contain"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/style/photo')}
              className="w-full rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-500"
            >
              Upload a photo to start
            </button>
          )}
        </div>
      </Card>

      {message && <Alert>{message}</Alert>}

      <SelectionSection
        id="hair-style"
        title="Hair Style"
        subtitle="Optional. Pick a hairstyle if the client wants hair changed."
        options={catalog.styles.map((option) => ({
          id: option.id,
          label: option.label,
          imagePath: option.imagePath,
        }))}
        selectedId={`${session.haircutId || ''}__${session.hairStyleId || ''}`}
        expanded={Boolean(expandedSections['hair-style'])}
        onToggleExpanded={() => toggleExpanded('hair-style')}
        onSelect={(id) => {
          const selected = catalog.styles.find((option) => option.id === id)
          session.setWomenOptions({
            haircutId: selected?.haircutId,
            hairStyleId: selected?.hairStyleId,
            hairColorId: undefined,
          })
        }}
      />

      <SelectionSection
        id="hair-color"
        title="Hair Color"
        subtitle={
          session.hairStyleId
            ? 'Optional. Colors are based on the selected hairstyle.'
            : 'Choose a hairstyle first if the client wants hair color.'
        }
        options={colors}
        selectedId={`${session.haircutId || ''}__${session.hairStyleId || ''}__${session.hairColorId || ''}`}
        expanded={Boolean(expandedSections['hair-color'])}
        onToggleExpanded={() => toggleExpanded('hair-color')}
        onSelect={(id) => {
          const selected = catalog.colors.find((option) => option.id === id)
          session.setWomenOptions({
            haircutId: selected?.haircutId,
            hairStyleId: selected?.hairStyleId,
            hairColorId: selected?.hairColorId,
          })
        }}
      />

      <SelectionSection
        id="lip-finish"
        title="Lip Finish"
        options={toOptions(LIP_FINISHES)}
        selectedId={session.lipFinish}
        expanded={Boolean(expandedSections['lip-finish'])}
        onToggleExpanded={() => toggleExpanded('lip-finish')}
        onSelect={(lipFinish) => session.setWomenOptions({ lipFinish })}
      />
      <SelectionSection
        id="lip-style"
        title="Lip Style"
        options={toOptions(LIP_STYLES)}
        selectedId={session.lipStyle}
        expanded={Boolean(expandedSections['lip-style'])}
        onToggleExpanded={() => toggleExpanded('lip-style')}
        onSelect={(lipStyle) => session.setWomenOptions({ lipStyle })}
      />
      <SelectionSection
        id="lip-color"
        title="Lip Color"
        options={toOptions(LIP_COLORS)}
        selectedId={session.lipColor}
        expanded={Boolean(expandedSections['lip-color'])}
        onToggleExpanded={() => toggleExpanded('lip-color')}
        onSelect={(lipColor) => session.setWomenOptions({ lipColor })}
      />

      <SelectionSection
        id="eye-shadow"
        title="Eye Shadow"
        options={toOptions(EYE_SHADOWS)}
        selectedId={session.eyeShadow}
        expanded={Boolean(expandedSections['eye-shadow'])}
        onToggleExpanded={() => toggleExpanded('eye-shadow')}
        onSelect={(eyeShadow) => session.setWomenOptions({ eyeShadow })}
      />
      <SelectionSection
        id="eye-liner"
        title="Eye Liner"
        options={toOptions(EYE_LINERS)}
        selectedId={session.eyeLiner}
        expanded={Boolean(expandedSections['eye-liner'])}
        onToggleExpanded={() => toggleExpanded('eye-liner')}
        onSelect={(eyeLiner) => session.setWomenOptions({ eyeLiner })}
      />
      <SelectionSection
        id="eye-lashes"
        title="Lashes"
        options={toOptions(EYE_LASHES)}
        selectedId={session.eyeLashes}
        expanded={Boolean(expandedSections['eye-lashes'])}
        onToggleExpanded={() => toggleExpanded('eye-lashes')}
        onSelect={(eyeLashes) => session.setWomenOptions({ eyeLashes })}
      />

      <SelectionSection
        id="brows"
        title="Brows"
        options={toOptions(BROW_OPTIONS)}
        selectedId={session.browStyle}
        expanded={Boolean(expandedSections.brows)}
        onToggleExpanded={() => toggleExpanded('brows')}
        onSelect={(browStyle) => session.setWomenOptions({ browStyle })}
      />
      <SelectionSection
        id="skin"
        title="Skin Base"
        options={toOptions(SKIN_OPTIONS)}
        selectedId={session.skinType}
        expanded={Boolean(expandedSections.skin)}
        onToggleExpanded={() => toggleExpanded('skin')}
        onSelect={(skinType) => session.setWomenOptions({ skinType })}
      />

      <SelectionSection
        id="blush-color"
        title="Blush Color"
        options={toOptions(BLUSH_COLORS)}
        selectedId={session.blushColor}
        expanded={Boolean(expandedSections['blush-color'])}
        onToggleExpanded={() => toggleExpanded('blush-color')}
        onSelect={(blushColor) => session.setWomenOptions({ blushColor })}
      />
      <SelectionSection
        id="blush-style"
        title="Blush Style"
        options={toOptions(BLUSH_STYLES)}
        selectedId={session.blushStyle}
        expanded={Boolean(expandedSections['blush-style'])}
        onToggleExpanded={() => toggleExpanded('blush-style')}
        onSelect={(blushStyle) => session.setWomenOptions({ blushStyle })}
      />
      <SelectionSection
        id="blush-intensity"
        title="Blush Intensity"
        options={toOptions(BLUSH_INTENSITIES)}
        selectedId={session.blushIntensity}
        expanded={Boolean(expandedSections['blush-intensity'])}
        onToggleExpanded={() => toggleExpanded('blush-intensity')}
        onSelect={(blushIntensity) => session.setWomenOptions({ blushIntensity })}
      />

      <SelectionSection
        id="contour-type"
        title="Contour"
        options={toOptions(CONTOUR_TYPES)}
        selectedId={session.contourType}
        expanded={Boolean(expandedSections['contour-type'])}
        onToggleExpanded={() => toggleExpanded('contour-type')}
        onSelect={(contourType) => session.setWomenOptions({ contourType })}
      />
      <SelectionSection
        id="bronzer-tone"
        title="Bronzer Tone"
        options={toOptions(BRONZER_TONES)}
        selectedId={session.bronzerTone}
        expanded={Boolean(expandedSections['bronzer-tone'])}
        onToggleExpanded={() => toggleExpanded('bronzer-tone')}
        onSelect={(bronzerTone) => session.setWomenOptions({ bronzerTone })}
      />
      <SelectionSection
        id="contour-intensity"
        title="Contour Intensity"
        options={toOptions(CONTOUR_INTENSITIES)}
        selectedId={session.contourIntensity}
        expanded={Boolean(expandedSections['contour-intensity'])}
        onToggleExpanded={() => toggleExpanded('contour-intensity')}
        onSelect={(contourIntensity) =>
          session.setWomenOptions({ contourIntensity })
        }
      />

      <SelectionSection
        id="highlight-placement"
        title="Highlight Placement"
        options={toOptions(HIGHLIGHT_PLACEMENTS)}
        selectedId={session.highlightPlacement}
        expanded={Boolean(expandedSections['highlight-placement'])}
        onToggleExpanded={() => toggleExpanded('highlight-placement')}
        onSelect={(highlightPlacement) =>
          session.setWomenOptions({ highlightPlacement })
        }
      />
      <SelectionSection
        id="highlight-tone"
        title="Highlight Tone"
        options={toOptions(HIGHLIGHT_TONES)}
        selectedId={session.highlightTone}
        expanded={Boolean(expandedSections['highlight-tone'])}
        onToggleExpanded={() => toggleExpanded('highlight-tone')}
        onSelect={(highlightTone) => session.setWomenOptions({ highlightTone })}
      />
      <SelectionSection
        id="highlight-intensity"
        title="Highlight Intensity"
        options={toOptions(HIGHLIGHT_INTENSITIES)}
        selectedId={session.highlightIntensity}
        expanded={Boolean(expandedSections['highlight-intensity'])}
        onToggleExpanded={() => toggleExpanded('highlight-intensity')}
        onSelect={(highlightIntensity) =>
          session.setWomenOptions({ highlightIntensity })
        }
      />
      <SelectionSection
        id="highlight-finish"
        title="Highlight Finish"
        options={toOptions(HIGHLIGHT_FINISHES)}
        selectedId={session.highlightFinish}
        expanded={Boolean(expandedSections['highlight-finish'])}
        onToggleExpanded={() => toggleExpanded('highlight-finish')}
        onSelect={(highlightFinish) =>
          session.setWomenOptions({ highlightFinish })
        }
      />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#08080b]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-[0.8fr_1.2fr] gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/photo')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={generateCatalogStyle}
            disabled={!session.imageFile}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  )
}

function SelectionSection({
  id,
  title,
  subtitle,
  options,
  selectedId,
  expanded,
  onToggleExpanded,
  onSelect,
}: {
  id: string
  title: string
  subtitle?: string
  options: ReviewOption[]
  selectedId?: string
  expanded: boolean
  onToggleExpanded: () => void
  onSelect: (id: string) => void
}) {
  const visibleOptions = expanded ? options : options.slice(0, INITIAL_LIMIT)

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
        </div>
        {options.length > INITIAL_LIMIT && (
          <button
            type="button"
            onClick={onToggleExpanded}
            className="shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-fuchsia-100"
          >
            {expanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      {options.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {visibleOptions.map((option) => (
            <CatalogOptionCard
              key={`${id}-${option.id}`}
              label={option.label}
              description={option.description}
              imagePath={option.imagePath}
              selected={selectedId === option.id}
              onClick={() => onSelect(option.id)}
              imageClassName="aspect-[1.15]"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-5 text-sm text-zinc-500">
          No options available for this selection.
        </div>
      )}
    </Card>
  )
}

function toOptions(
  options: Array<{
    id?: string
    name?: string
    label?: string
    description?: string
    imagePath?: string
  }>,
): ReviewOption[] {
  return options.map((option) => ({
    id: option.id || option.name || option.label || 'None',
    label: option.label || option.name || option.id || 'None',
    description: option.description,
    imagePath: option.imagePath,
  }))
}
