# 발행 변경 기록 (수정판) — 2026-09-26

## 구조 변경 사유
`청주 방수 업체`(CAT01)를 별도 블로그 글로 발행하면, 이미 같은 주제를 다루고 있는 홈페이지(`/`)와 검색·클릭 경쟁이 생겨 자기잠식이 발생합니다. 그래서 CAT01을 별도 페이지로 만들지 않고 **홈페이지 자체를 최상위 필러 페이지로 유지**하도록 구조를 바꿨습니다.

## 최종 구조
- 최상위 필러: `https://cjbangsubareunbangsu.pages.dev/` (기존 홈페이지, 변경 없음 + 지역 섹션에 링크 추가)
- 클러스터 4개(발행 파일 그대로):
  - `/blog/sangdang-gu-waterproofing/` (상당구)
  - `/blog/seowon-gu-waterproofing/` (서원구)
  - `/blog/heungdeok-gu-waterproofing/` (흥덕구)
  - `/blog/cheongwon-gu-waterproofing/` (청원구)
- **삭제**: `/blog/cheongju-waterproofing-company/` (CAT01 허브 페이지, 홈페이지로 대체되어 삭제)

## 이번에 수정한 파일
- `public/index.html` — 기존 "CHEONGJU SERVICE AREA" 구역의 구 이름 4개를 각 지역 글로 연결되는 링크로 변경, `id="districts"` 앵커 추가
- `public/assets/css/style.css` — `.districts a` 스타일(호버 포함) 추가
- `public/{index,rooftop,exterior,bathroom,basement,crack-repair}/index.html` — 내비게이션의 "방수업체 가이드" 링크가 `/blog/cheongju-waterproofing-company/` 대신 홈페이지 지역 구역(`/#districts`)으로 연결되도록 수정
- `public/blog/sangdang-gu-waterproofing/index.html` 외 3개 — 브레드크럼을 "청주방수 / {구}" 2단계로 단순화(중간 허브 크럼 제거), 하단 상위 링크를 홈페이지로 변경, BreadcrumbList JSON-LD도 2단계로 수정
- `public/sitemap.xml`, `public/rss.xml` — CAT01 URL/항목 제거, 4개 구 URL/항목만 유지
- `content-registry.json` — CAT01을 "홈페이지에 병합됨(pillar_merged_into_homepage)"으로 기록, 4개 글의 parent_url을 홈페이지로 기록

## 검증 (실제 빌드 실행 확인)
- `SITE_URL=https://cjbangsubareunbangsu.pages.dev node scripts/build.mjs` 성공
- 홈페이지 지역 링크 4개 정상 생성 확인
- 내비게이션 "방수업체 가이드" 링크가 6개 페이지 모두 `/#districts`로 정상 변경 확인
- `/blog/cheongju-waterproofing-company/` 폴더 삭제 및 dist에 미생성 확인
- 4개 지역 글 모두 2단계 브레드크럼 + JSON-LD(BlogPosting/BreadcrumbList/FAQPage) 파싱 정상
- sitemap.xml 10개 URL(기존 6 + 신규 4), rss.xml 10개 item(기존 6 + 신규 4) 확인, `example.com` 잔존 0건
