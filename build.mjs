import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* =========================================================
   1. 프로젝트 루트로 이동
========================================================= */

process.chdir(
  fileURLToPath(
    new URL('..', import.meta.url)
  )
);


/* =========================================================
   2. 사이트 설정 불러오기
========================================================= */

const config = JSON.parse(
  fs.readFileSync(
    new URL('../site.config.json', import.meta.url),
    'utf8'
  )
);


/* =========================================================
   3. 기본 환경 설정
========================================================= */

const demo = process.argv.includes('--demo');

const raw =
  process.env.SITE_URL ||
  config.siteUrl;


/* 실제 사이트 URL 확인 */
if (!raw && !demo) {
  throw Error(
    'SITE_URL 환경변수 또는 site.config.json의 siteUrl에 실제 대표 도메인을 입력하세요. 로컬 시안은 node scripts/build.mjs --demo'
  );
}


/* 대표 도메인 설정 */
const origin = demo
  ? 'https://example.com'
  : new URL(raw).origin;


/* example.com 배포 방지 */
if (
  !demo &&
  (
    !origin.startsWith('https://') ||
    new URL(origin).hostname === 'example.com'
  )
) {
  throw Error(
    '실제 HTTPS 도메인을 입력하세요.'
  );
}


/* =========================================================
   4. 연락처 / 네이버 인증 설정
========================================================= */

const phone =
  process.env.CONTACT_PHONE ||
  config.phone;

const verification =
  process.env.NAVER_SITE_VERIFICATION ||
  config.naverVerification;


/* HTML 특수문자 처리 */
const escape = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[c]
  );


/* =========================================================
   5. Cloudflare Preview 여부 확인
========================================================= */

const preview =
  !!process.env.CF_PAGES_BRANCH &&
  process.env.CF_PAGES_BRANCH !==
    (process.env.PRODUCTION_BRANCH || 'main');


/* =========================================================
   6. dist 초기화
========================================================= */

fs.rmSync(
  'dist',
  {
    recursive: true,
    force: true
  }
);


/* =========================================================
   7. public 폴더 → dist 복사
========================================================= */

if (fs.existsSync('public')) {
  fs.cpSync(
    'public',
    'dist',
    {
      recursive: true
    }
  );
}


/* =========================================================
   8. ★ 루트 index.html을 최종 index.html로 사용
========================================================= */

/*
   앞으로 GitHub 루트의

   /index.html

   만 수정하면 됩니다.

   public/index.html이 있더라도
   아래 코드에서 루트 index.html로 덮어씁니다.
*/

if (!fs.existsSync('index.html')) {
  throw Error(
    '프로젝트 루트에 index.html 파일이 없습니다.'
  );
}

fs.copyFileSync(
  'index.html',
  'dist/index.html'
);


/* =========================================================
   9. dist 내부 파일 처리
========================================================= */

function walk(dir) {

  for (const name of fs.readdirSync(dir)) {

    const file = path.join(
      dir,
      name
    );

    const stat = fs.statSync(file);


    /* 폴더면 재귀 탐색 */
    if (stat.isDirectory()) {
      walk(file);
      continue;
    }


    /* HTML / XML / TXT만 처리 */
    if (!/\.(html|xml|txt)$/i.test(file)) {
      continue;
    }


    /* 파일 읽기 */
    let s = fs.readFileSync(
      file,
      'utf8'
    );


    /* =====================================================
       example.com → 실제 도메인 치환
    ===================================================== */

    s = s.replaceAll(
      'https://example.com',
      origin
    );


    /* =====================================================
       HTML 파일 추가 처리
    ===================================================== */

    if (file.endsWith('.html')) {

      /* -----------------------------------------------
         Production에서는 index/follow
         Preview / Demo에서는 noindex 유지
      ------------------------------------------------ */

      if (
        !demo &&
        !preview &&
        !file.endsWith('404.html')
      ) {

        s = s.replace(
          'content="noindex, nofollow"',
          'content="index, follow, max-image-preview:large"'
        );

      }


      /* -----------------------------------------------
         네이버 사이트 인증
      ------------------------------------------------ */

      if (verification) {

        s = s.replace(
          '<!-- NAVER_VERIFICATION -->',
          `<meta name="naver-site-verification" content="${escape(verification)}">`
        );

      }


      /* -----------------------------------------------
         전화번호 자동 적용
      ------------------------------------------------ */

      if (phone) {

        const tel =
          phone.replace(
            /[^+\d]/g,
            ''
          );


        if (!/^\+?\d{8,15}$/.test(tel)) {
          throw Error(
            '전화번호 형식을 확인하세요.'
          );
        }


        s = s.replace(
          /<!-- CONTACT_LINK -->[\s\S]*?<!-- \/CONTACT_LINK -->/,
          `<a href="tel:${tel}" aria-label="전화 상담 ${escape(phone)}">${escape(phone)} ↗</a>`
        );

      }

    }


    /* 수정된 파일 저장 */
    fs.writeFileSync(
      file,
      s
    );

  }

}


/* dist 전체 처리 */
walk('dist');


/* =========================================================
   10. 빌드 완료 로그
========================================================= */

console.log(
  `완료: dist / ${
    demo
      ? '로컬 시안 noindex'
      : preview
        ? '브랜치 미리보기 noindex'
        : origin + ' 검색 수집 허용'
  }`
);

console.log(
  '메인 페이지: 루트 /index.html → /dist/index.html 자동 배포'
);
