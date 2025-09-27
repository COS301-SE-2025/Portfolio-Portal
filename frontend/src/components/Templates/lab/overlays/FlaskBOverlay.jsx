import React from "react";
import { Html } from "@react-three/drei";

export default function FlaskBOverlay({
  open,
  data,
  onClose,
  anchor = [0.75, 1.16, 0.18],
}) {
  if (!open) return null;

  const DIAM = "min(95vmin, 5000px)";

  return (
    <>
      <Html
        transform={false}
        position={anchor}
        zIndexRange={[100, 0]}
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
              "radial-gradient(60% 60% at 50% 35%, rgba(255,255,255,0.22), rgba(255,255,255,0) 60%)," +
              "linear-gradient(180deg, rgba(238,85,160,0.70), rgba(238,85,160,0.54))",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow:
              "0 10px 28px rgba(0,0,0,0.32), inset 0 -18px 30px rgba(0,0,0,0.18), inset 0 8px 16px rgba(255,255,255,0.20)",
            backdropFilter: "blur(1.5px)",
            overflow: "hidden",
            color: "white",
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "12% 14% 16% 14%",
              borderRadius: 18,
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              padding: 0,
              boxSizing: "border-box",
              maxHeight: "76%",
              touchAction: "pan-y",
              color: "rgba(255,255,255,0.96)",
              textAlign: "left",
              lineHeight: 1.35,
              fontSize: "clamp(11px, 1.55vmin, 14px)",
              textShadow: "0 1px 2px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
            onWheel={(e) => e.stopPropagation()}
          >
            <section>
              <div style={titleStyle}>Education</div>
              <div style={{ height: 8 }} />
              <ul style={ulStyle}>
                {(data?.education || []).map((e, i) => {
                  if (typeof e === "string") {
                    return <li key={i}>{e}</li>;
                  }

                  const degreeField = [e.degree, e.field]
                    .filter(Boolean)
                    .join(" ");
                  const inst = e.institution || "";
                  const year = e.year || e.endDate || "";
                  const gpa = e.gpa;

                  return (
                    <li key={i}>
                      {degreeField ? (
                        <div style={{ fontWeight: 700 }}>{degreeField}</div>
                      ) : null}

                      {inst || year ? (
                        <div style={{ opacity: 0.95 }}>
                          {inst}
                          {year ? (
                            <span style={{ opacity: 0.8 }}> ({year})</span>
                          ) : null}
                        </div>
                      ) : null}

                      {gpa ? (
                        <div style={{ opacity: 0.8, fontSize: "0.95em" }}>
                          GPA {gpa}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>

            <div style={dividerStyle} />

            <section>
              <div style={titleStyle}>Projects</div>
              <div style={{ height: 8 }} />
              <ul style={ulStyleProjects}>
                {(data?.projects || []).map((p, i) => (
                  <li key={i}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ opacity: 0.95 }}>{p.description}</div>
                    {!!p?.technologies?.length && (
                      <div style={{ opacity: 0.8, fontSize: "0.95em" }}>
                        {p.technologies.join(" · ")}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </Html>

      <Html
        transform={false}
        position={[anchor[0] - 0.07, anchor[1] + 0.1, anchor[2]]}
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

const titleStyle = {
  fontSize: "clamp(12px, 1.7vmin, 15px)",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  textAlign: "center",
  opacity: 0.95,
};

const ulStyle = {
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "grid",
  gap: 10,
};
const ulStyleProjects = { ...ulStyle, gap: 12 };

const dividerStyle = {
  height: 1,
  background:
    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.35) 12%, rgba(255,255,255,.35) 88%, rgba(255,255,255,0) 100%)",
  opacity: 0.9,
};
