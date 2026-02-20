import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const metadataBase = new URL(siteUrl);
const defaultDescription = "세 번의 선택으로 지금 내 상태 카드를 만들고 공유해보세요.";

export const metadata: Metadata = {
  title: "MoodCast | 멘탈 날씨 카드",
  description: defaultDescription,
  metadataBase,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MoodCast | 멘탈 날씨 카드",
    description: defaultDescription,
    type: "website",
    url: "/",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "MoodCast" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodCast | 멘탈 날씨 카드",
    description: defaultDescription,
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
