import React from "react";
import { Html } from "@react-three/drei";

export default function FlaskAOverlay({
  open,
  data,
  onClose,
  anchor = [-0.7, 0.92, 0.23],
  shiftY = 56,
}) {
  if (!open) return null;

  const W = "clamp(520px, 60vmin, 880px)";
  const H = "clamp(380px, 68vmin, 760px)";

  const panelStyle = {
    transform: `translate(-50%, calc(-50% + ${shiftY}px))`,
    width: W,
    height: H,
    borderRadius: 16,
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "hidden",
    color: "white",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    opacity: 0,
    animation: `fa_pop .32s ease-out 140ms forwards`,
    boxShadow:
      "0 20px 40px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.35)",
    background: "#121317",
  };

  const noiseLayer = {
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(rgba(255,255,255,.035) 1px, transparent 1px) 0 0/3px 3px," +
      "linear-gradient(155deg, rgba(255,255,255,.02), rgba(0,0,0,.08))",
    mixBlendMode: "overlay",
    opacity: 0.9,
  };

  const splatterMask = {
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    WebkitMaskImage:
      "radial-gradient(120px 120px at 12% 8%, black 55%, transparent 66%)," +
      "radial-gradient(100px 100px at 88% 18%, black 55%, transparent 70%)," +
      "radial-gradient(140px 140px at 18% 88%, black 55%, transparent 66%)," +
      "radial-gradient(120px 120px at 82% 86%, black 55%, transparent 68%)," +
      "radial-gradient(60px 60px at 50% 50%, black 55%, transparent 70%)," +
      "radial-gradient(40px 40px at 70% 58%, black 55%, transparent 72%)",
    WebkitMaskComposite: "source-in",
    maskComposite: "exclude",
    background: "rgba(0,0,0,.0)",
  };

  const contentScroll = {
    position: "absolute",
    inset: 18,
    borderRadius: 10,
    overflowY: "auto",
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
    padding: "12px 16px",
    boxSizing: "border-box",
    maxHeight: "calc(100% - 36px)",
    lineHeight: 1.35,
    fontSize: "clamp(12px, 1.45vmin, 14px)",
    color: "rgba(255,255,255,0.96)",
    textShadow: "0 1px 2px rgba(0,0,0,0.18)",
    backdropFilter: "blur(1px)",
  };

  const sectionTitle = {
    fontSize: "clamp(12px, 1.55vmin, 15px)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: ".06em",
    textAlign: "center",
    opacity: 0.95,
    margin: "0 0 6px 0",
  };

  const divider = {
    height: 1,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.32) 12%, rgba(255,255,255,.32) 88%, rgba(255,255,255,0) 100%)",
    opacity: 0.8,
    margin: "10px 0",
  };

  return (
    <>
      <Html
        transform={false}
        position={anchor}
        zIndexRange={[600, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <div style={panelStyle} onWheel={(e) => e.stopPropagation()}>
          <div style={noiseLayer} />
          <div style={splatterMask} />

          <div style={contentScroll} onWheel={(e) => e.stopPropagation()}>
            <div style={sectionTitle}>Skills</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {(data?.skills || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <div style={divider} />

            <div style={sectionTitle}>Certifications</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {(data?.certifications || []).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <div style={divider} />

            <div style={sectionTitle}>Languages</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {(data?.languages || []).map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>

          <style>{`
          @keyframes fa_pop {
            from { transform: translate(-50%, calc(-50% + ${shiftY}px)) scale(.55) rotate(-2deg); opacity: 0; }
            to   { transform: translate(-50%, calc(-50% + ${shiftY}px)) scale(1)  rotate(0deg);  opacity: 1; }
          }
        `}</style>
        </div>
      </Html>

      <Html
        transform={false}
        position={[anchor[0] - 0.36, anchor[1] + 0.17, anchor[2]]}
        zIndexRange={[200, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,1)",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
            userSelect: "none",
          }}
        >
          X
        </button>
      </Html>
    </>
  );
}
