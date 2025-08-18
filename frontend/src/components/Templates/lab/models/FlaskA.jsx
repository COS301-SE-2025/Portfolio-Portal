import React, { useEffect, useMemo } from "react";
import { useGLTF, Center } from "@react-three/drei";

const PATH = "/lab/erl_blue.glb";

export default function FlaskA(props) {
  const { scene } = useGLTF(PATH);
  const root = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    root.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = o.receiveShadow = true;
      const tag = (o.material?.name || o.name || "").toLowerCase();
      if (tag.includes("glass")) {
        o.material.transparent = true;
        o.material.opacity = 0.25;
        o.material.roughness = 0.1;
        o.material.metalness = 0.0;
      }
      if (
        tag.includes("liquid") ||
        tag.includes("fluid") ||
        tag.includes("content")
      ) {
        o.material.transparent = true;
        o.material.opacity = 0.7;
        o.material.roughness = 0.3;
      }
    });
  }, [root]);

  return (
    <Center top>
      <primitive object={root} {...props} />
    </Center>
  );
}

useGLTF.preload(PATH);
