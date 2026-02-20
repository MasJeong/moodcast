"use client";

import { RefObject, useEffect, useMemo, useState } from "react";
import { toBlob } from "html-to-image";

import { CardSpec, encodeCardSpec } from "@/lib/card-spec";
import { buildShareDescription, buildShareTitle, getStatusTag, getWeatherEmoji } from "@/lib/share-copy";

type ResultActionsProps = {
  cardRef: RefObject<HTMLElement | null>;
  spec: CardSpec;
};

type KakaoSharePayload = {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
};

type KakaoSDK = {
  isInitialized: () => boolean;
  init: (appKey: string) => void;
  Share: {
    sendDefault: (payload: KakaoSharePayload) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

export function ResultActions({ cardRef, spec }: ResultActionsProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [kakaoReady, setKakaoReady] = useState(false);

  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  const shareParam = useMemo(() => encodeCardSpec(spec), [spec]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/result?s=${shareParam}`;
  }, [shareParam]);

  const ogImageUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/api/og?s=${shareParam}`;
  }, [shareParam]);

  const weatherEmoji = useMemo(() => getWeatherEmoji(spec.turbulence), [spec.turbulence]);
  const statusTag = useMemo(() => getStatusTag(spec.turbulence), [spec.turbulence]);

  const shareText = useMemo(
    () => `내 멘탈 날씨는 ${spec.turbulence}% (${spec.headline})야. 너도 10초 안에 해봐.`,
    [spec.headline, spec.turbulence],
  );

  const kakaoText = useMemo(
    () => `${weatherEmoji} ${statusTag}\n오늘 내 멘탈 날씨 ${spec.turbulence}% (${spec.headline}) 떴어.\n너도 10초 테스트 해봐 👇`,
    [spec.headline, spec.turbulence, statusTag, weatherEmoji],
  );

  const instaText = useMemo(
    () => `${weatherEmoji} 오늘의 멘탈 날씨: ${spec.turbulence}% ${spec.headline}\n${statusTag}\n\n#MoodCast #멘탈날씨카드 #오늘컨디션 #심리테스트 #스토리공유`,
    [spec.headline, spec.turbulence, statusTag, weatherEmoji],
  );

  useEffect(() => {
    if (!kakaoKey || typeof window === "undefined") {
      return;
    }

    const initialize = () => {
      const sdk = window.Kakao;

      if (!sdk) {
        setKakaoReady(false);
        return;
      }

      if (!sdk.isInitialized()) {
        sdk.init(kakaoKey);
      }

      setKakaoReady(true);
    };

    if (window.Kakao) {
      initialize();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    script.async = true;
    script.onload = initialize;
    script.onerror = () => setMessage("카카오 SDK 로드에 실패했어요. 링크 공유로 진행해 주세요.");
    document.head.appendChild(script);
  }, [kakaoKey]);

  function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
  }

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

    return new File([blob], `moodcast-${spec.turbulence}.png`, { type: "image/png" });
  }

  async function copyToClipboard(text: string, successMessage: string) {
    if (!navigator.clipboard) {
      setMessage("클립보드 접근이 불가해요. 텍스트를 직접 복사해 주세요.");
      return;
    }

    await navigator.clipboard.writeText(text);
    setMessage(successMessage);
  }

  async function onDownload() {
    setBusy(true);
    setMessage("");

    try {
      const file = await exportImage();

      if (!file) {
        return;
      }

      downloadFile(file);
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
          title: "MoodCast",
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

      await copyToClipboard(`${shareText} ${shareUrl}`.trim(), "공유 링크를 복사했어요.");
    } catch {
      setMessage("링크 복사에 실패했어요.");
    }
  }

  async function copyPlatformText(platform: "kakao" | "insta") {
    try {
      const text = platform === "kakao" ? kakaoText : instaText;
      await copyToClipboard(`${text} ${shareUrl}`.trim(), platform === "kakao" ? "카카오톡용 문구를 복사했어요." : "인스타용 문구를 복사했어요.");
    } catch {
      setMessage("문구 복사에 실패했어요.");
    }
  }

  function openKakaoShare() {
    if (!shareUrl) {
      setMessage("공유 링크가 아직 준비되지 않았어요.");
      return;
    }

    if (kakaoReady && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: buildShareTitle(spec),
          description: buildShareDescription(spec),
          imageUrl: ogImageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: "나도 테스트하기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
      return;
    }

    window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}`, "_blank");
    setMessage("카카오 SDK 미설정 상태라 링크 공유로 열었어요.");
  }

  async function openInstagramFlow() {
    setBusy(true);
    setMessage("");

    try {
      const file = await exportImage();

      if (!file) {
        return;
      }

      downloadFile(file);
      await copyToClipboard(instaText, "인스타 문구를 복사했어요. 스토리에 붙여넣어 주세요.");
      window.open("https://www.instagram.com/", "_blank");
    } catch {
      setMessage("인스타 준비 과정에서 오류가 발생했어요.");
    } finally {
      setBusy(false);
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

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => copyPlatformText("kakao")}
          disabled={busy}
          className="rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          카카오 문구 복사
        </button>
        <button
          type="button"
          onClick={() => copyPlatformText("insta")}
          disabled={busy}
          className="rounded-2xl border border-pink-300 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-900 transition hover:bg-pink-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          인스타 문구 복사
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={openKakaoShare}
          className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-bold text-yellow-950 transition hover:bg-yellow-300"
        >
          카카오톡 바로 공유
        </button>
        <button
          type="button"
          onClick={openInstagramFlow}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          인스타 업로드 준비
        </button>
      </div>

      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
        인스타는 외부 웹에서 직접 업로드가 제한되어 저장 + 문구 복사 + 인스타 열기 순서로 연결됩니다.
      </p>

      {message ? <p className="text-center text-xs text-slate-600">{message}</p> : null}
    </div>
  );
}
