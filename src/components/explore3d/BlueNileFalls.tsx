import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { BLUE_NILE_FALLS, BLUE_NILE_FALLS_LOCAL } from '@/lib/geo3d'

type Props = {
  night?: boolean
  selected?: boolean
  onSelect?: () => void
}

/** Stylized Blue Nile Falls (Tis Abay) landmark ~30 km SE of the city. */
export function BlueNileFalls({ night, selected, onSelect }: Props) {
  const spray = useRef<THREE.Mesh>(null)
  const { x, z } = BLUE_NILE_FALLS_LOCAL

  useFrame(({ clock }) => {
    if (!spray.current) return
    const t = clock.getElapsedTime()
    spray.current.position.y = 2.2 + Math.sin(t * 3) * 0.15
    const mat = spray.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.35 + Math.sin(t * 2.5) * 0.1
  })

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 2.4, 5]} />
        <meshStandardMaterial color={night ? '#3d342c' : '#6b5b4a'} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.15, 4]} receiveShadow>
        <boxGeometry args={[10, 0.3, 6]} />
        <meshStandardMaterial color={night ? '#1a3a4a' : '#2a6a8a'} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh
        position={[0, 2.4, 1.8]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <planeGeometry args={[5.5, 3.2]} />
        <meshStandardMaterial
          color={night ? '#6eb6d9' : '#a8d8f0'}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          emissive={night ? '#3a8ab0' : '#7ec8e8'}
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh ref={spray} position={[0, 2.2, 2.2]}>
        <sphereGeometry args={[1.4, 12, 12]} />
        <meshStandardMaterial color="#e8f4fc" transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh position={[0, 5.2, 0]}>
        <sphereGeometry args={[selected ? 0.55 : 0.4, 16, 16]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={selected ? 0.7 : 0.4}
        />
      </mesh>
      <Html distanceFactor={28} position={[0, 6.4, 0]} center>
        <div className="pointer-events-none rounded-md bg-cyan-900/90 px-2 py-1 text-center text-[11px] font-semibold text-white shadow-lg">
          {BLUE_NILE_FALLS.name}
          <span className="block text-[10px] font-normal opacity-90">{BLUE_NILE_FALLS.nameAm}</span>
        </div>
      </Html>
    </group>
  )
}
