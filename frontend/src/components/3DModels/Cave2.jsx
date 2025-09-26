/*
The cave entrance likes a head" by David Glynch, licensed under CC-BY-4.0
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cave/cave.gltf')
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.ivy_Trunk_0.geometry} material={materials.Trunk} />
          <mesh geometry={nodes.ivy_leaf_0.geometry} material={materials.leaf} />
          <mesh geometry={nodes.ivy_leaf_0_1.geometry} material={materials.leaf} />
        </group>
        <mesh geometry={nodes.cave_low_cave_0.geometry} material={materials.cave} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      </group>
    </group>
  )
}

useGLTF.preload('/cave/cave.gltf')
