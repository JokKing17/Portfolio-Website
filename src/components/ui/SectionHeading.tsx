import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  align = 'left',
  description,
  eyebrow,
  title
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  )
}
