import { CardSpec } from "@/lib/card-spec";

export function getWeatherEmoji(turbulence: number): string {
  if (turbulence < 25) return "☀️";
  if (turbulence < 45) return "⛅";
  if (turbulence < 65) return "🌧️";
  if (turbulence < 82) return "⛈️";
  return "🌀";
}

export function getStatusTag(turbulence: number): string {
  if (turbulence < 25) return "오늘 컨디션 매우 좋음";
  if (turbulence < 45) return "오늘은 무난한 날";
  if (turbulence < 65) return "집중 관리 필요";
  if (turbulence < 82) return "과부하 주의";
  return "생존 모드";
}

export function buildShareTitle(spec: CardSpec): string {
  return `오늘의 멘탈 날씨 ${spec.turbulence}% ${getWeatherEmoji(spec.turbulence)}`;
}

export function buildShareDescription(spec: CardSpec): string {
  return `${spec.headline} · ${getStatusTag(spec.turbulence)}`;
}
