import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

const config = JSON.parse(
  fs.readFileSync(new URL('../site.config.json', import.meta.url), 'utf8')
);

const demo = process.argv.includes('--demo');
const raw = process.env.SITE_URL || config.siteUrl;

if (!raw && !demo) {
  throw Error('SITE_URL 환경변수 또는 site.config.json의 siteUrl에 실제 대표 도메인을 입력하세요. 로컬 시안은 node scripts/build.mjs --demo');
}

const origin = demo ? 'https://example.com' : new URL(raw).origin;

if (!demo && (!origin.startsWith('https://') || new URL(origin).hostname === 'example.com')) {
  throw Error('실제 HTTPS 도메인을 입력하세요.');
}

const phone = process.env.CONTACT_PHONE || config.phone;
const verification = process.env.NAVER_SITE_VERIFICATION || config.naverVerification;
const escape = s => s.replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const preview = !!process.env.CF_PAGES_BRANCH &&
  process.env.CF_PAGES_BRANCH !== (process.env.PRODUCTION_BRANCH || 'main');

// 1) 기존 배포 결과 삭제
fs.rmSync('dist', { recursive: true, force: true });

// 2) 기존 public 구조/하위페이지/asset은 그대로 유지
fs.cpSync('public', 'dist', { recursive: true });

// 3) 메인 페이지만 루트 index.html을 최종 배포본으로 덮어쓰기
if (!fs.existsSync('index.html')) {
  throw Error('프로젝트 루트 index.html이 없습니다.');
}
fs.copyFileSync('index.html', 'dist/index.html');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);

    if (fs.statSync(file).isDirectory()) {
      walk(file);
      continue;
    }

    if (!/\.(html|xml|txt)$/.test(file)) continue;

    let s = fs.readFileSync(file, 'utf8').replaceAll('https://example.com', origin);

    if (file.endsWith('.html')) {
      if (!demo && !preview && !file.endsWith('404.html')) {
        s = s.replace(
          'content="noindex, nofollow"',
          'content="index, follow, max-image-preview:large"'
        );
      }

      if (verification) {
        s = s.replace(
          '<!-- NAVER_VERIFICATION -->',
          `<meta name="naver-site-verification" content="${escape(verification)}">`
        );
      }

      if (phone) {
        const tel = phone.replace(/[^+\d]/g, '');
        if (!/^\+?\d{8,15}$/.test(tel)) throw Error('전화번호 형식을 확인하세요.');
        s = s.replace(
          /<!-- CONTACT_LINK -->[\s\S]*?<!-- \/CONTACT_LINK -->/,
          `<a href="tel:${tel}" aria-label="전화 상담 ${escape(phone)}">${escape(phone)} ↗</a>`
        );
      }
    }

    fs.writeFileSync(file, s);
  }
}

walk('dist');

const finalHtml = fs.readFileSync('dist/index.html', 'utf8');
const finalTitle = finalHtml.match(/<title>[\s\S]*?<\/title>/i)?.[0] || 'TITLE NOT FOUND';
const finalDescription = finalHtml.match(/<meta\s+name="description"[^>]*>/i)?.[0] || 'DESCRIPTION NOT FOUND';

console.log(`완료: dist / ${demo ? '로컬 시안 noindex' : preview ? '브랜치 미리보기 noindex' : origin + ' 검색 수집 허용'}`);
console.log(`최종 배포 TITLE: ${finalTitle}`);
console.log(`최종 배포 DESCRIPTION: ${finalDescription}`);
