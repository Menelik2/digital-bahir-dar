import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LAKE_TANA_CENTER, LAKE_TANA_SIZE } from '@/lib/geo3d'

/** Soft animated Lake Tana surface. */
export function Water() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(LAKE_TANA_SIZE.width, LAKE_TANA_SIZE.depth, 48, 48)
    return g
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.04 + Math.sin(t * 0.6) * 0.015
    }
    // Gentle vertex wave
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const wave =
        Math.sin(x * 0.08 + t * 0.7) * 0.18 + Math.cos(y * 0.06 + t * 0.5) * 0.12
      pos.setZ(i, wave)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh
      geometry={geo}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[LAKE_TANA_CENTER.x, 0.05, LAKE_TANA_CENTER.z]}
      receiveShadow
    >
      <meshStandardMaterial
        ref={matRef}
        color="#1a6b9a"
        emissive="#0a3a5c"
        emissiveIntensity={0.05}
        roughness={0.15}
        metalness={0.35}
        transparent
        opacity={0.92}
      />
    </mesh>
  )
}
