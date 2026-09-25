import { useMemo } from 'react'
import { CITY_BOUNDS } from '@/lib/geo3d'

type BuildingInstance = {
  position: [number, number, number]
  scale: [number, number, number]
  color: string
}

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** Procedural low-poly city fabric for Bahir Dar waterfront + grid. */
export function CityBuildings() {
  const buildings = useMemo(() => {
    const list: BuildingInstance[] = []
    let i = 0
    for (let gx = CITY_BOUNDS.minX; gx < CITY_BOUNDS.maxX; gx += 2.4) {
      for (let gz = CITY_BOUNDS.minZ; gz < CITY_BOUNDS.maxZ; gz += 2.4) {
        i++
        // Sparse outside denser core
        const cx = (CITY_BOUNDS.minX + CITY_BOUNDS.maxX) / 2
        const cz = (CITY_BOUNDS.minZ + CITY_BOUNDS.maxZ) / 2
        const dist = Math.hypot(gx - cx, gz - cz)
        const density = Math.max(0.15, 1 - dist / 45)
        if (seeded(i * 3.1) > density * 0.75) continue
        // Leave some open for streets / parks
        if (seeded(i * 7.7) > 0.82) continue

        const h = 0.6 + seeded(i * 1.3) * (dist < 12 ? 4.5 : 2.2)
        const w = 0.7 + seeded(i * 2.1) * 1.1
        const d = 0.7 + seeded(i * 4.2) * 1.0
        const tones = ['#c4b8a8', '#d9cfc0', '#b8a99a', '#e8e0d4', '#a89888', '#8a9a7a']
        const color = tones[Math.floor(seeded(i * 5.5) * tones.length)]
        list.push({
          position: [gx + seeded(i) * 0.4, h / 2, gz + seeded(i + 1) * 0.4],
          scale: [w, h, d],
          color,
        })
      }
    }
    return list
  }, [])

  return (
    <group>
      {buildings.map((b, idx) => (
        <mesh key={idx} position={b.position} scale={b.scale} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={b.color} roughness={0.85} metalness={0.05} />
        </mesh>
      ))}
      {/* Simple landmark towers (palace / cathedral area feel) */}
      <mesh position={[2, 3.2, -4]} castShadow>
        <boxGeometry args={[2.2, 6.4, 2.2]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.7} />
      </mesh>
      <mesh position={[2, 6.8, -4]} castShadow>
        <coneGeometry args={[1.4, 1.8, 4]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
    </group>
  )
}
