import React from "react";
import { Html } from "@react-three/drei";

export default function ChalkboardOverlay({
  data,
  z = 0.028,
  width = 3.0,
  height = 1.8,
  onClose,
}) {
  const PX_WIDTH = 280;
  const PX_HEIGHT = Math.round(PX_WIDTH * (height / width));
  const PADDING = 10;

  return (
    <Html
      transform
      position={[0, 0, z]}
      distanceFactor={8}
      scale={0.45}
      style={{ pointerEvents: "auto" }}
    >
      <div
        onWheel={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose?.();
        }}
        tabIndex={0}
        style={{
          width: PX_WIDTH,
          maxHeight: PX_HEIGHT,
          overflowY: "auto",
          padding: PADDING,
          borderRadius: 6,
          background: "rgba(10, 60, 30, 0.18)",
          color: "#f5fbe9",
          lineHeight: 1.15,
          boxShadow: "0 3px 10px rgba(0,0,0,0.22)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 11,
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <button
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            alignSelf: "flex-start",
            marginBottom: 6,
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.85)",
            background: "rgba(0,0,0,0.55)",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: "20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
            backdropFilter: "blur(2px)",
            zIndex: 2,
          }}
        >
          X
        </button>

        <h2
          style={{
            margin: 0,
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {data?.user?.name || "Name"}
        </h2>

        {data?.user?.description && (
          <p
            style={{
              margin: "0 0 6px 0",
              opacity: 0.9,
              fontSize: 10,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            {data.user.description}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "2px 6px",
            marginBottom: 8,
            fontSize: 9,
          }}
        >
          <span style={{ opacity: 0.7, fontWeight: 600 }}>Email</span>
          <span style={{ fontSize: 8 }}>{data?.user?.email || "-"}</span>

          <span style={{ opacity: 0.7, fontWeight: 600 }}>Phone</span>
          <span style={{ fontSize: 8 }}>{data?.user?.phone || "-"}</span>

          <span style={{ opacity: 0.7, fontWeight: 600 }}>Address</span>
          <span style={{ fontSize: 8 }}>{data?.user?.address || "-"}</span>

          <span style={{ opacity: 0.7, fontWeight: 600 }}>LinkedIn</span>
          <span style={{ fontSize: 8, wordBreak: "break-all" }}>
            {data?.user?.linkedin || "-"}
          </span>

          <span style={{ opacity: 0.7, fontWeight: 600 }}>Website</span>
          <span style={{ fontSize: 8, wordBreak: "break-all" }}>
            {data?.user?.website || "-"}
          </span>
        </div>

        {data?.summary && (
          <>
            <h3
              style={{
                margin: "8px 0 4px 0",
                fontSize: 11,
                fontWeight: 600,
                borderBottom: "1px solid rgba(245, 251, 233, 0.3)",
                paddingBottom: 2,
              }}
            >
              Summary
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 9,
                lineHeight: 1.25,
                opacity: 0.95,
              }}
            >
              {data.summary}
            </p>
          </>
        )}
      </div>
    </Html>
  );
}
