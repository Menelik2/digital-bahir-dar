import { useMemo } from 'react'
import * as THREE from 'three'

/** Soft rolling highland terrain around Bahir Dar (flat city bowl + gentle rises). */
export function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(900, 900, 96, 96)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i) // plane is XY before rotation
      // Keep center relatively flat; rise toward edges (highlands)
      const dist = Math.sqrt(x * x + y * y)
      const edgeRise = Math.max(0, (dist - 80) / 180) * 18
      const noise =
        Math.sin(x * 0.035) * Math.cos(y * 0.028) * 2.2 +
        Math.sin(x * 0.08 + y * 0.06) * 0.9
      // Depression for lake basin (west)
      const lakeDip =
        Math.exp(-((x + 40) * (x + 40) + (y - 20) * (y - 20)) / (220 * 220)) * -4.5
      pos.setZ(i, edgeRise + noise + lakeDip)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.4, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#5a7a4a"
        roughness={0.92}
        metalness={0.02}
        flatShading={false}
      />
    </mesh>
  )
}
