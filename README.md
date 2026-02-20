# MoodCast (멘탈 날씨 카드)

3개의 버튼 선택으로 현재 상태를 카드로 만들고, PNG 저장/공유까지 가능한 Next.js 프로젝트입니다.

## 기술 스택

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- `html-to-image` (카드 PNG export)
- `zod` (입력/결과 스키마 검증)
- `lz-string` (결과 URL 압축 인코딩)

## 주요 기능

- `/` 랜딩 페이지
- `/create` 3단계 선택 입력 (에너지/사회성/압박감)
- `/result` 결과 카드 렌더링
- `/api/og` 결과 링크용 OG 이미지 생성
- PNG 저장
- Web Share API 공유 + 링크 복사 fallback
- 카카오 SDK 공유 + 카카오 sharer fallback
- 인스타 스토리 업로드 보조 플로우(저장 + 문구 복사 + 앱 열기)
- 최근 결과 이어보기 (localStorage)

## 로컬 실행

```bash
bun install
bun run dev
```

브라우저에서 `http://localhost:3000` 접속

## 빌드/검증

```bash
bun run lint
bun run build
```

## 환경 변수

`.env.example` 참고:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_KAKAO_JS_KEY=your-kakao-javascript-key
```

실서비스 도메인으로 설정하면 sitemap/robots URL이 올바르게 생성됩니다.
카카오 공유를 쓰려면 카카오 디벨로퍼스에서 JavaScript 키 발급 후 사이트 도메인을 등록해야 합니다.

## Vercel 배포 준비

이미 배포 가능한 상태로 구성되어 있습니다.

1. Git 저장소에 푸시
2. Vercel에서 Import Project
3. Framework Preset: Next.js
4. Environment Variables에 `NEXT_PUBLIC_SITE_URL` 등록
5. 카카오 공유를 사용할 경우 `NEXT_PUBLIC_KAKAO_JS_KEY` 등록
6. Deploy

## 배포 후 체크리스트

- `/`, `/create`, `/result?s=...` 동작 확인
- 모바일에서 PNG 저장/공유 동작 확인
- `https://도메인/sitemap.xml`, `https://도메인/robots.txt` 확인
