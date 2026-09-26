# 발행 변경 기록 (5차) — 2026-09-26
15개 썸네일 이미지 적용 (홈 1 + 구 4 + 상당구 하위 10)

## 이미지 처리
- 업로드된 15개 PNG(1254×1254)를 각 페이지 키워드에 맞게 매칭 확인(육안 검수: 이미지 안에 새겨진
  지역명 텍스트로 1:1 대조) 후 WebP로 변환(quality 82) — 평균 약 2.4MB → 약 200KB로 축소.
- 저장 위치: `public/assets/images/blog/{slug}.webp` (15개 파일)

## 매칭 결과
| 원본 파일 | 페이지 |
|---|---|
| 1.png | 홈페이지 (청주 방수 업체) |
| 2.png | 서원구 |
| 3.png | 상당구 |
| 4.png | 흥덕구 |
| 5.png | 청원구 |
| 6.png | 낭성면 |
| 7.png | 미원면 |
| 8.png | 가덕면 |
| 9.png | 문의면 |
| 10.png | 남일면 |
| 11.png | 성안동 |
| 12.png | 탑동 |
| 13.png | 대성동 |
| 14.png | 영운동 |
| 15.png | 금천동 |

## 수정 파일
- `public/assets/css/editorial.css` — `.article-hero-image` 스타일 추가(반응형, 모바일 전체폭)
- `public/blog/*/index.html` (14개 전부) —
  1) 히어로 영역에 `<figure class="article-hero-image">` 이미지 삽입
  2) `og:image`, `twitter:image`를 해당 페이지 전용 webp로 교체
  3) BlogPosting JSON-LD에 `image` 필드 추가
- `public/index.html` — `og:image`, `twitter:image`를 홈페이지용 webp로 교체
  (홈페이지 자체 히어로는 기존 커스텀 디자인을 유지하고 이미지를 덧대지 않음 — 이미 실사진 배경과
  자체 타이틀 레이아웃이 있어 텍스트가 새겨진 썸네일을 추가하면 중복·시각적 충돌이 발생하기 때문)

## 검증 결과
- `SITE_URL=https://cjbangsubareunbangsu.pages.dev node scripts/build.mjs` 성공
- dist에 webp 15개 전부 생성 확인(합계 약 3.1MB)
- 14개 블로그 페이지 전부 JSON-LD 파싱 정상, og:image가 실제 도메인으로 정상 치환
- `example.com` 잔존 0건
