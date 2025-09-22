import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { downloadPortfolio, DownloadButton } from "../../../../services/portfolioDownload.jsx";

export default function ContactOverlay({
  data,
  z = 0.028,
  width = 3.0,
  height = 2.2,
  onClose,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const PX_WIDTH = 320;
  const PX_HEIGHT = Math.round(PX_WIDTH * (height / width));
  const PADDING = 15;

  const handleDownload = async () => {
    const result = await downloadPortfolio(setIsDownloading, 'lab');
    if (!result.success) {
      alert(result.error);
    }
  };

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
          borderRadius: 8,
          background: "rgba(20, 20, 20, 0.95)",
          color: "#00ff88",
          lineHeight: 1.4,
          boxShadow: "0 4px 20px rgba(0,255,136,0.3), inset 0 0 20px rgba(0,255,136,0.1)",
          border: "1px solid rgba(0,255,136,0.3)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 12,
          boxSizing: "border-box",
          fontFamily: "'Courier New', monospace",
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
            position: "absolute",
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "1px solid #00ff88",
            background: "rgba(0,0,0,0.8)",
            color: "#00ff88",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,255,136,0.3)",
            zIndex: 2,
          }}
        >
          ×
        </button>

        <div style={{ marginTop: 20 }}>
          <h2
            style={{
              margin: "0 0 15px 0",
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
              color: "#00ff88",
              textShadow: "0 0 10px rgba(0,255,136,0.5)",
            }}
          >
            🧪 LAB CONTACT 🧪
          </h2>

          <div
            style={{
              background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: 6,
              padding: 12,
              marginBottom: 15,
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: 14,
                fontWeight: 600,
                color: "#00ff88",
              }}
            >
              {data?.user?.name || "Dr. Portfolio"}
            </h3>
            
            {data?.user?.description && (
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 11,
                  fontStyle: "italic",
                  color: "#88ffaa",
                }}
              >
                {data.user.description}
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "4px 8px",
                fontSize: 10,
                color: "#ccffdd",
              }}
            >
              <span style={{ color: "#00ff88", fontWeight: 600 }}>📧 Email:</span>
              <span>{data?.user?.email || "lab@portfolio.com"}</span>

              <span style={{ color: "#00ff88", fontWeight: 600 }}>📱 Phone:</span>
              <span>{data?.user?.phone || "+1 (555) LAB-TECH"}</span>

              <span style={{ color: "#00ff88", fontWeight: 600 }}>🔗 LinkedIn:</span>
              <span style={{ wordBreak: "break-all" }}>
                {data?.user?.linkedin || "linkedin.com/in/scientist"}
              </span>

              <span style={{ color: "#00ff88", fontWeight: 600 }}>🌐 Website:</span>
              <span style={{ wordBreak: "break-all" }}>
                {data?.user?.website || "portfolio-lab.com"}
              </span>
            </div>
          </div>

          {/* Download Section */}
          <div
            style={{
              background: "rgba(0,255,136,0.05)",
              border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: 6,
              padding: 12,
              textAlign: "center",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: 13,
                fontWeight: 600,
                color: "#00ff88",
              }}
            >
              🧬 EXTRACT PORTFOLIO DNA 🧬
            </h4>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: 10,
                color: "#ccffdd",
                lineHeight: 1.3,
              }}
            >
              Download your complete portfolio as a React application. 
              Ready for deployment and customization!
            </p>
            
            <div style={{ marginBottom: 8 }}>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                style={{
                  padding: "8px 16px",
                  background: isDownloading 
                    ? "rgba(0,255,136,0.3)" 
                    : "linear-gradient(45deg, #00ff88, #00cc66)",
                  color: isDownloading ? "#88ffaa" : "#000",
                  border: "1px solid #00ff88",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: isDownloading ? "not-allowed" : "pointer",
                  fontFamily: "'Courier New', monospace",
                  boxShadow: isDownloading 
                    ? "none" 
                    : "0 2px 8px rgba(0,255,136,0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                {isDownloading ? "🧪 SYNTHESIZING..." : "⬇️ DOWNLOAD LAB"}
              </button>
            </div>
            
            <p
              style={{
                margin: 0,
                fontSize: 9,
                color: "#88ffaa",
                fontStyle: "italic",
              }}
            >
              Includes: React app + Lab theme + Your data
            </p>
          </div>

          <div
            style={{
              marginTop: 15,
              padding: 10,
              background: "rgba(0,255,136,0.05)",
              border: "1px dashed rgba(0,255,136,0.3)",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: "#88ffaa",
                fontStyle: "italic",
              }}
            >
              "Science is not only a disciple of reason but also one of romance and passion." - Stephen Hawking
            </p>
          </div>
        </div>
      </div>
    </Html>
  );
}