import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Sky, Environment, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Terrain } from './Terrain'
import { Water } from './Water'
import { OsmBuildings } from './OsmBuildings'
import { AttractionMarkers } from './AttractionMarkers'
import { BlueNileFalls } from './BlueNileFalls'
import { latLngToLocal, type FlyTarget } from '@/lib/geo3d'
import type { Place } from '@/types/place'
import type { HeightGrid } from '@/services/elevation3d'
import type { OsmBuilding } from '@/services/osmBuildings'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type Props = {
  places: Place[]
  selectedId: string | null
  onSelect: (place: Place) => void
  /** Accept Place or FlyTarget so older call sites still typecheck */
  flyTo: FlyTarget | Place | null
  night?: boolean
  heightGrid?: HeightGrid | null
  osmBuildings?: OsmBuilding[] | null
  fallsSelected?: boolean
  onSelectFalls?: () => void
}

function CameraRig({ flyTo }: { flyTo: FlyTarget | Place | null }) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const { camera } = useThree()

  useEffect(() => {
    if (!flyTo || !controls) return
    const { x, z } = latLngToLocal(flyTo.latitude, flyTo.longitude)
    const lookY = 'lookAtY' in flyTo && flyTo.lookAtY != null ? flyTo.lookAtY : 0.5
    const target = new THREE.Vector3(x, lookY, z)
    const off =
      'cameraOffset' in flyTo && flyTo.cameraOffset ? flyTo.cameraOffset : ([10, 12, 12] as [number, number, number])
    const endCam = new THREE.Vector3(x + off[0], off[1], z + off[2])

    const startCam = camera.position.clone()
    const startTarget = controls.target.clone()
    let t = 0
    let raf = 0

    const animate = () => {
      t += 0.022
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

function Lights({ night }: { night: boolean }) {
  if (night) {
    return (
      <>
        <ambientLight intensity={0.12} />
        <directionalLight
          castShadow
          position={[-30, 40, -20]}
          intensity={0.25}
          color="#a8b8d8"
          shadow-mapSize={[1024, 1024]}
        />
        <hemisphereLight args={['#1a2744', '#0a0a12', 0.2]} />
        <pointLight position={[5, 8, -5]} intensity={0.4} color="#ffb347" distance={40} />
      </>
    )
  }
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

export function Explore3DScene({
  places,
  selectedId,
  onSelect,
  flyTo,
  night = false,
  heightGrid = null,
  osmBuildings = null,
  fallsSelected = false,
  onSelectFalls,
}: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      className="h-full w-full touch-none"
      style={{ background: night ? '#0a1020' : '#87b5d4' }}
    >
      <PerspectiveCamera makeDefault position={[28, 22, 32]} fov={48} near={0.5} far={2000} />
      <Lights night={night} />
      {night ? (
        <>
          <color attach="background" args={['#0a1020']} />
          <Stars radius={300} depth={80} count={2500} factor={3} saturation={0} fade speed={0.4} />
          <fog attach="fog" args={['#0a1020', 40, 280]} />
        </>
      ) : (
        <>
          <Sky sunPosition={[80, 40, 20]} turbidity={4} rayleigh={1.2} mieCoefficient={0.005} />
          <Environment preset="park" environmentIntensity={0.35} />
          <fog attach="fog" args={['#a8c8e0', 80, 520]} />
        </>
      )}

      <Suspense fallback={null}>
        <Terrain heightGrid={heightGrid} night={night} />
        <Water />
        <OsmBuildings buildings={osmBuildings} night={night} />
        <BlueNileFalls night={night} selected={fallsSelected} onSelect={onSelectFalls} />
        <AttractionMarkers places={places} selectedId={selectedId} onSelect={onSelect} />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={420}
        maxPolarAngle={Math.PI / 2.12}
        target={[0, 0, 0]}
      />
      <CameraRig flyTo={flyTo} />
    </Canvas>
  )
}
