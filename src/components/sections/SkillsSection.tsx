'use client'

import { useMemo, useState } from 'react'
import { SkillCard } from '@/components/cards/SkillCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types/skill'

export function SkillsSection({ heading, skills }: { heading?: string; skills: Skill[] }) {
  const categories = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(skills.map((skill) => skill.category).filter((category): category is string => Boolean(category)))
      )
    ],
    [skills]
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const visibleSkills =
    activeCategory === 'All' ? skills : skills.filter((skill) => skill.category === activeCategory)

  return (
    <section className="section-shell container" id="skills">
      <SectionHeading
        eyebrow="Capability"
        title={heading || 'Skills'}
        description="Tools, languages, and systems organized by focus area."
      />
      {!skills.length ? (
        <EmptyState title="No skills published yet." />
      ) : (
        <>
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                className={cn(
                  'focus-ring rounded-md border border-white/12 px-4 py-2 text-sm text-muted-foreground transition',
                  activeCategory === category
                    ? 'border-primary/50 bg-primary/12 text-primary'
                    : 'bg-white/[0.03] hover:border-primary/30 hover:text-foreground'
                )}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
