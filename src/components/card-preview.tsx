import { CardSpec } from "@/lib/card-spec";
import { getWeatherVisuals } from "@/lib/weather";

type CardPreviewProps = {
  spec: CardSpec;
};

export function CardPreview({ spec }: CardPreviewProps) {
  const visual = getWeatherVisuals(spec.weather);

  return (
    <article
      className={`relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br ${visual.gradient} p-6 text-white shadow-2xl`}
      data-export-target="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]" />

      <div className="relative flex min-h-[460px] flex-col">
        <header className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/85">멘탈 날씨</p>
            <h2 className="mt-2 text-3xl font-black leading-none">{spec.headline}</h2>
          </div>
          <span className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {visual.icon}
          </span>
        </header>

        <div className="mt-8 rounded-2xl bg-black/20 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">변동성 지수</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-5xl font-black leading-none">{spec.turbulence}%</p>
            <p className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{visual.label}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="rounded-xl bg-white/15 p-3 text-sm font-medium leading-relaxed backdrop-blur-sm">{spec.vibe}</p>
          <p className="rounded-xl bg-black/20 p-3 text-sm leading-relaxed">추천 행동: {spec.action}</p>
        </div>

        <footer className="mt-auto pt-6 text-xs tracking-wide text-white/75">10초 안에 생성됨</footer>
      </div>
    </article>
  );
}
