import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations, Center } from "@react-three/drei";

export default function Professor(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("/lab/proff/scene.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;
    const idle = actions.Idle || actions.idle || Object.values(actions)[0];
    idle?.reset()?.fadeIn?.(0.3)?.play?.();
    return () => idle?.fadeOut?.(0.2);
  }, [actions]);

  return (
    <group ref={group} {...props}>
      <Center top>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload("/lab/proff/scene.gltf");
