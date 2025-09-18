import React, { useEffect, useMemo, useRef, useState } from "react";
import { useScroll, useCursor } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";

// Simplified models - in real implementation these would be actual 3D models
const Professor = ({ position, rotation, scale, visible }) => {
  if (!visible) return null;
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
  );
};

const Chalkboard = () => {
  return (
    <mesh>
      <planeGeometry args={[3, 1.8]} />
      <meshStandardMaterial color="#2d3748" />
    </mesh>
  );
};

const FlaskA = ({ scale }) => {
  return (
    <mesh scale={scale}>
      <cylinderGeometry args={[0.3, 0.3, 0.8]} />
      <meshStandardMaterial color="#4ade80" transparent opacity={0.7} />
    </mesh>
  );
};

const FlaskB = ({ scale }) => {
  return (
    <mesh scale={scale}>
      <cylinderGeometry args={[0.3, 0.3, 0.8]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.7} />
    </mesh>
  );
};

const MicroscopeModel = ({ scale }) => {
  return (
    <mesh scale={scale}>
      <boxGeometry args={[0.4, 0.6, 0.3]} />
      <meshStandardMaterial color="#6b7280" />
    </mesh>
  );
};

const Bench = ({ position, w, d, h }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#8b5cf6" />
    </mesh>
  );
};

const Bubbles = () => {
  return (
    <mesh>
      <sphereGeometry args={[0.05]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  );
};

const Room = ({ w, d, h }) => {
  return (
    <mesh>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#f3f4f6" wireframe />
    </mesh>
  );
};

// Simplified overlays
const ChalkboardOverlay = ({ data, onClose }) => {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '8px' }}>
      <h3>About Me</h3>
      <p>I'm a passionate scientist and researcher...</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const FlaskAOverlay = ({ open, data, onClose }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '8px' }}>
      <h3>Skills</h3>
      <p>React, JavaScript, Python, Data Analysis...</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const FlaskBOverlay = ({ open, data, onClose }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '8px' }}>
      <h3>Experience</h3>
      <p>Senior Developer at Tech Corp...</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const OverlayMicroscope = ({ open, data, onClose }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '8px' }}>
      <h3>Contact</h3>
      <p>Get in touch with me...</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const ChalkboardHint = ({ anchor, text }) => {
  return (
    <div style={{ position: 'absolute', top: '20%', left: '20%', background: 'yellow', padding: '10px', borderRadius: '4px' }}>
      {text}
    </div>
  );
};

const Explosion = ({ origin, key }) => {
  return (
    <mesh position={origin} key={key}>
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial color="#ff6b6b" />
    </mesh>
  );
};

// Lab state context
const LabContext = React.createContext();

export const LabProvider = ({ children }) => {
  const [selected, setSelected] = useState(null);
  const [explodeKey, setExplodeKey] = useState(0);
  const [data] = useState({
    name: "Dr. Alex Scientist",
    about: "Passionate researcher and developer",
    skills: ["React", "JavaScript", "Python", "Data Analysis"],
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Corp",
        duration: "2020-Present"
      }
    ],
    contact: {
      email: "alex@example.com",
      phone: "+1-234-567-8900"
    }
  });

  const value = {
    selected,
    setSelected,
    explodeKey,
    setExplodeKey,
    data
  };

  return (
    <LabContext.Provider value={value}>
      {children}
    </LabContext.Provider>
  );
};

export const useLabState = () => {
  const context = React.useContext(LabContext);
  if (!context) {
    throw new Error('useLabState must be used within a LabProvider');
  }
  return context;
};

