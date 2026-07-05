'use client'

import { useGSAPScroll } from '@/hooks/useGSAPScroll'
import { useLenis } from '@/hooks/useLenis'

export function SmoothScroll() {
  useLenis()
  useGSAPScroll()

  return null
}
