import { CardSpec, InputState } from "@/lib/card-spec";

const energyMap: Record<InputState["energy"], number> = {
  high: 85,
  mid: 55,
  low: 20,
};

const socialMap: Record<InputState["social"], number> = {
  open: 85,
  neutral: 55,
  off: 20,
};

const pressureMap: Record<InputState["pressure"], number> = {
  calm: 20,
  normal: 50,
  overload: 90,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getWeatherType(turbulence: number): CardSpec["weather"] {
  if (turbulence < 25) {
    return "clear";
  }

  if (turbulence < 45) {
    return "cloudy";
  }

  if (turbulence < 65) {
    return "rain";
  }

  if (turbulence < 82) {
    return "storm";
  }

  return "typhoon";
}

function getCopy(weather: CardSpec["weather"], turbulence: number): Pick<CardSpec, "headline" | "vibe" | "action"> {
  const templates: Record<CardSpec["weather"], Pick<CardSpec, "headline" | "vibe" | "action">> = {
    clear: {
      headline: "맑음 모드",
      vibe: "지금 감정 기류가 안정적이고 선명해요.",
      action: "미뤄둔 일 하나를 지금 바로 끝내보세요.",
    },
    cloudy: {
      headline: "구름 모드",
      vibe: "기분은 유지되지만 집중이 자주 흔들립니다.",
      action: "중요 결정은 가볍게 넘기고 짧은 일부터 처리하세요.",
    },
    rain: {
      headline: "비 주의보",
      vibe: "압박이 쌓이면 에너지가 빠르게 떨어져요.",
      action: "30분만 잡음 차단하고 호흡을 다시 맞추세요.",
    },
    storm: {
      headline: "폭풍 구간",
      vibe: "스트레스와 사회적 피로가 동시에 몰려옵니다.",
      action: "오늘은 선택 일정부터 줄이고 에너지를 지키세요.",
    },
    typhoon: {
      headline: "태풍 경보",
      vibe: "과부하 상태로 생존 모드에 가까워요.",
      action: "필수 일만 처리하고 감정 대화는 내일로 미루세요.",
    },
  };

  const base = templates[weather];

  if (turbulence > 90) {
    return {
      ...base,
      action: "응급 리셋: 물 마시기, 간단한 식사, 짧은 산책 후 알림 끄기.",
    };
  }

  return base;
}

export function buildCardSpec(input: InputState): CardSpec {
  const energy = energyMap[input.energy];
  const social = socialMap[input.social];
  const pressure = pressureMap[input.pressure];

  const turbulence = clamp(
    Math.round((100 - energy) * 0.4 + (100 - social) * 0.25 + pressure * 0.35),
    0,
    100,
  );

  const weather = getWeatherType(turbulence);
  const copy = getCopy(weather, turbulence);

  return {
    v: 1,
    ...input,
    weather,
    turbulence,
    headline: copy.headline,
    vibe: copy.vibe,
    action: copy.action,
    createdAt: new Date().toISOString(),
  };
}

export function getWeatherVisuals(weather: CardSpec["weather"]): {
  icon: string;
  label: string;
  gradient: string;
} {
  switch (weather) {
    case "clear":
      return {
        icon: "SUN",
        label: "맑음",
        gradient: "from-amber-300 via-orange-300 to-rose-300",
      };
    case "cloudy":
      return {
        icon: "CLOUD",
        label: "구름",
        gradient: "from-slate-300 via-sky-200 to-indigo-200",
      };
    case "rain":
      return {
        icon: "RAIN",
        label: "비",
        gradient: "from-cyan-300 via-sky-400 to-blue-500",
      };
    case "storm":
      return {
        icon: "STORM",
        label: "폭풍",
        gradient: "from-indigo-500 via-slate-700 to-zinc-900",
      };
    default:
      return {
        icon: "TYPHOON",
        label: "태풍",
        gradient: "from-fuchsia-500 via-violet-700 to-slate-950",
      };
  }
}
