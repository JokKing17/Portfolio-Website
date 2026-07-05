'use client'

import { Suspense } from 'react'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FloatingModel } from './FloatingModel'
import { Particles } from './Particles'

type HeroCanvasProps = {
  modelUrl?: string
  particles?: boolean
}

export default function HeroCanvas({ modelUrl, particles = true }: HeroCanvasProps) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ fov: 42, position: [0, 0, 5] }} dpr={[1, 1.8]} gl={{ antialias: true }}>
        <color args={['#05070c']} attach="background" />
        <ambientLight intensity={1.2} />
        <directionalLight color="#fff2d4" intensity={1.8} position={[3, 4, 4]} />
        <pointLight color="#33ffdd" intensity={18} position={[-2, -1, 2]} />
        <Suspense fallback={null}>
          {particles ? <Particles /> : null}
          <FloatingModel modelUrl={modelUrl} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 1.9}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
