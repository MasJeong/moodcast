import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MoodCast",
    short_name: "MoodCast",
    description: "세 번의 선택으로 지금의 멘탈 날씨를 카드로 만들어 공유하세요.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    lang: "ko",
  };
}
