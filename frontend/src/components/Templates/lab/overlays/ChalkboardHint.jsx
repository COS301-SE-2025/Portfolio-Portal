import React, { useEffect, useState } from "react";
import { Html } from "@react-three/drei";

export default function ChalkboardHint({
  anchor = [0, 1.55, -3],
  text = "Click me",
  autoHideMs = 0,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoHideMs) return;
    const t = setTimeout(() => setVisible(false), autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs]);

  if (!visible) return null;

  return (
    <Html
      transform={false}
      position={anchor}
      zIndexRange={[150, 0]}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          userSelect: "none",
        }}
      >
        {/* Label */}
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.85)",
            color: "white",
            fontWeight: 700,
            letterSpacing: ".02em",
            fontSize: "clamp(12px, 1.6vmin, 16px)",
            boxShadow: "0 6px 16px rgba(0,0,0,.4)",
            animation: "cm_pulse 1.3s ease-in-out infinite",
          }}
        >
          {text}
        </div>

        {/* Curved arrow pointing right-ish (towards the board) */}
        <svg
          width="140"
          height="70"
          viewBox="0 0 140 70"
          style={{
            transform: "rotate(-6deg)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,.4))",
          }}
        >
          <defs>
            <marker
              id="cm_head"
              markerWidth="12"
              markerHeight="12"
              refX="6"
              refY="6"
              orient="auto"
            >
              <path d="M0,0 L12,6 L0,12 Z" fill="#fff" />
            </marker>
          </defs>
          <path
            d="M5,55 Q80,10 130,28"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            markerEnd="url(#cm_head)"
            opacity="0.95"
          />
        </svg>
      </div>

      <style>{`
        @keyframes cm_pulse {
          0%   { transform: scale(1);    }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1);    }
        }
      `}</style>
    </Html>
  );
}
