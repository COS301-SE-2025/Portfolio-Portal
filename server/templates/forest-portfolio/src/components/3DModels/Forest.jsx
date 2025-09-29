// Model Information:
// * title:	Low Poly Forest Campfire [Updated]
// * source:	https://sketchfab.com/3d-models/low-poly-forest-campfire-updated-af086b62a4c84ea89eda895b23d64813
// * author:	Minzkraut (https://sketchfab.com/Minzkraut)

// Model License:
// * license type:	CC-BY-NC-SA-4.0 (http://creativecommons.org/licenses/by-nc-sa/4.0/)
// * requirements:	Author must be credited. No commercial use. Modified versions must have the same license.

// If you use this 3D model in your project be sure to copy paste this credit wherever you share it:
// This work is based on "Low Poly Forest Campfire [Updated]" (https://sketchfab.com/3d-models/low-poly-forest-campfire-updated-af086b62a4c84ea89eda895b23d64813) by Minzkraut (https://sketchfab.com/Minzkraut) licensed under CC-BY-NC-SA-4.0 (http://creativecommons.org/licenses/by-nc-sa/4.0/)

import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("forest/forest.gltf");
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group scale={[1.277, 1.277, 1]}>
          <mesh geometry={nodes.Cube_0.geometry} material={materials.Ground} />
          <mesh geometry={nodes.Cube_1.geometry} material={materials.Dirt} />
          <mesh
            geometry={nodes.Cube_2.geometry}
            material={materials.Material}
          />
        </group>
        <group
          position={[3.297, 1.417, 1.737]}
          rotation={[0.039, 0, 0]}
          scale={0.568}
        >
          <mesh
            geometry={nodes.Cube001_0.geometry}
            material={materials.TreeBark}
          />
          <mesh
            geometry={nodes.Cube001_1.geometry}
            material={materials.LightWood}
          />
        </group>
        <group
          position={[-5.815, -4.821, 0.701]}
          rotation={[0, 0, -3.087]}
          scale={1.737}
        >
          <group position={[-0.071, -0.478, 3.724]} scale={[0.1, 0.223, 0.1]}>
            <mesh
              geometry={nodes.LaternHang_0.geometry}
              material={materials.DarkTreeBark}
            />
            <mesh
              geometry={nodes.Cube058_0.geometry}
              material={materials.LightMetal}
              position={[-0.042, -4.054, -1.395]}
              scale={[0.272, 0.122, 0.272]}
            />
          </group>
          <mesh
            geometry={nodes.LanternLargeStem_0.geometry}
            material={materials.DarkTreeBark}
          />
        </group>
        <group
          position={[-5.803, -2.594, 6.783]}
          rotation={[0, 0, -3.087]}
          scale={1.737}
        >
          <mesh
            geometry={nodes.LanternGlass_0.geometry}
            material={materials.Glass}
            position={[0.017, -0.006, -0.387]}
            rotation={[0, 0, -Math.PI]}
            scale={0.076}
          />
          <mesh
            geometry={nodes.Lantern_0.geometry}
            material={materials.Metal}
            position={[0.017, -0.006, -0.567]}
            scale={0.076}
          />
          <mesh
            geometry={nodes.LanternHold_0.geometry}
            material={materials.Metal}
            position={[0.017, -0.006, -0.353]}
            scale={0.076}
          />
        </group>
        <group
          position={[3.229, -0.201, 2.908]}
          rotation={[-0.233, 0.037, 0.197]}
          scale={[0.111, 0.165, 0.04]}
        >
          <mesh
            geometry={nodes.Icosphere031_0.geometry}
            material={materials["Leafes.001"]}
          />
          <mesh
            geometry={nodes.Icosphere048_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.911, 1.649, -3.226]}
            rotation={[-0.872, -0.245, -0.694]}
            scale={[1.297, 1.635, 0.472]}
          />
          <mesh
            geometry={nodes.Icosphere035_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.351, 1.044, -0.707]}
            rotation={[-0.113, -0.22, 1.328]}
            scale={[0.608, 1.369, 0.874]}
          />
          <mesh
            geometry={nodes.Icosphere034_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.349, 1.07, -0.711]}
            rotation={[-0.45, 0.121, -1.175]}
            scale={[0.513, 1.295, 0.677]}
          />
          <mesh
            geometry={nodes.Icosphere033_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.235, 0.632, -0.445]}
            rotation={[-0.313, 0.362, -0.603]}
            scale={[0.865, 1.665, 0.934]}
          />
          <mesh
            geometry={nodes.Icosphere032_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.291, 0.385, -0.386]}
            rotation={[-0.238, -0.518, 0.851]}
            scale={[0.622, 1.473, 0.719]}
          />
        </group>
        <group
          position={[3.784, -0.278, 2.452]}
          rotation={[-0.114, -0.838, 1.354]}
          scale={[0.078, 0.115, 0.028]}
        >
          <mesh
            geometry={nodes.Icosphere036_0.geometry}
            material={materials["Leafes.001"]}
          />
          <mesh
            geometry={nodes.Icosphere040_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.069, 0.326, -0.39]}
            rotation={[-0.238, -0.518, 0.851]}
            scale={[0.622, 1.473, 0.719]}
          />
          <mesh
            geometry={nodes.Icosphere039_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.364, 0.75, -0.363]}
            rotation={[-0.313, 0.362, -0.603]}
            scale={[0.865, 1.665, 0.934]}
          />
          <mesh
            geometry={nodes.Icosphere038_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.46, 1.423, -0.391]}
            rotation={[-0.45, 0.121, -1.175]}
            scale={[0.732, 1.849, 0.966]}
          />
          <mesh
            geometry={nodes.Icosphere037_0.geometry}
            material={materials["Leafes.001"]}
            position={[-0.374, 1.299, -0.434]}
            rotation={[-0.113, -0.22, 1.328]}
            scale={[0.838, 1.888, 1.205]}
          />
        </group>
        <group
          position={[-6.605, -4.353, -2.438]}
          rotation={[0, 0, -3.093]}
          scale={[2.42, 2.42, 1.737]}
        >
          <mesh
            geometry={nodes.LanternLargeStem001_0.geometry}
            material={materials.DarkTreeBark}
          />
          <mesh
            geometry={nodes.LanternLargeStem001_1.geometry}
            material={materials.LightWood}
          />
        </group>
        <group
          position={[-4.953, -4.695, 2.487]}
          rotation={[-2.984, 0.289, 2.337]}
          scale={[0.058, 0.058, 0.068]}
        >
          <mesh
            geometry={nodes.Cylinder014_0.geometry}
            material={materials.TreeBark}
          />
          <mesh
            geometry={nodes.Cube059_0.geometry}
            material={materials.Root}
            position={[-1.568, -0.831, 17.208]}
            rotation={[-Math.PI, 0, 3.012]}
            scale={[3.478, 3.478, 2.98]}
          />
        </group>
        <group
          position={[-7.145, 3.941, 1.634]}
          rotation={[0.414, -0.25, 0.851]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh geometry={nodes.Flower_1.geometry} material={materials.Grass} />
          <mesh
            geometry={nodes.Flower_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-7.163, 4.314, 0.549]}
          rotation={[-0.096, -0.471, -0.415]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower001_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower001_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower001_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-6.771, 4.261, -0.002]}
          rotation={[0.479, -0.021, 1.325]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower002_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower002_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower002_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-6.905, 4.239, 1.749]}
          rotation={[-0.213, 0.133, 1.151]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower003_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower003_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-1.501, -4.97, 1.754]}
          rotation={[0.057, -0.244, -2.777]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower004_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower004_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-1.611, -4.891, 0.003]}
          rotation={[-0.34, 0.345, -2.541]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower005_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower005_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower005_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-1.37, -5.204, 0.554]}
          rotation={[0.404, 0.266, 1.916]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower006_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower006_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower006_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-1.12, -4.926, 1.639]}
          rotation={[-0.116, 0.466, -3.095]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower007_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower007_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower007_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-1.837, -4.834, -0.202]}
          rotation={[-0.464, -0.127, -1.53]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower008_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower008_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower008_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-1.647, -5.005, 1.453]}
          rotation={[-0.479, -0.015, -1.749]}
          scale={[0.083, 0.123, 0.029]}
        >
          <mesh
            geometry={nodes.Flower009_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower009_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[-1.25, -4.708, 0.988]}
          rotation={[-0.366, 0.546, -1.797]}
          scale={[0.146, 0.217, 0.052]}
        >
          <mesh
            geometry={nodes.Flower010_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower010_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.582, 4.487, 1.302]}
          rotation={[-0.596, -0.268, -0.49]}
          scale={[0.146, 0.217, 0.052]}
        >
          <mesh
            geometry={nodes.Flower011_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower011_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.847, 4.068, 1.767]}
          rotation={[-0.024, -0.479, -0.258]}
          scale={[0.083, 0.123, 0.029]}
        >
          <mesh
            geometry={nodes.Flower012_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower012_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.662, 3.892, 0.112]}
          rotation={[0.103, -0.469, 0.018]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower013_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower013_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower013_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.809, 4.6, 1.953]}
          rotation={[-0.475, -0.068, -1.645]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower014_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower014_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower014_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[5.067, 4.33, 0.868]}
          rotation={[-0.256, 0.41, -2.766]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower015_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower015_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower015_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.736, 4.113, 0.316]}
          rotation={[-0.387, -0.291, -1.165]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower016_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower016_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower016_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.823, 4.217, 2.068]}
          rotation={[0.248, 0.037, -1.295]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower017_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower017_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[5.025, 3.402, 2.068]}
          rotation={[-0.015, 0.25, 0.191]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower018_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower018_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[5.121, 3.305, 0.316]}
          rotation={[0.277, -0.396, 0.429]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower019_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower019_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower019_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.935, 3.655, 0.868]}
          rotation={[-0.44, -0.197, -1.384]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower020_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower020_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower020_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.642, 3.422, 1.953]}
          rotation={[0.03, -0.479, -0.142]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower021_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower021_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower021_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[5.334, 3.212, 0.112]}
          rotation={[0.477, 0.05, 1.462]}
          scale={[0.112, 0.166, 0.04]}
        >
          <mesh
            geometry={nodes.Flower022_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower022_1.geometry}
            material={materials.Grass}
          />
          <mesh
            geometry={nodes.Flower022_2.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[5.175, 3.412, 1.767]}
          rotation={[0.476, -0.063, 1.243]}
          scale={[0.083, 0.123, 0.029]}
        >
          <mesh
            geometry={nodes.Flower023_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower023_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <group
          position={[4.734, 3.186, 1.302]}
          rotation={[0.263, -0.598, 1.154]}
          scale={[0.146, 0.217, 0.052]}
        >
          <mesh
            geometry={nodes.Flower024_0.geometry}
            material={materials.WhiteLeaf}
          />
          <mesh
            geometry={nodes.Flower024_1.geometry}
            material={materials.RedDot}
          />
        </group>
        <mesh
          geometry={nodes.Cylinder_0.geometry}
          material={materials.TreeBark}
          position={[7.622, 6.447, -0.747]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Icosphere_0.geometry}
          material={materials.Rock}
          position={[0.571, 1.119, 0.631]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Icosphere001_0.geometry}
          material={materials.Rock}
          position={[-1.49, -0.51, 0.805]}
          rotation={[0, 0, -2.914]}
          scale={0.337}
        />
        <mesh
          geometry={nodes.Icosphere002_0.geometry}
          material={materials.Rock}
          position={[0.093, -6.172, 0.804]}
        />
        <mesh
          geometry={nodes.Icosphere003_0.geometry}
          material={materials.Rock}
          position={[-2.965, 1.631, 0.224]}
          rotation={[0, 0, -1.35]}
          scale={0.154}
        />
        <mesh
          geometry={nodes.Icosphere004_0.geometry}
          material={materials.Rock}
          position={[6.351, -3.048, 0.794]}
        />
        <mesh
          geometry={nodes.Icosphere005_0.geometry}
          material={materials.Rock}
          position={[-0.616, 2.367, 0.359]}
          rotation={[-0.996, -0.581, -0.906]}
          scale={0.658}
        />
        <mesh
          geometry={nodes.Icosphere006_0.geometry}
          material={materials.Rock}
          position={[4.031, -4.422, 0.794]}
        />
        <mesh
          geometry={nodes.Icosphere007_0.geometry}
          material={materials.Rock}
          position={[0.211, 2.128, 0.702]}
          rotation={[0, 0, -2.247]}
          scale={0.389}
        />
        <mesh
          geometry={nodes.Icosphere008_0.geometry}
          material={materials.Rock}
          position={[2.719, -6.317, 0.814]}
          rotation={[0, 0, -2.124]}
        />
        <mesh
          geometry={nodes.Icosphere009_0.geometry}
          material={materials.Rock}
          position={[0.325, 0.828, 0.499]}
          rotation={[2.147, -1.561, 2.816]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Icosphere010_0.geometry}
          material={materials.Rock}
          position={[0.745, 0.49, 0.623]}
          rotation={[0.328, -0.125, -1.695]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Icosphere011_0.geometry}
          material={materials.Rock}
          position={[-5.338, 5.981, 0.679]}
          rotation={[2.92, -0.007, 1.765]}
          scale={0.571}
        />
        <mesh
          geometry={nodes.Icosphere012_0.geometry}
          material={materials.Rock}
          position={[1.132, -5.151, 0.476]}
          scale={0.571}
        />
        <mesh
          geometry={nodes.Icosphere013_0.geometry}
          material={materials.Rock}
          position={[5.955, -5.968, 0.794]}
        />
        <mesh
          geometry={nodes.Icosphere014_0.geometry}
          material={materials.Rock}
          position={[-2.325, 1.825, 0.526]}
          rotation={[-1.651, -1.169, -0.002]}
          scale={0.389}
        />
        <mesh
          geometry={nodes.Icosphere015_0.geometry}
          material={materials.Rock}
          position={[-2.511, 1.347, 0.794]}
          rotation={[0, 0, -0.416]}
          scale={0.424}
        />
        <mesh
          geometry={nodes.Icosphere016_0.geometry}
          material={materials.Rock}
          position={[-1.427, -6.911, 0.795]}
          rotation={[0, 0, 1.926]}
        />
        <mesh
          geometry={nodes.Icosphere017_0.geometry}
          material={materials.Rock}
          position={[-2.329, 2.478, 0.05]}
          rotation={[-1.287, -0.588, -2.078]}
          scale={0.456}
        />
        <mesh
          geometry={nodes.Icosphere018_0.geometry}
          material={materials.Rock}
          position={[-2.072, -0.271, 0.599]}
          rotation={[0, 0, -0.827]}
          scale={0.257}
        />
        <mesh
          geometry={nodes.Icosphere019_0.geometry}
          material={materials.Rock}
          position={[-2.568, -0.179, 0.51]}
          rotation={[1.578, -0.738, 2.244]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Icosphere020_0.geometry}
          material={materials.Rock}
          position={[-1.974, -0.055, 0.589]}
          rotation={[3.105, -0.65, 2.81]}
          scale={0.389}
        />
        <mesh
          geometry={nodes.Icosphere021_0.geometry}
          material={materials.Rock}
          position={[0.121, -0.035, 0.804]}
          rotation={[3.132, -0.616, 3.125]}
          scale={0.323}
        />
        <mesh
          geometry={nodes.Icosphere022_0.geometry}
          material={materials.Rock}
          position={[-0.645, -0.783, 0.766]}
          rotation={[0, 0, -0.059]}
          scale={[0.386, 0.386, 0.697]}
        />
        <mesh
          geometry={nodes.Icosphere023_0.geometry}
          material={materials.Rock}
          position={[-1.675, 3.001, 0.766]}
          rotation={[0, 0, -2.392]}
          scale={[0.386, 0.386, 0.697]}
        />
        <mesh
          geometry={nodes.Icosphere024_0.geometry}
          material={materials.Rock}
          position={[-2.449, 0.418, 0.05]}
          rotation={[0.04, 1.336, 2.434]}
          scale={0.389}
        />
        <mesh
          geometry={nodes.Icosphere025_0.geometry}
          material={materials.Rock}
          position={[-2.753, 0.695, 0.181]}
          rotation={[-0.599, -1.212, -1.547]}
          scale={0.306}
        />
        <mesh
          geometry={nodes.Icosphere026_0.geometry}
          material={materials.Rock}
          position={[-0.115, 2.72, 0.097]}
          rotation={[-1.269, -0.673, -2.046]}
          scale={0.389}
        />
        <mesh
          geometry={nodes.NurbsPath_0.geometry}
          material={materials.DarkTreeBark}
          position={[2.331, -0.236, 0.748]}
        />
        <mesh
          geometry={nodes.NurbsPath001_0.geometry}
          material={materials.DarkTreeBark}
          position={[3.315, 3.019, 1.169]}
          rotation={[0, 0, 3.078]}
        />
        <mesh
          geometry={nodes.Mball006_0.geometry}
          material={materials["Leafes.001"]}
          position={[5.068, 0.627, 7.661]}
          scale={[1, 1, 0.436]}
        />
        <mesh
          geometry={nodes.Icosphere027_0.geometry}
          material={materials.Rock}
          position={[8.012, -6.83, 0.876]}
          rotation={[0, 0, 2.696]}
          scale={1.992}
        />
        <mesh
          geometry={nodes.Icosphere028_0.geometry}
          material={materials.Rock}
          position={[1.504, -9.128, 0.258]}
          rotation={[0.166, 0.445, 1.288]}
          scale={[1.07, 1.389, 2.636]}
        />
        <mesh
          geometry={nodes.Cylinder001_0.geometry}
          material={materials.TreeBark}
          position={[5.683, 4.262, -0.383]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder002_0.geometry}
          material={materials.TreeBark}
          position={[6.871, 7.448, -4.295]}
          rotation={[0, 0, -2.553]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder003_0.geometry}
          material={materials.TreeBark}
          position={[8.641, 5.556, 16.167]}
          rotation={[Math.PI, 0, 0.822]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder004_0.geometry}
          material={materials.TreeBark}
          position={[8.571, 2.481, -4.865]}
          rotation={[0, 0, 1.953]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder005_0.geometry}
          material={materials.TreeBark}
          position={[8.368, 7.446, -4.295]}
          rotation={[0, 0, -0.574]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Mball011_0.geometry}
          material={materials.Leafes}
          position={[10.277, 5.961, 12.721]}
          scale={[1.466, 1.466, 2.368]}
        />
        <mesh
          geometry={nodes.Mball000_0.geometry}
          material={materials.Leafes}
          position={[10.277, 5.961, 12.721]}
          scale={[1.466, 1.466, 2.368]}
        />
        <mesh
          geometry={nodes.Cylinder006_0.geometry}
          material={materials.TreeBark}
          position={[-8.992, -5.408, -3.907]}
          rotation={[0, 0, 0.485]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder007_0.geometry}
          material={materials.TreeBark}
          position={[-3.023, -8.424, -4.478]}
          rotation={[0, 0, 3.012]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder008_0.geometry}
          material={materials.TreeBark}
          position={[-1.81, -5.403, 11.841]}
          rotation={[Math.PI, 0, 1.565]}
          scale={0.348}
        />
        <mesh
          geometry={nodes.Cylinder009_0.geometry}
          material={materials.TreeBark}
          position={[-7.473, -8.315, -0.383]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder010_0.geometry}
          material={materials.TreeBark}
          position={[-4.827, -8.694, -4.865]}
          rotation={[0, 0, 1.953]}
          scale={0.652}
        />
        <mesh
          geometry={nodes.Cylinder011_0.geometry}
          material={materials.TreeBark}
          position={[0.319, -5.396, -4.478]}
          rotation={[0, 0, 1.426]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder012_0.geometry}
          material={materials.TreeBark}
          position={[-4.379, -6.298, 16.723]}
          rotation={[-Math.PI, 0, 3.012]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Cylinder013_0.geometry}
          material={materials.TreeBark}
          position={[-6.391, -6.918, 16.554]}
          rotation={[-Math.PI, 0, -0.237]}
          scale={0.464}
        />
        <mesh
          geometry={nodes.Mball010_0.geometry}
          material={materials.Leafes}
          position={[0.228, -5.336, 14.851]}
          scale={[1.844, 1.844, 3.122]}
        />
        <mesh
          geometry={nodes.Icosphere029_0.geometry}
          material={materials.Rock}
          position={[-0.486, -5.353, 0.476]}
          rotation={[-1.185, 0.587, 0.058]}
          scale={0.571}
        />
        <mesh
          geometry={nodes.NurbsPath004_0.geometry}
          material={materials.LightWood}
          position={[-1.237, 1.393, 2.609]}
          rotation={[0, 0, -1.341]}
          scale={[1.054, 1.003, 1]}
        />
        <mesh
          geometry={nodes.NurbsPath005_0.geometry}
          material={materials.LightWood}
          position={[-0.826, 1.247, 2.654]}
          rotation={[0, 0, 1.728]}
          scale={[1.054, 1.003, 1]}
        />
        <mesh
          geometry={nodes.Circle_0.geometry}
          material={materials.Metal}
          position={[-1.097, 1.07, 2.208]}
          scale={[0.346, 0.346, 0.397]}
        />
        <mesh
          geometry={nodes.Mball018_0.geometry}
          material={materials.Fire}
          position={[-1.208, 1.422, 0.738]}
          scale={[0.2, 0.2, 0.565]}
        />
        <mesh
          geometry={nodes.Cube002_0.geometry}
          material={materials.Grass}
          position={[2.094, 3.155, 0.712]}
          scale={1.534}
        />
        <mesh
          geometry={nodes.Cube004_0.geometry}
          material={materials.Grass}
          position={[0.52, 7.103, 0.507]}
          rotation={[0, 0, -1.588]}
          scale={1.534}
        />
        <mesh
          geometry={nodes.Cube003_0.geometry}
          material={materials.Grass}
          position={[-0.458, 7.301, 0.265]}
          rotation={[0, 0, -1.588]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube005_0.geometry}
          material={materials.Grass}
          position={[-2.269, 7.436, 0.252]}
          rotation={[0, 0, 1.343]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube006_0.geometry}
          material={materials.Grass}
          position={[-2.49, 7.652, 0.843]}
          rotation={[0, 0, -0.603]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube007_0.geometry}
          material={materials.Grass}
          position={[-3.701, 6.611, 1.069]}
          rotation={[0, 0, 2.749]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube009_0.geometry}
          material={materials.Grass}
          position={[-3.711, 4.61, 0.616]}
          rotation={[0, 0, 2.836]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube010_0.geometry}
          material={materials.Grass}
          position={[-4.212, 7.007, 0.18]}
          rotation={[0, 0, 2.749]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube012_0.geometry}
          material={materials.Grass}
          position={[-3.822, 4.526, 0.18]}
          rotation={[0, 0, -1.839]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube013_0.geometry}
          material={materials.Grass}
          position={[-6.007, 6.653, 0.18]}
          rotation={[0, 0, 1.645]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube014_0.geometry}
          material={materials.Grass}
          position={[-4.779, 5.388, 0]}
          rotation={[0, 0, 1.645]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube019_0.geometry}
          material={materials.Grass}
          position={[-5.935, 8.821, 0.18]}
          rotation={[0, 0, 0.469]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube021_0.geometry}
          material={materials.Grass}
          position={[-6.897, 8.625, 0.63]}
          rotation={[0, 0, -2.375]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube022_0.geometry}
          material={materials.Grass}
          position={[-6.567, 7.095, 0.843]}
          rotation={[0, 0, -2.883]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube024_0.geometry}
          material={materials.Grass}
          position={[-8.156, 5.78, 0.265]}
          rotation={[0, 0, 2.415]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube025_0.geometry}
          material={materials.Grass}
          position={[-8.943, 5.167, 0.507]}
          rotation={[0, 0, 2.415]}
          scale={1.534}
        />
        <mesh
          geometry={nodes.Cube032_0.geometry}
          material={materials.Grass}
          position={[-9.805, 7.768, 0.18]}
          rotation={[0, 0, 0.469]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube035_0.geometry}
          material={materials.Grass}
          position={[-8.906, 9.362, 0.18]}
          rotation={[0, 0, -0.635]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube015_0.geometry}
          material={materials.Grass}
          position={[-4.511, 7.822, 0.153]}
          rotation={[0, 0, 1.93]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube016_0.geometry}
          material={materials.Grass}
          position={[-2.363, 7.512, 0.153]}
          rotation={[0, 0, 3.105]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube017_0.geometry}
          material={materials.Grass}
          position={[-2.518, 9.335, 0.153]}
          rotation={[0, 0, -2.074]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube018_0.geometry}
          material={materials.Grass}
          position={[-6.077, 9.15, 0.18]}
          rotation={[0, 0, -1.165]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube020_0.geometry}
          material={materials.Grass}
          position={[-7.776, 5.585, 0.252]}
          rotation={[0, 0, -0.937]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube026_0.geometry}
          material={materials.Grass}
          position={[-4.723, 3.044, -0.022]}
          rotation={[0, 0, -1.839]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube027_0.geometry}
          material={materials.Grass}
          position={[-5.881, 4.001, -0.022]}
          rotation={[0, 0, -1.839]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube029_0.geometry}
          material={materials.Grass}
          position={[-7.531, 5.691, 1.015]}
          rotation={[0, 0, 1.289]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube030_0.geometry}
          material={materials.Grass}
          position={[-5.057, 2.625, 0.079]}
          rotation={[0, 0, 2.192]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Icosphere030_0.geometry}
          material={materials.Rock}
          position={[-6.743, 5.704, 1.089]}
          rotation={[1.238, 0.892, -2.184]}
          scale={[1.076, 1.171, 0.851]}
        />
        <mesh
          geometry={nodes.Cube011_0.geometry}
          material={materials.Grass}
          position={[-7.299, 2.225, -0.022]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube023_0.geometry}
          material={materials.Grass}
          position={[-6.46, 3.471, -0.022]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube028_0.geometry}
          material={materials.Grass}
          position={[-8.023, 4.223, 0.18]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube031_0.geometry}
          material={materials.Grass}
          position={[-6.482, 3.202, -0.155]}
          rotation={[-0.14, 0.223, -2.13]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube033_0.geometry}
          material={materials.Grass}
          position={[-6.954, 1.66, -0.155]}
          rotation={[-0.14, 0.223, -2.13]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube034_0.geometry}
          material={materials.Grass}
          position={[-8.496, 2.681, 0.18]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube036_0.geometry}
          material={materials.Grass}
          position={[-6.932, 1.929, -0.022]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube037_0.geometry}
          material={materials.Grass}
          position={[-7.772, 0.683, -0.022]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube039_0.geometry}
          material={materials.Grass}
          position={[-9.004, 5.813, -0.022]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube038_0.geometry}
          material={materials.Grass}
          position={[-2.269, 7.436, 0.252]}
          rotation={[0, 0, 1.343]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube040_0.geometry}
          material={materials.Grass}
          position={[-0.95, 7.552, 0.183]}
          rotation={[0, 0, 1.343]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube041_0.geometry}
          material={materials.Grass}
          position={[-1.24, 9.715, 0.183]}
          rotation={[0, 0, -1.446]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube042_0.geometry}
          material={materials.Grass}
          position={[0.347, 7.066, -0.06]}
          rotation={[0, 0, 1.343]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube043_0.geometry}
          material={materials.Grass}
          position={[1.235, 6.662, 0.227]}
          rotation={[0, 0, -0.151]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube044_0.geometry}
          material={materials.Grass}
          position={[-2.551, 7.048, 0.857]}
          rotation={[0, 0, 2.749]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube045_0.geometry}
          material={materials.Grass}
          position={[1.067, -3.641, 0.543]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube046_0.geometry}
          material={materials.Grass}
          position={[1.575, -4.09, -0.022]}
          rotation={[0, 0, 2.858]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube047_0.geometry}
          material={materials.Grass}
          position={[1.584, -4.042, 0.18]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube048_0.geometry}
          material={materials.Grass}
          position={[0.123, -3.962, 0.18]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube049_0.geometry}
          material={materials.Grass}
          position={[2.538, -3.88, 0.19]}
          rotation={[0, 0, 1.65]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube050_0.geometry}
          material={materials.Grass}
          position={[2.958, -0.323, -0.022]}
          rotation={[0, 0, -1.839]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube051_0.geometry}
          material={materials.Grass}
          position={[-6.999, 8.872, 1.069]}
          rotation={[0, 0, 2.749]}
          scale={[2.137, 2.137, 5.116]}
        />
        <mesh
          geometry={nodes.Cube052_0.geometry}
          material={materials.Grass}
          position={[-6.647, 7.947, 1.069]}
          rotation={[0, 0, 1.395]}
          scale={[2.137, 2.137, 5.116]}
        />
        <mesh
          geometry={nodes.Cube053_0.geometry}
          material={materials.Grass}
          position={[-8.471, 9.032, 1.069]}
          rotation={[0, 0, 0.978]}
          scale={[2.137, 2.137, 5.116]}
        />
        <mesh
          geometry={nodes.Cube054_0.geometry}
          material={materials.Grass}
          position={[-1.539, 5.931, 0.227]}
          rotation={[0, 0, -2.544]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube055_0.geometry}
          material={materials.Grass}
          position={[-0.613, 6.238, -0.06]}
          rotation={[0, 0, -1.051]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube056_0.geometry}
          material={materials.Grass}
          position={[-4.446, 1.852, 0.327]}
          rotation={[0, 0, -1.051]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube057_0.geometry}
          material={materials.Grass}
          position={[-4.382, 2.781, 0.227]}
          rotation={[0, 0, -2.544]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Icosphere041_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.366, -0.713, 2.017]}
          rotation={[0.741, 0.51, -1.538]}
          scale={[0.073, 0.109, 0.026]}
        />
        <mesh
          geometry={nodes.Icosphere043_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.198, -0.149, 2.89]}
          rotation={[-0.416, 0.291, -0.583]}
          scale={[0.052, 0.077, 0.019]}
        />
        <mesh
          geometry={nodes.Icosphere044_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.032, 0.007, 2.66]}
          rotation={[-1.191, 0.108, -0.998]}
          scale={[0.04, 0.06, 0.014]}
        />
        <mesh
          geometry={nodes.Icosphere042_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.437, -0.713, 1.635]}
          rotation={[2.77, 0.336, 1.226]}
          scale={[0.048, 0.071, 0.017]}
        />
        <mesh
          geometry={nodes.Icosphere045_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.443, -0.733, 1.644]}
          rotation={[-0.665, -0.3, -1.209]}
          scale={[0.048, 0.071, 0.017]}
        />
        <mesh
          geometry={nodes.Cube008_0.geometry}
          material={materials.Grass}
          position={[-3.436, 6.405, 0.63]}
          rotation={[0, 0, -0.095]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Icosphere047_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.155, -0.023, 2.789]}
          rotation={[-0.353, -0.51, 2.393]}
          scale={[0.054, 0.08, 0.019]}
        />
        <mesh
          geometry={nodes.DirtPile_0.geometry}
          material={materials.Dirt}
          position={[-5.695, -4.885, 0.457]}
          rotation={[0, 0, -1.022]}
          scale={0.359}
        />
        <mesh
          geometry={nodes.Icosphere049_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.446, -0.706, 1.641]}
          rotation={[-0.142, -0.24, -2.043]}
          scale={[0.036, 0.054, 0.013]}
        />
        <mesh
          geometry={nodes.Icosphere050_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.437, -0.772, 1.702]}
          rotation={[-0.793, -0.265, 1.53]}
          scale={[0.039, 0.058, 0.014]}
        />
        <mesh
          geometry={nodes.NurbsPath008_0.geometry}
          material={materials.LightWood}
          position={[-1.665, 0.535, 1.436]}
          rotation={[0.877, -0.341, -1.883]}
        />
        <mesh
          geometry={nodes.NurbsPath009_0.geometry}
          material={materials.LightWood}
          position={[-1.571, 1.493, 1.486]}
          rotation={[-0.308, -0.886, 2.711]}
        />
        <mesh
          geometry={nodes.NurbsPath010_0.geometry}
          material={materials.LightWood}
          position={[-1.629, 1.211, 1.105]}
          rotation={[0.344, -1.235, -1.982]}
        />
        <mesh
          geometry={nodes.NurbsPath011_0.geometry}
          material={materials.LightWood}
          position={[-1.328, 1.379, 1.088]}
          rotation={[-0.424, 1.223, 1.246]}
        />
        <mesh
          geometry={nodes.NurbsPath012_0.geometry}
          material={materials.LightWood}
          position={[-0.885, 0.91, 1.025]}
          rotation={[0.271, 0.895, -0.383]}
        />
        <mesh
          geometry={nodes.NurbsPath013_0.geometry}
          material={materials.LightWood}
          position={[-1.237, 1.651, 0.976]}
          rotation={[-0.884, 0.317, 1.28]}
        />
        <mesh
          geometry={nodes.NurbsPath014_0.geometry}
          material={materials.LightWood}
          position={[-1.244, 0.946, 1.219]}
          rotation={[-0.884, 0.317, 1.28]}
        />
        <mesh
          geometry={nodes.Rope_0.geometry}
          material={materials.Rope}
          position={[-5.987, -4.226, 2.399]}
        />
        <mesh
          geometry={nodes.DirtPile002_0.geometry}
          material={materials.Dirt}
          position={[-7.053, -1.151, 0.312]}
          rotation={[-3.03, 0, -0.378]}
          scale={0.359}
        />
        <mesh
          geometry={nodes.DirtPile001_0.geometry}
          material={materials.Dirt}
          position={[-4.188, -4.402, -0.037]}
          rotation={[2.201, -0.828, -0.749]}
          scale={0.359}
        />
        <mesh
          geometry={nodes.Icosphere051_0.geometry}
          material={materials.Dirt}
          position={[-4.349, -3.444, 0.623]}
          rotation={[0.328, -0.125, -1.695]}
          scale={0.188}
        />
        <mesh
          geometry={nodes.Icosphere052_0.geometry}
          material={materials.Dirt}
          position={[-3.42, -4.662, 0.499]}
          rotation={[2.147, -1.561, 2.816]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Icosphere053_0.geometry}
          material={materials.Dirt}
          position={[-5.026, -3.761, 0.631]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Icosphere054_0.geometry}
          material={materials.Dirt}
          position={[-4.582, -3.956, 0.623]}
          rotation={[-1.035, 0.148, -1.084]}
          scale={0.188}
        />
        <mesh
          geometry={nodes.Icosphere055_0.geometry}
          material={materials.Rock}
          position={[-7.898, -0.858, 0.726]}
          rotation={[0.044, 0.183, -1.045]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Cube060_0.geometry}
          material={materials.Grass}
          position={[-2, -4.673, 0.163]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Icosphere046_0.geometry}
          material={materials["Leafes.001"]}
          position={[3.439, -0.666, 1.627]}
          rotation={[3.079, -0.132, 0.148]}
          scale={[0.048, 0.071, 0.017]}
        />
        <mesh
          geometry={nodes.Cube061_0.geometry}
          material={materials.Grass}
          position={[3.582, 3.588, 0.227]}
          rotation={[0, 0, -0.151]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube062_0.geometry}
          material={materials.Grass}
          position={[4.489, 3.743, 0.477]}
          rotation={[0, 0, 1.323]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube063_0.geometry}
          material={materials.Grass}
          position={[5.467, 3.026, 0.477]}
          rotation={[0, 0, 2.803]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Circle002_0.geometry}
          material={materials.Mushroom}
          position={[4.826, -2.155, 0.525]}
          rotation={[0, 0, 0.445]}
        />
        <mesh
          geometry={nodes.Circle004_0.geometry}
          material={materials.Mushroom}
          position={[4.644, -2.242, 0.525]}
          rotation={[0, 0, 0.445]}
        />
        <mesh
          geometry={nodes.Circle005_0.geometry}
          material={materials.Mushroom}
          position={[4.855, -2.335, 0.514]}
          rotation={[0, 0, 2.509]}
        />
        <mesh
          geometry={nodes.Circle006_0.geometry}
          material={materials.Mushroom}
          position={[2.498, -0.166, 0.514]}
          rotation={[0, 0, 2.509]}
        />
        <mesh
          geometry={nodes.Circle007_0.geometry}
          material={materials.Mushroom}
          position={[2.385, -0.173, 0.525]}
          rotation={[0, 0, 0.445]}
          scale={0.717}
        />
        <mesh
          geometry={nodes.Circle008_0.geometry}
          material={materials.Mushroom}
          position={[3.553, 2.194, 0.525]}
          rotation={[0, 0, -2.894]}
        />
        <mesh
          geometry={nodes.Circle009_0.geometry}
          material={materials.Mushroom}
          position={[2.574, -0.094, 0.66]}
          rotation={[0, 0, -1.698]}
          scale={0.72}
        />
        <mesh
          geometry={nodes.Circle010_0.geometry}
          material={materials.Mushroom}
          position={[2.472, -0.118, 0.573]}
          rotation={[-0.11, 0.269, 0.03]}
          scale={0.558}
        />
        <mesh
          geometry={nodes.Circle011_0.geometry}
          material={materials.Mushroom}
          position={[-5.551, 6.34, 0.525]}
          rotation={[0, 0, 0.445]}
          scale={1.329}
        />
        <mesh
          geometry={nodes.Cube064_0.geometry}
          material={materials.Grass}
          position={[6.112, 5.834, -0.022]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube065_0.geometry}
          material={materials.Grass}
          position={[6.951, 7.08, -0.022]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube066_0.geometry}
          material={materials.Grass}
          position={[6.929, 6.81, -0.155]}
          rotation={[-0.14, 0.223, -2.13]}
          scale={2.137}
        />
        <mesh
          geometry={nodes.Cube067_0.geometry}
          material={materials.Grass}
          position={[6.584, 7.376, -0.022]}
          rotation={[0, 0, -0.171]}
          scale={2.137}
        />
      </group>
    </group>
  );
}

useGLTF.preload("forest/forest.gltf");

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 forest.gltf 
Author: Minzkraut (https://sketchfab.com/Minzkraut)
License: CC-BY-NC-SA-4.0 (http://creativecommons.org/licenses/by-nc-sa/4.0/)
Source: https://sketchfab.com/3d-models/low-poly-forest-campfire-updated-af086b62a4c84ea89eda895b23d64813
Title: Low Poly Forest Campfire [Updated]
*/
