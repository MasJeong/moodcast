"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import { CardPreview } from "@/components/card-preview";
import { ResultActions } from "@/components/result-actions";
import { decodeCardSpec } from "@/lib/card-spec";

type ResultScreenProps = {
  encoded: string | null;
};

export function ResultScreen({ encoded }: ResultScreenProps) {
  const spec = useMemo(() => decodeCardSpec(encoded), [encoded]);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!encoded) {
      return;
    }

    window.localStorage.setItem("mw:last-result", encoded);
  }, [encoded]);

  if (!spec) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-12">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 text-center shadow-lg">
          <h1 className="text-2xl font-black text-slate-900">결과를 찾을 수 없어요</h1>
          <p className="mt-2 text-sm text-slate-600">먼저 카드를 생성해 주세요.</p>
          <Link
            href="/create"
            className="mt-5 inline-block rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            만들러 가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-md space-y-4">
        <section ref={cardRef}>
          <CardPreview spec={spec} />
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/70">
          <p className="text-center text-sm text-slate-600">{`오늘의 변동성 지수: ${spec.turbulence}%`}</p>
          <div className="mt-3">
            <ResultActions cardRef={cardRef} spec={spec} />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/create"
            className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow"
          >
            다시 진단
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
