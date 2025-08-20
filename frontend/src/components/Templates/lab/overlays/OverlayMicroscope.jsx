import React from "react";
import { Html } from "@react-three/drei";

export default function OverlayMicroscope({
  open,
  data,
  onClose,
  anchor = [1.25, 1.18, 0.15],
}) {
  if (!open) return null;

  const DIAM = "min(96vmin, 1100px)";

  return (
    <>
      <Html
        transform={false}
        position={anchor}
        zIndexRange={[500, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <div
          onWheel={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            transform: "translate(-50%, -50%)",
            width: DIAM,
            height: DIAM,
            borderRadius: "9999px",
            background:
              "radial-gradient(70% 70% at 50% 35%, #1b1d21 0%, #0b0c0f 60%)",
            backgroundColor: "#0b0c0f",
            border: "1px solid rgba(255,255,255,0.28)",
            boxShadow:
              "0 14px 36px rgba(0,0,0,0.6), inset 0 2px 6px rgba(255,255,255,0.06)",
            color: "white",
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "hidden",
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          }}
        >
          <div
            onWheel={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              inset: "12% 14% 14% 14%",
              borderRadius: 18,
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              padding: 0,
              boxSizing: "border-box",
              maxHeight: "76%",
              touchAction: "pan-y",
              lineHeight: 1.35,
              fontSize: "clamp(12px, 1.6vmin, 16px)",
              color: "rgba(255,255,255,0.96)",
              textShadow: "0 1px 2px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <section>
              <div
                style={{
                  fontSize: "clamp(13px, 1.8vmin, 17px)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  textAlign: "center",
                  opacity: 0.95,
                }}
              >
                Experience
              </div>
              <div style={{ height: 8 }} />
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: 12,
                }}
              >
                {(data?.experience || []).map((job, i) => {
                  const title = job.title || job.position || "";
                  const company = job.company || "";
                  const when =
                    job.duration ||
                    [job.start, job.end].filter(Boolean).join("–");
                  const summary = job.summary || job.description || "";
                  const skills = job.skills || [];

                  return (
                    <li key={i}>
                      <div style={{ fontWeight: 700 }}>
                        {title}
                        {title && company ? " — " : ""}
                        {company}
                      </div>
                      {!!when && <div style={{ opacity: 0.9 }}>{when}</div>}
                      {!!summary && (
                        <div style={{ opacity: 0.95 }}>{summary}</div>
                      )}
                      {!!skills.length && (
                        <div style={{ opacity: 0.8, fontSize: "0.95em" }}>
                          {skills.join(" · ")}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </Html>

      <Html
        transform={false}
        position={[anchor[0] - 0.9, anchor[1] + 0.5, anchor[2]]}
        zIndexRange={[1000, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <button
          aria-label="Close microscope overlay"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "2px solid #fff",
            background: "#000",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "24px",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
          }}
        >
          X
        </button>
      </Html>
    </>
  );
}
