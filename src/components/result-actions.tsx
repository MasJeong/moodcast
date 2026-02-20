"use client";

import { RefObject, useMemo, useState } from "react";
import { toBlob } from "html-to-image";

import { CardSpec, encodeCardSpec } from "@/lib/card-spec";

type ResultActionsProps = {
  cardRef: RefObject<HTMLElement | null>;
  spec: CardSpec;
};

export function ResultActions({ cardRef, spec }: ResultActionsProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const shareText = useMemo(
    () => `내 멘탈 날씨는 ${spec.turbulence}% (${spec.headline})야. 너도 10초 안에 해봐.`,
    [spec.headline, spec.turbulence],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const encoded = encodeCardSpec(spec);
    return `${window.location.origin}/result?s=${encoded}`;
  }, [spec]);

  async function exportImage(): Promise<File | null> {
    if (!cardRef.current) {
      setMessage("카드가 아직 준비되지 않았어요.");
      return null;
    }

    await document.fonts.ready;

    const blob = await toBlob(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#0f172a",
    });

    if (!blob) {
      setMessage("이미지 생성에 실패했어요. 다시 시도해 주세요.");
      return null;
    }

    return new File([blob], `mental-weather-${spec.turbulence}.png`, { type: "image/png" });
  }

  async function onDownload() {
    setBusy(true);
    setMessage("");

    try {
      const file = await exportImage();

      if (!file) {
        return;
      }

      const url = URL.createObjectURL(file);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.name;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("카드를 저장했어요.");
    } catch {
      setMessage("다운로드에 실패했어요.");
    } finally {
      setBusy(false);
    }
  }

  async function onShare() {
    setBusy(true);
    setMessage("");

    try {
      const file = await exportImage();

      if (!file) {
        return;
      }

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "멘탈 날씨 카드",
          text: shareText,
          files: [file],
        });
        setMessage("공유 완료!");
        return;
      }

      await onCopyLink();
    } catch {
      setMessage("공유가 취소되었거나 실패했어요.");
    } finally {
      setBusy(false);
    }
  }

  async function onCopyLink() {
    try {
      if (!shareUrl) {
        setMessage("링크 생성에 실패했어요.");
        return;
      }

      if (!navigator.clipboard) {
        setMessage("클립보드 접근이 불가해요. 주소창 링크를 직접 복사해 주세요.");
        return;
      }

      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`.trim());
      setMessage("공유 링크를 복사했어요.");
    } catch {
      setMessage("링크 복사에 실패했어요.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onDownload}
          disabled={busy}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          PNG 저장
        </button>
        <button
          type="button"
          onClick={onShare}
          disabled={busy}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          공유하기
        </button>
        <button
          type="button"
          onClick={onCopyLink}
          disabled={busy}
          className="rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          링크 복사
        </button>
      </div>
      {message ? <p className="text-center text-xs text-slate-600">{message}</p> : null}
    </div>
  );
}
