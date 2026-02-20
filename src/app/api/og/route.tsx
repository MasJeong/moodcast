import { ImageResponse } from "next/og";

import { decodeCardSpec } from "@/lib/card-spec";
import { buildShareDescription, buildShareTitle } from "@/lib/share-copy";

export const runtime = "edge";

function getGradient(weather: string): string {
  if (weather === "clear") return "linear-gradient(135deg, #fbbf24 0%, #fb7185 100%)";
  if (weather === "cloudy") return "linear-gradient(135deg, #94a3b8 0%, #7dd3fc 100%)";
  if (weather === "rain") return "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)";
  if (weather === "storm") return "linear-gradient(135deg, #6366f1 0%, #111827 100%)";
  return "linear-gradient(135deg, #c026d3 0%, #0f172a 100%)";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const encoded = searchParams.get("s");
  const spec = decodeCardSpec(encoded);

  const title = spec ? buildShareTitle(spec) : "MoodCast";
  const description = spec ? buildShareDescription(spec) : "세 번의 선택으로 내 멘탈 날씨를 확인해보세요.";
  const score = spec ? `${spec.turbulence}%` : "--";
  const gradient = spec ? getGradient(spec.weather) : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          color: "white",
          fontFamily: "sans-serif",
          background: gradient,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>MoodCast</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.2)",
            }}
          >
            멘탈 날씨 카드
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 30, opacity: 0.95 }}>{description}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <div style={{ fontSize: 22, opacity: 0.9 }}>10초로 확인하는 오늘의 감정 기류</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontSize: 24, opacity: 0.8 }}>변동성</div>
            <div style={{ fontSize: 72, fontWeight: 900 }}>{score}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