export default function Scene({ controlsRef }) {
  const { selected, setSelected, explodeKey, data } = useLabState();
  const scroll = useScroll();

  const [showBoardHint, setShowBoardHint] = useState(true);
  const [explodeAt, setExplodeAt] = useState(null);
  const [hoverBoard, setHoverBoard] = useState(false);
  const [hoverA, setHoverA] = useState(false);
  const [hoverB, setHoverB] = useState(false);
  const [hoverMic, setHoverMic] = useState(false);

  const isIdle = !selected;
  useCursor(isIdle && (hoverBoard || hoverA || hoverB || hoverMic));
  const hideProfessor = selected === "board";

  useEffect(() => {
    if (!isIdle) {
      setHoverBoard(false);
      setHoverA(false);
      setHoverB(false);
      setHoverMic(false);
    }
  }, [isIdle]);

  const [flaskBPhase, setFlaskBPhase] = useState(0);
  const timers = useRef([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const flyToSteps = (steps, delay = 650) => {
    clearTimers();
    steps.forEach((s, i) => {
      const t = setTimeout(() => {
        controlsRef.current?.setLookAt(
          s.cam[0],
          s.cam[1],
          s.cam[2],
          s.look[0],
          s.look[1],
          s.look[2],
          true
        );
        setFlaskBPhase(i + 1);
      }, i * delay);
      timers.current.push(t);
    });
  };

  const focusFlaskB = () => {
    setSelected("flaskB");
    setFlaskBPhase(0);
    const p = POS.flaskB;

    // Step 1: move close to the beaker
    const step1 = { cam: p.cam, look: p.look };

    // Step 2: rise a bit and come forward
    const step2 = {
      cam: [p.cam[0] * 0.9, p.cam[1] + 0.22, p.cam[2] - 0.55],
      look: [p.look[0], p.look[1] + 0.1, p.look[2]],
    };

    // Step 3: peek inside the beaker, slightly above the liquid
    const step3 = {
      cam: [p.pos[0], p.pos[1] + 0.45, p.pos[2] + 0.15],
      look: [p.pos[0], p.pos[1] + 0.2, p.pos[2]],
    };

    flyToSteps([step1, step2, step3], 650);
  };

  useEffect(() => {
    const onScroll = () => {
      const t = scroll.offset;
      if (selected) return;
      const x = 3 - 4 * t;
      const y = 2;
      const z = 6 - 2 * t;
      controlsRef.current?.setLookAt(x, y, z, 0, 1, 0, true);
    };
    scroll.el?.addEventListener("scroll", onScroll);
    onScroll();
    return () => scroll.el?.removeEventListener("scroll", onScroll);
  }, [controlsRef, scroll, selected]);

  const flyTo = (pos = [0, 1.2, 2.6], look = [0, 0.8, 0]) => {
    controlsRef.current?.setLookAt(
      pos[0],
      pos[1],
      pos[2],
      look[0],
      look[1],
      look[2],
      true
    );
  };

  useEffect(() => {
    // Disable/enable controls based on selection
    if (controlsRef.current) {
      if (selected === "board") {
        const timer = setTimeout(() => {
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }
          if (scroll.el) {
            scroll.el.style.overflow = "hidden";
          }
        }, 1000);

        return () => clearTimeout(timer);
      } else if (selected === "flaskB") {
        const timer = setTimeout(() => {
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }
          if (scroll.el) {
            scroll.el.style.overflow = "hidden";
          }
        }, 2200);

        return () => clearTimeout(timer);
      } else {
        controlsRef.current.enabled = true;

        if (scroll.el) {
          scroll.el.style.overflow = "auto";
        }
      }
    }

    return () => {
      if (scroll.el) {
        scroll.el.style.overflow = "auto";
      }
    };
  }, [selected, controlsRef, scroll]);

  // Room & furniture dimensions
  const room = { w: 9, d: 6.5, h: 3.2 };
  const bench = { w: 2.8, d: 1.2, h: 0.92 };
  const topY = bench.h;
  const POS = useMemo(
    () => ({
      board: {
        pos: [0, 1.55, -room.d / 2 + 0.08],
        look: [0, 1.55, -room.d / 2 + 0.08],
        cam: [0, 1.7, -0.8],
      },
      bench: { pos: [0, 0, -0.2] },
      prof: { pos: [0, 0, -1.1] },
      flaskA: {
        pos: [-0.7, topY, 0.18],
        look: [-0.7, topY + 0.22, 0.18],
        cam: [-1.4, 1.25, 1.2],
      },
      flaskB: {
        pos: [0.7, topY, 0.18],
        look: [0.7, topY + 0.22, 0.18],
        cam: [1.4, 1.25, 1.2],
      },
      micro: {
        pos: [1.25, topY, 0.15],
        look: [1.25, topY + 0.3, 0.15],
        cam: [1.9, 1.2, 1.1],
      },
      towel: { pos: [0.0, topY + 0.03, 0.12] },
    }),
    [room.w, room.d, room.h, topY]
  );

  // Ground & counter
  return (
    <group>
      <Room w={room.w} d={room.d} h={room.h} />

      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
      >
        <planeGeometry args={[room.w, room.d]} />
        <meshStandardMaterial roughness={0.92} color="#eee" />
      </mesh>

      {/* Bench */}
      <Bench position={POS.bench.pos} w={bench.w} d={bench.d} h={bench.h} />

      {/* Chalkboard on the back wall */}
      <Select enabled={isIdle && hoverBoard}>
        <group
          position={POS.board.pos}
          onPointerOver={isIdle ? () => setHoverBoard(true) : undefined}
          onPointerOut={isIdle ? () => setHoverBoard(false) : undefined}
          onClick={(e) => {
            if (!isIdle) {
              e.stopPropagation();
              return;
            }
            setShowBoardHint(false);
            setSelected("board");
            flyTo(POS.board.cam, POS.board.look);
          }}
          raycast={isIdle ? undefined : () => null}
        >
          <Chalkboard />

          {selected === "board" && (
            <ChalkboardOverlay
              data={data}
              onClose={() => setSelected(null)}
            />
          )}
        </group>
      </Select>

      {/* Chalkboard hint (only when idle) */}
      {isIdle && showBoardHint && (
        <ChalkboardHint
          anchor={[
            POS.board.pos[0] - 2.55,
            POS.board.pos[1] + 0.5,
            POS.board.pos[2] + 0.22,
          ]}
          text="Click me"
        />
      )}

      {/* Professor, behind bench */}
      <Professor
        position={POS.prof.pos}
        rotation={[0, 1.5 * Math.PI, 0]}
        scale={0.18}
        visible={!hideProfessor}
      />

      {/* Flask A — on benchtop */}
      <Select enabled={isIdle && hoverA}>
        <group
          position={POS.flaskA.pos}
          onPointerOver={isIdle ? () => setHoverA(true) : undefined}
          onPointerOut={isIdle ? () => setHoverA(false) : undefined}
          onClick={(e) => {
            if (!isIdle) {
              e.stopPropagation();
              return;
            }
            setSelected("flaskA");
            setExplodeAt({
              pos: [
                POS.flaskA.pos[0],
                POS.flaskA.pos[1] + 0.2,
                POS.flaskA.pos[2],
              ],
              key: explodeKey + 1,
            });
            flyTo(POS.flaskA.cam, POS.flaskA.look);
          }}
          raycast={isIdle ? undefined : () => null}
        >
          <FlaskA scale={0.25} />
          <group position={[0, 0.45, 0]}>
            <Bubbles />
          </group>
        </group>
      </Select>
      {selected === "flaskA" && explodeAt && (
        <Explosion key={explodeAt.key} origin={explodeAt.pos} />
      )}
      {selected === "flaskA" && (
        <FlaskAOverlay
          open
          data={data}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Flask B — on benchtop */}
      <Select enabled={isIdle && hoverB}>
        <group
          position={POS.flaskB.pos}
          onPointerOver={isIdle ? () => setHoverB(true) : undefined}
          onPointerOut={isIdle ? () => setHoverB(false) : undefined}
          onClick={(e) => {
            if (!isIdle) {
              e.stopPropagation();
              return;
            }
            focusFlaskB();
          }}
          raycast={isIdle ? undefined : () => null}
        >
          <FlaskB scale={0.3} />
          <group position={[0, 0.45, 0]}>
            {!(selected === "flaskB" && flaskBPhase >= 3) && <Bubbles />}
          </group>
        </group>
      </Select>

      <FlaskBOverlay
        open={selected === "flaskB" && flaskBPhase >= 3}
        data={data}
        onClose={() => {
          setSelected(null);
          clearTimers();
        }}
      />

      {/* Microscope — on benchtop */}
      <Select enabled={isIdle && hoverMic}>
        <group
          position={POS.micro.pos}
          onPointerOver={isIdle ? () => setHoverMic(true) : undefined}
          onPointerOut={isIdle ? () => setHoverMic(false) : undefined}
          onClick={(e) => {
            if (!isIdle) {
              e.stopPropagation();
              return;
            }
            setSelected("microscope");
            flyTo(POS.micro.cam, POS.micro.look);
          }}
          raycast={isIdle ? undefined : () => null}
        >
          <MicroscopeModel scale={1} />
        </group>
      </Select>
      <OverlayMicroscope
        open={selected === "microscope"}
        data={data}
        onClose={() => setSelected(null)}
      />
    </group>
  );
}
