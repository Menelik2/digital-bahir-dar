import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { latLngToLocal } from '@/lib/geo3d'
import type { Place } from '@/types/place'

type Props = {
  places: Place[]
  selectedId: string | null
  onSelect: (place: Place) => void
}

function Marker({
  place,
  selected,
  onSelect,
}: {
  place: Place
  selected: boolean
  onSelect: () => void
}) {
  const ref = useRef<THREE.Group>(null)
  const { x, z } = latLngToLocal(place.latitude, place.longitude)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = 1.2 + Math.sin(t * 2 + x) * 0.12
  })

  const color =
    place.category?.slug === 'hotel'
      ? '#0ea5e9'
      : place.category?.slug === 'restaurant'
        ? '#f59e0b'
        : '#10b981'

  return (
    <group ref={ref} position={[x, 1.2, z]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[selected ? 0.55 : 0.38, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 0.65 : 0.35}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.7, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {(selected || place.featured) && (
        <Html distanceFactor={18} position={[0, 1.1, 0]} center>
          <div
            className="pointer-events-none max-w-[140px] rounded-md bg-white/95 px-2 py-1 text-center text-[11px] font-medium text-slate-800 shadow-lg ring-1 ring-black/5 dark:bg-slate-900/95 dark:text-slate-100"
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {place.name}
          </div>
        </Html>
      )}
    </group>
  )
}

export function AttractionMarkers({ places, selectedId, onSelect }: Props) {
  const markers = useMemo(
    () =>
      places.filter(
        (p) =>
          Number.isFinite(p.latitude) &&
          Number.isFinite(p.longitude) &&
          Math.abs(p.latitude) > 1 &&
          Math.abs(p.longitude) > 1
      ),
    [places]
  )

  return (
    <group>
      {markers.map((p) => (
        <Marker
          key={p.id}
          place={p}
          selected={p.id === selectedId}
          onSelect={() => onSelect(p)}
        />
      ))}
    </group>
  )
}
