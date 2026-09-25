import { useMemo } from 'react'
import * as THREE from 'three'
import type { HeightGrid } from '@/services/elevation3d'

type Props = {
  heightGrid: HeightGrid | null
  night?: boolean
}

/** SRTM-driven terrain when available; otherwise smooth synthetic highlands. */
export function Terrain({ heightGrid, night }: Props) {
  const geometry = useMemo(() => {
    if (heightGrid) {
      const { size, elevations, minElev, halfExtent } = heightGrid
      const geo = new THREE.PlaneGeometry(halfExtent * 2, halfExtent * 2, size - 1, size - 1)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const col = i % size
        const row = Math.floor(i / size)
        const elev = elevations[row]?.[col] ?? minElev
        const h = ((elev - minElev) / 80) * 1.35
        pos.setZ(i, h)
      }
      geo.computeVertexNormals()
      return geo
    }

    const geo = new THREE.PlaneGeometry(900, 900, 96, 96)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const dist = Math.sqrt(x * x + y * y)
      const edgeRise = Math.max(0, (dist - 80) / 180) * 18
      const noise =
        Math.sin(x * 0.035) * Math.cos(y * 0.028) * 2.2 +
        Math.sin(x * 0.08 + y * 0.06) * 0.9
      const lakeDip =
        Math.exp(-((x + 40) * (x + 40) + (y - 20) * (y - 20)) / (220 * 220)) * -4.5
      pos.setZ(i, edgeRise + noise + lakeDip)
    }
    geo.computeVertexNormals()
    return geo
  }, [heightGrid])

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.15, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color={night ? '#2a3a28' : '#5a7a4a'}
        roughness={0.92}
        metalness={0.02}
        flatShading={false}
      />
    </mesh>
  )
}
