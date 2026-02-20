"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { InputState, inputSchema } from "@/lib/card-spec";
import { buildCardSpec } from "@/lib/weather";
import { encodeCardSpec } from "@/lib/card-spec";

const initialState: InputState = {
  energy: "mid",
  social: "neutral",
  pressure: "normal",
};

type Option<T extends string> = { value: T; label: string; help: string };

const energyChoices: Option<InputState["energy"]>[] = [
  { value: "high", label: "높음", help: "머리가 빠르게 돈다" },
  { value: "mid", label: "보통", help: "평소 컨디션" },
  { value: "low", label: "낮음", help: "배터리 부족" },
];

const socialChoices: Option<InputState["social"]>[] = [
  { value: "open", label: "열림", help: "대화할 준비됨" },
  { value: "neutral", label: "중립", help: "상황 따라 다름" },
  { value: "off", label: "차단", help: "건드리지 마" },
];

const pressureChoices: Option<InputState["pressure"]>[] = [
  { value: "calm", label: "여유", help: "급한 일 없음" },
  { value: "normal", label: "보통", help: "감당 가능" },
  { value: "overload", label: "과부하", help: "한꺼번에 몰림" },
];

function ChoiceRow<T extends string>({
  title,
  subtitle,
  options,
  selected,
  onSelect,
}: {
  title: string;
  subtitle: string;
  options: Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const active = option.value === selected;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`rounded-2xl border px-2 py-4 text-center transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
              }`}
            >
              <p className="text-sm font-semibold">{option.label}</p>
              <p className={`mt-1 text-[11px] ${active ? "text-slate-200" : "text-slate-500"}`}>{option.help}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function CreatePage() {
  const [input, setInput] = useState<InputState>(initialState);

  function onReset() {
    setInput(initialState);
  }

  function onRandom() {
    const randomPick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

    setInput({
      energy: randomPick(["high", "mid", "low"] as const),
      social: randomPick(["open", "neutral", "off"] as const),
      pressure: randomPick(["calm", "normal", "overload"] as const),
    });
  }

  const resultHref = useMemo(() => {
    const parsed = inputSchema.parse(input);
    const spec = buildCardSpec(parsed);
    return `/result?s=${encodeCardSpec(spec)}`;
  }, [input]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-md space-y-6 rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/70">
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">10초 완성</p>
          <h1 className="text-2xl font-black text-slate-900">내 멘탈 날씨 만들기</h1>
          <p className="text-sm text-slate-600">각 항목에서 하나씩만 누르면 끝나요.</p>
        </header>

        <ChoiceRow
          title="에너지"
          subtitle="지금 컨디션은 어떤가요?"
          options={energyChoices}
          selected={input.energy}
          onSelect={(energy) => setInput((prev) => ({ ...prev, energy }))}
        />

        <ChoiceRow
          title="사회성"
          subtitle="사람을 얼마나 감당할 수 있나요?"
          options={socialChoices}
          selected={input.social}
          onSelect={(social) => setInput((prev) => ({ ...prev, social }))}
        />

        <ChoiceRow
          title="압박감"
          subtitle="오늘 일정은 얼마나 빡센가요?"
          options={pressureChoices}
          selected={input.pressure}
          onSelect={(pressure) => setInput((prev) => ({ ...prev, pressure }))}
        />

        <Link
          href={resultHref}
          className="block rounded-2xl bg-slate-900 px-4 py-4 text-center text-sm font-bold text-white transition hover:bg-slate-800"
        >
          카드 생성하기
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onRandom}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            랜덤 추천
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            초기화
          </button>
        </div>
      </div>
    </main>
  );
}
