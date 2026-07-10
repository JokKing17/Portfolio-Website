import type { IconType } from 'react-icons'
import { FaLinkedinIn } from 'react-icons/fa6'
import {
  SiDevdotto,
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiKaggle,
  SiMedium,
  SiStackoverflow,
  SiUpwork,
  SiWhatsapp,
  SiX,
  SiYoutube
} from 'react-icons/si'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const brandIcons: Record<string, IconType> = {
  dev: SiDevdotto,
  devto: SiDevdotto,
  discord: SiDiscord,
  facebook: SiFacebook,
  github: SiGithub,
  instagram: SiInstagram,
  kaggle: SiKaggle,
  linkedin: FaLinkedinIn,
  medium: SiMedium,
  stackoverflow: SiStackoverflow,
  twitter: SiX,
  upwork: SiUpwork,
  whatsapp: SiWhatsapp,
  x: SiX,
  youtube: SiYoutube
}

type SocialIconProps = {
  className?: string
  icon?: string | null
  platform?: string | null
}

export function SocialIcon({ className, icon, platform }: SocialIconProps) {
  const requestedIcon = normalizeIconName(icon)
  const platformIcon = normalizeIconName(platform)
  const Icon = brandIcons[requestedIcon] || brandIcons[platformIcon]

  if (!Icon) {
    return <ExternalLink aria-hidden="true" className={cn('size-4', className)} />
  }

  return <Icon aria-hidden="true" className={cn('size-4', className)} />
}

function normalizeIconName(value?: string | null) {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/^si/, '')
    .replace(/[^a-z0-9]/g, '')
}
