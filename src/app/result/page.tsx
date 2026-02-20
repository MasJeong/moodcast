import type { Metadata } from "next";

import { ResultScreen } from "@/components/result-screen";
import { decodeCardSpec } from "@/lib/card-spec";
import { buildShareDescription, buildShareTitle } from "@/lib/share-copy";

type ResultPageProps = {
  searchParams: Promise<{ s?: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ searchParams }: ResultPageProps): Promise<Metadata> {
  const params = await searchParams;
  const encoded = params.s ?? null;
  const spec = decodeCardSpec(encoded);
  const pageUrl = encoded ? `${siteUrl}/result?s=${encoded}` : `${siteUrl}/result`;
  const ogUrl = encoded ? `${siteUrl}/api/og?s=${encoded}` : `${siteUrl}/api/og`;

  const title = spec ? `${buildShareTitle(spec)} | MoodCast` : "결과 확인 | MoodCast";
  const description = spec ? buildShareDescription(spec) : "멘탈 날씨 결과를 확인하고 공유해보세요.";

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: "MoodCast 결과 카드" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;

  return <ResultScreen encoded={params.s ?? null} />;
}
