# 발행 변경 기록 — CAT01 / CAT01-P01~P04 (2026-09-26)

## 신규 파일
- `public/blog/cheongju-waterproofing-company/index.html` — CAT01(허브). 4개 구 클러스터로 연결.
- `public/blog/sangdang-gu-waterproofing/index.html` — CAT01-P01(상당구)
- `public/blog/seowon-gu-waterproofing/index.html` — CAT01-P02(서원구)
- `public/blog/heungdeok-gu-waterproofing/index.html` — CAT01-P03(흥덕구)
- `public/blog/cheongwon-gu-waterproofing/index.html` — CAT01-P04(청원구)
- `public/assets/css/editorial.css` — 신규 블로그 아티클 전용 스타일(기존 style.css 브랜드 토큰 재사용, `.cjbangsu-*` 접두어)
- `content-registry.json` (저장소 루트, 빌드 소스 밖) — 5개 글의 target_id/역할/부모/URL/출처/링크 관계 기록

## 수정 파일
- `public/sitemap.xml` — 기존 6개 URL 보존, 신규 5개 URL 추가
- `public/rss.xml` — 기존 6개 item 보존, 신규 5개 item 추가(pubDate 포함)
- `public/index.html`, `public/rooftop/index.html`, `public/exterior/index.html`,
  `public/bathroom/index.html`, `public/basement/index.html`, `public/crack-repair/index.html`
  — 주 메뉴에 "방수업체 가이드" 링크 1개 추가(허브 페이지로 연결). 그 외 변경 없음.

## 내부 링크 구조
- 클러스터(P01~P04) → 허브(CAT01): 각 1회, "청주 방수 업체 선택 가이드 전체 보기"
- 허브(CAT01) → 클러스터 4개: 각 1회, 지역명 앵커
- 일부 클러스터/허브 → 기존 서비스 페이지(`/rooftop/`, `/exterior/`): 주제 관련성이 있을 때만 1회

## 출처 잠금(Source URL Lock)
각 글의 "참고한 1차 자료" 절은 첨부된 리서치 리포트(CAT01.txt, CAT01-P01~P04.txt)에 실제로 등장한 URL만 사용했습니다. 새 URL을 생성하지 않았습니다.

## 근거 부족으로 본문에서 제외한 항목
- CAT01: 실제 진단 사례(case-study) 섹션 — 해당 리포트에 인용 가능한 T2 사례가 없어 생략(허구 생성 대신 제외).
- 전 페이지 공통: 구체적 공사 비용·기간·업체 순위 — 제공된 자료에 확정 수치가 없어 서술하지 않음.
- 이미지: 사용자가 이미지 개수를 지정하지 않아 0개로 처리(자리표시자 이미지 미생성).

## 검증 결과 (실제 실행 확인)
- `node scripts/build.mjs --demo` — 성공, dist에 5개 신규 페이지 생성 확인
- `SITE_URL=https://cjbangsubareunbangsu.pages.dev node scripts/build.mjs` — 성공
  - canonical/og:url 실제 도메인으로 정상 치환
  - robots 메타 `noindex, nofollow` → `index, follow, max-image-preview:large` 정상 전환
  - `example.com` 잔존 0건
  - tel: 링크 정상 치환
- sitemap.xml / rss.xml — XML 파싱 정상, 기존 항목 보존 확인
- 5개 글 모두 JSON-LD(BlogPosting/BreadcrumbList/FAQPage) 파싱 정상
- 5개 글 모두 `<article>` 내부 `<br>` 0건, 내부 링크 URL 중복 0건, TODO/IMAGE_URL 잔존 0건
- 본문 분량(측정 대상 텍스트만): CAT01 약 2,056자 / P01 약 1,693자 / P02 약 1,636자 / P03 약 1,597자 / P04 약 1,579자
  (목표 1,850자 ±10%인 1,665~2,035자 기준으로 P02~P04는 약 3~8% 낮음. 사실 확인 없이 분량을 채우지 않는 원칙을 우선했습니다.)

## 미실행 항목 (상태: ready, published 아님)
- 실제 GitHub 커밋/푸시, Cloudflare Pages 배포, 운영 URL 응답 확인은 이 대화에서 저장소 접근 권한이 없어 수행하지 않았습니다.
- 사용자가 GitHub 저장소에 반영 후 Cloudflare Pages가 빌드하면, 위 5개 URL이 실제로 게시됩니다.
