'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Bot,
  Boxes,
  Braces,
  BrainCircuit,
  Code2,
  Container,
  Database,
  Eye,
  GitBranch,
  MessageSquareText,
  Network,
  ServerCog,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getMedia, getMediaUrl } from '@/lib/utils'
import type { Skill } from '@/types/skill'

function iconForSkill(skill: Skill): LucideIcon {
  const name = skill.name?.toLowerCase() || ''
  const category = skill.category?.toLowerCase() || ''

  if (name.includes('generative')) return Sparkles
  if (name.includes('agentic')) return Bot
  if (name.includes('llm') || name.includes('prompt')) return MessageSquareText
  if (name.includes('retrieval') || name.includes('rag') || name.includes('langgraph')) return Network
  if (name.includes('langchain')) return Workflow
  if (name.includes('computer vision')) return Eye
  if (name.includes('vector') || name.includes('sql') || name.includes('mongo') || name.includes('firebase')) {
    return Database
  }
  if (name.includes('fastapi') || name.includes('rest api') || category.includes('backend')) return ServerCog
  if (name.includes('docker')) return Container
  if (name.includes('git')) return GitBranch
  if (name.includes('flutter') || name.includes('dart') || category.includes('mobile')) return Smartphone
  if (name.includes('python') || name.includes('c++') || name.includes('c#') || category.includes('language')) {
    return Braces
  }
  if (category.includes('framework')) return Boxes
  if (category.includes('ai')) return BrainCircuit

  return Code2
}

export function SkillCard({ skill }: { skill: Skill }) {
  const [iconFailed, setIconFailed] = useState(false)
  const icon = getMedia(skill.icon)
  const iconUrl = getMediaUrl(skill.icon)
  const isSvg = iconUrl?.endsWith('.svg')
  const SkillIcon = iconForSkill(skill)
  const level = Math.min(Math.max(skill.level || 0, 0), 100)

  return (
    <motion.article
      className="polished-card group flex h-full flex-col rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mb-5 flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/[0.08] transition duration-300 group-hover:border-primary/35 group-hover:bg-primary/[0.12]">
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
            <SkillIcon className="size-6 text-primary drop-shadow-[0_0_10px_rgba(0,214,201,0.55)]" strokeWidth={1.8} />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold leading-6 text-foreground">{skill.name}</h3>
          <p className="mt-0.5 truncate text-[0.68rem] font-medium uppercase tracking-[0.18em] text-primary/80">
            {skill.category}
          </p>
        </div>
      </div>
      {skill.description ? (
        <p className="mb-6 line-clamp-3 text-sm leading-6 text-muted-foreground">{skill.description}</p>
      ) : null}
      <div className="mt-auto h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
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
