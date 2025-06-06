/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 head.gltf 
Author: Stan (https://sketchfab.com/Stas_SayHallo)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/male-head-18316a8793694509ac1d20451031d794
Title: Male Head
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/head/head.gltf')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, -Math.PI]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh geometry={nodes.head_low_head_0.geometry} material={materials.head} rotation={[-Math.PI / 2, 0, Math.PI]} scale={100} />
          <mesh geometry={nodes.tShirt_low_tShirt_0.geometry} material={materials.tShirt} position={[0, -318.347, -106.722]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={95} />
          <mesh geometry={nodes.Sphere_eye_0.geometry} material={materials.material} position={[-31.385, -13.96, -67.233]} rotation={[Math.PI, 0, Math.PI]} scale={15.676} />
          <mesh geometry={nodes['geo_hair-card_3006_hair-cards_0'].geometry} material={materials['hair-cards']} position={[-40.48, 43.642, 100.799]} rotation={[-0.442, -0.332, -1.81]} scale={142.048} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/head/head.gltf')
