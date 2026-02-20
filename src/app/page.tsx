import { RecentResultLink } from "@/components/recent-result-link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-6 shadow-2xl shadow-blue-900/40 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_42%)]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100">10초 생성기</p>
            <h1 className="mt-3 text-4xl font-black leading-[1.05] md:text-5xl">멘탈 날씨 카드</h1>
            <p className="mt-4 max-w-md text-base text-cyan-50/90">
              세 번만 탭하면 현재 상태 카드가 완성됩니다. 저장하고 공유해서 오늘의 모드를 보여주세요.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/create"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                지금 시작하기
              </a>
              <RecentResultLink />
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">1단계</p>
            <h2 className="mt-2 text-xl font-bold">버튼 선택</h2>
            <p className="mt-1 text-sm text-slate-200/80">에너지, 사회성, 압박감만 고르세요.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">2단계</p>
            <h2 className="mt-2 text-xl font-bold">즉시 분석</h2>
            <p className="mt-1 text-sm text-slate-200/80">변동성 점수와 행동 제안을 바로 확인합니다.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">3단계</p>
            <h2 className="mt-2 text-xl font-bold">카드 공유</h2>
            <p className="mt-1 text-sm text-slate-200/80">PNG 저장 또는 휴대폰 공유를 바로 실행하세요.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
