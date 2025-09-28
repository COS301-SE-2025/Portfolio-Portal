/*
"Cave Project" by ALA, licensed under CC-BY-4.0
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cave2/cave.gltf')
  return (
    <group {...props} dispose={null}>
      <group position={[0.475, 0, -1.083]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.Cave_Cave1_0.geometry} material={materials.Cave1} />
          <mesh geometry={nodes.Rock19_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock20_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock21_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock22_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock23_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock24_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock25_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock26_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock27_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock28_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock29_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock30_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock31_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock32_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock33_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock34_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock35_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock36_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock18_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock17_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock16_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock15_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock14_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock13_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock12_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock11_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock9_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock8_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock7_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock6_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock5_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock10_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock4_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock3_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock2_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Rock1_Rocks_0.geometry} material={materials.Rocks} />
          <mesh geometry={nodes.Water1_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.Water2_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.Water7_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.Water8_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.Water9_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.Water3_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.Water4_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.Water5_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.Water6_Water_0.geometry} material={materials.Water} />
          <mesh geometry={nodes.p8_Column2_0.geometry} material={materials.Column2} />
          <mesh geometry={nodes.p7_Column1_0.geometry} material={materials.Column1} />
          <mesh geometry={nodes.p6_Column2_0.geometry} material={materials.Column2} />
          <mesh geometry={nodes.p5_Column1_0.geometry} material={materials.Column1} />
          <mesh geometry={nodes.p4_Column2_0.geometry} material={materials.Column2} />
          <mesh geometry={nodes.p3_Column1_0.geometry} material={materials.Column1} />
          <mesh geometry={nodes.p2_Column2_0.geometry} material={materials.Column2} />
          <mesh geometry={nodes.p1_Column1_0.geometry} material={materials.Column1} />
          <mesh geometry={nodes.st13_Stalas2_0.geometry} material={materials.Stalas2} />
          <mesh geometry={nodes.st12_Stalas1_0.geometry} material={materials.Stalas1} />
          <mesh geometry={nodes.st11_Stalas2_0.geometry} material={materials.Stalas2} />
          <mesh geometry={nodes.st10_Stalas2_0.geometry} material={materials.Stalas2} />
          <mesh geometry={nodes.st9_Stalas2_0.geometry} material={materials.Stalas2} />
          <mesh geometry={nodes.st8_Stalas1_0.geometry} material={materials.Stalas1} />
          <mesh geometry={nodes.st7_Stalas1_0.geometry} material={materials.Stalas1} />
          <mesh geometry={nodes.st6_Stalas2_0.geometry} material={materials.Stalas2} />
          <mesh geometry={nodes.st5_Stalas2_0.geometry} material={materials.Stalas2} />
          <mesh geometry={nodes.st4_Stalas1_0.geometry} material={materials.Stalas1} />
          <mesh geometry={nodes.st3_Stalas1_0.geometry} material={materials.Stalas1} />
          <mesh geometry={nodes.st2_Stalas2_0.geometry} material={materials.Stalas2} />
          <mesh geometry={nodes.st1_Stalas1_0.geometry} material={materials.Stalas1} />
          <mesh geometry={nodes.Hide_Hide1_0.geometry} material={materials.Hide1} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/cave2/cave.gltf')
