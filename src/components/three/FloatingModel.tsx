'use client'

import { useMemo, useRef } from 'react'
import { Float, MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'

function UploadedModel({ url }: { url: string }) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(url)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.22
  })

  return <primitive object={scene} ref={groupRef} scale={1.7} />
}

function ProceduralCore() {
  const ref = useRef<Mesh>(null)
  const color = useMemo(() => '#33ffdd', [])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.18
    ref.current.rotation.y += delta * 0.26
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.25, 2]} />
      <MeshTransmissionMaterial
        backside
        chromaticAberration={0.06}
        color={color}
        distortion={0.42}
        metalness={0.1}
        roughness={0.18}
        thickness={0.8}
        transmission={0.72}
      />
    </mesh>
  )
}

export function FloatingModel({ modelUrl }: { modelUrl?: string }) {
  const canLoadModel = Boolean(modelUrl && /\.(glb|gltf)(\?.*)?$/i.test(modelUrl))

  return (
    <Float floatIntensity={1.6} rotationIntensity={0.55} speed={1.6}>
      {canLoadModel && modelUrl ? <UploadedModel url={modelUrl} /> : <ProceduralCore />}
    </Float>
  )
}
