"use client";

import Link from "next/link";
import { useState } from "react";

export function RecentResultLink() {
  const [href] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const encoded = window.localStorage.getItem("mw:last-result");
    return encoded ? `/result?s=${encoded}` : null;
  });

  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/50 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
    >
      최근 결과 이어보기
    </Link>
  );
}
