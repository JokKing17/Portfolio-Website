'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Code2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getMedia, getMediaUrl } from '@/lib/utils'
import type { Skill } from '@/types/skill'

export function SkillCard({ skill }: { skill: Skill }) {
  const [iconFailed, setIconFailed] = useState(false)
  const icon = getMedia(skill.icon)
  const iconUrl = icon?.url?.startsWith('/skill-icons/') ? icon.url : getMediaUrl(skill.icon)
  const isSvg = iconUrl?.endsWith('.svg')
  const level = Math.min(Math.max(skill.level || 0, 0), 100)

  return (
    <motion.article
      className="glass h-full rounded-lg p-5 transition duration-300 hover:border-primary/30 hover:shadow-glow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.42 }}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-md border border-white/12 bg-white/[0.04]">
          {iconUrl && !iconFailed ? (
            <Image
              alt={icon?.alt || skill.name || 'Skill icon'}
              className="object-contain"
              height={28}
              onError={() => setIconFailed(true)}
              src={iconUrl}
              unoptimized={isSvg}
              width={28}
            />
          ) : (
            <Code2 className="size-5 text-primary" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{skill.name}</h3>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {skill.category}
          </p>
        </div>
      </div>
      {skill.description ? (
        <p className="mb-5 text-sm leading-6 text-muted-foreground">{skill.description}</p>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </motion.article>
  )
}
