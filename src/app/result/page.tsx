import { ResultScreen } from "@/components/result-screen";

type ResultPageProps = {
  searchParams: Promise<{ s?: string }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;

  return <ResultScreen encoded={params.s ?? null} />;
}
