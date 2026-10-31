import { ImageResponse } from "next/og";

export const alt = "Shivam Jaiswal | AI/ML Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#050505",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
          border: "2px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#00f0ff",
                border: "1px solid rgba(0, 240, 255, 0.4)",
                backgroundColor: "rgba(0, 240, 255, 0.1)",
                padding: "6px 16px",
                borderRadius: "9999px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              AI/ML Engineer Portfolio
            </span>
          </div>
          <h1 style={{ fontSize: 72, fontWeight: 900, color: "#ffffff", margin: 0 }}>
            Shivam Jaiswal
          </h1>
          <p
            style={{
              fontSize: 32,
              color: "#a1a1aa",
              marginTop: 18,
              maxWidth: 950,
              lineHeight: 1.4,
            }}
          >
            Building Multilingual NLP, Cross-lingual RAG, and Agentic Systems.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 24,
            fontSize: 22,
            fontFamily: "monospace",
            color: "#00f0ff",
          }}
        >
          <span>Siemens EDA Catapult R&D Intern · RGIPT Bengaluru</span>
          <span>github.com/Shivam9621</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
