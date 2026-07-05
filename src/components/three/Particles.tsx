'use client'

import { useMemo } from 'react'
import { Points, PointMaterial } from '@react-three/drei'

export function Particles({ count = 900 }: { count?: number }) {
  const positions = useMemo(() => {
    const points = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const radius = 1.4 + Math.random() * 3.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      points[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
      points[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      points[index * 3 + 2] = radius * Math.cos(phi)
    }

    return points
  }, [count])

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial color="#33ffdd" size={0.018} sizeAttenuation transparent opacity={0.55} />
    </Points>
  )
}
