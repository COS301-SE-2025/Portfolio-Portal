import React, { useMemo } from "react";
import { useGLTF, Center } from "@react-three/drei";

const PATH = "/lab/microscope.glb";

export default function Microscope(props) {
  const { scene } = useGLTF(PATH);
  const clone = useMemo(() => scene.clone(true), [scene]);
  return (
    <Center top>
      <primitive object={clone} {...props} />
    </Center>
  );
}
useGLTF.preload(PATH);
