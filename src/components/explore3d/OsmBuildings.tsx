import { useMemo } from 'react'
import * as THREE from 'three'
import type { OsmBuilding } from '@/services/osmBuildings'
import { CityBuildings } from './CityBuildings'

type Props = {
  buildings: OsmBuilding[] | null
  night?: boolean
}

function BuildingMesh({ b, night }: { b: OsmBuilding; night?: boolean }) {
  const geometry = useMemo(() => {
    const ring = b.ring
    if (ring.length < 3) return null
    const shape = new THREE.Shape()
    shape.moveTo(ring[0].x, ring[0].z)
    for (let i = 1; i < ring.length; i++) {
      shape.lineTo(ring[i].x, ring[i].z)
    }
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.35, b.height),
      bevelEnabled: false,
    })
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [b])

  if (!geometry) return null

  const tone = night ? '#3a3540' : '#c8bdb0'
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={tone}
        roughness={0.88}
        metalness={0.04}
        emissive={night ? '#f5d78e' : '#000000'}
        emissiveIntensity={night ? 0.12 : 0}
      />
    </mesh>
  )
}

/** Real OSM footprints when loaded; procedural city as fallback. */
export function OsmBuildings({ buildings, night }: Props) {
  if (!buildings?.length) {
    return <CityBuildings />
  }

  return (
    <group>
      {buildings.map((b) => (
        <BuildingMesh key={b.id} b={b} night={night} />
      ))}
    </group>
  )
}
