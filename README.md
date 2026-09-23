# 청주방수 재배포 파일

이 압축 파일을 풀어 **압축 안의 파일과 폴더를 GitHub 저장소 최상위에** 올립니다. `청주방수_재배포_정리본`이라는 상위 폴더를 통째로 올리지 마세요.

GitHub 저장소 최상위에는 `public/`, `scripts/`, `package.json`, `site.config.json`, `README.md` 등이 보입니다.

Cloudflare Pages → Settings → Build → Build configuration:
- Build command: `node scripts/build.mjs`
- Build output: `dist`
- Root directory: 비움 (저장소 최상위)
- Production branch: `main`

`SITE_URL` 환경변수는 필수가 아닙니다. `site.config.json`에 현재 주소가 입력되어 있습니다. 이미 같은 이름으로 설정되어 있어도 그대로 두어도 됩니다. GitHub `main`에 커밋되면 자동 배포됩니다.

배포 성공 후 https://cjbangsubareunbangsu.pages.dev/naver5c085a3f735f8be533dfc3c0842e5ba3.html 을 열어 `naver-site-verification:` 한 줄이 보이면 네이버 서치어드바이저의 [소유확인]을 누릅니다. 파일명 중 `533dfc3c`를 정확히 확인하세요.

도메인을 바꾸면 `site.config.json`의 `siteUrl`과 Cloudflare의 `SITE_URL` 값이 있다면 둘 다 새 주소로 바꾸세요.

RSS 제출: 배포 후 https://cjbangsubareunbangsu.pages.dev/rss.xml 을 열어 XML이 표시되면 네이버 서치어드바이저 → 요청 → RSS 제출에 전체 URL을 입력하세요. 페이지 내용을 변경하면 RSS도 갱신해야 합니다.
