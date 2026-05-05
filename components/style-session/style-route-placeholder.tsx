import Link from 'next/link'
import { Card } from '@/app/components/ui'
import type { StyleSessionRoute } from '@/lib/style-session/style-session-types'

type StyleRoutePlaceholderProps = {
  title: string
  description: string
  previousHref?: StyleSessionRoute
  nextHref?: StyleSessionRoute
}

export function StyleRoutePlaceholder({
  title,
  description,
  previousHref,
  nextHref,
}: StyleRoutePlaceholderProps) {
  return (
    <Card>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Style session
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {previousHref && (
            <Link className="btn-dark w-auto px-5 text-center text-sm" href={previousHref}>
              Back
            </Link>
          )}
          {nextHref && (
            <Link className="btn-primary w-auto px-5 text-center text-sm" href={nextHref}>
              Continue
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
