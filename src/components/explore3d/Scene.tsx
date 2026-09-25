import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Sky, Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { Terrain } from './Terrain'
import { Water } from './Water'
import { CityBuildings } from './CityBuildings'
import { AttractionMarkers } from './AttractionMarkers'
import { latLngToLocal } from '@/lib/geo3d'
import type { Place } from '@/types/place'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type Props = {
  places: Place[]
  selectedId: string | null
  onSelect: (place: Place) => void
  flyTo: Place | null
}

function CameraRig({ flyTo }: { flyTo: Place | null }) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const { camera } = useThree()
  const targetRef = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    if (!flyTo || !controls) return
    const { x, z } = latLngToLocal(flyTo.latitude, flyTo.longitude)
    const target = new THREE.Vector3(x, 0.5, z)
    targetRef.current.copy(target)

    const startCam = camera.position.clone()
    const endCam = new THREE.Vector3(x + 8, 10, z + 10)
    const startTarget = controls.target.clone()
    let t = 0
    let raf = 0

    const animate = () => {
      t += 0.025
      const k = Math.min(1, t)
      const ease = k * k * (3 - 2 * k)
      camera.position.lerpVectors(startCam, endCam, ease)
      controls.target.lerpVectors(startTarget, target, ease)
      controls.update()
      if (k < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [flyTo, controls, camera])

  return null
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        castShadow
        position={[40, 60, 20]}
        intensity={1.15}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      <hemisphereLight args={['#b1e1ff', '#5a7a4a', 0.35]} />
    </>
  )
}

export function Explore3DScene({ places, selectedId, onSelect, flyTo }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      className="h-full w-full touch-none"
      style={{ background: '#87b5d4' }}
    >
      <PerspectiveCamera makeDefault position={[28, 22, 32]} fov={48} near={0.5} far={1200} />
      <Lights />
      <Sky sunPosition={[80, 40, 20]} turbidity={4} rayleigh={1.2} mieCoefficient={0.005} />
      <Environment preset="park" environmentIntensity={0.35} />
      <fog attach="fog" args={['#a8c8e0', 80, 420]} />

      <Suspense fallback={null}>
        <Terrain />
        <Water />
        <CityBuildings />
        <AttractionMarkers places={places} selectedId={selectedId} onSelect={onSelect} />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={160}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0, 0]}
      />
      <CameraRig flyTo={flyTo} />
    </Canvas>
  )
}
