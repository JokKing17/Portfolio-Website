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
    <div className={cn('mb-10 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? (
        <p className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-primary drop-shadow-[0_0_12px_rgba(0,214,201,0.22)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  )
}
