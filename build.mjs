import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(
  fileURLToPath(
    new URL('..', import.meta.url)
  )
);

fs.rmSync('dist', {
  recursive: true,
  force: true
});

fs.mkdirSync('dist', {
  recursive: true
});

/* 루트 index.html */
fs.copyFileSync(
  'index.html',
  'dist/index.html'
);

/* assets */
if (fs.existsSync('assets')) {
  fs.cpSync(
    'assets',
    'dist/assets',
    {
      recursive: true
    }
  );
}

/* 하위 페이지 */
const folders = [
  'balcony-waterproofing',
  'basement',
  'bathroom',
  'cheongwon-gu',
  'crack-repair',
  'exterior',
  'heungdeok-gu',
  'parking-waterproofing',
  'rooftop',
  'sangdang-gu',
  'seowon-gu',
  'terrace-waterproofing',
  'window-frame-waterproofing'
];

for (const folder of folders) {
  if (fs.existsSync(folder)) {
    fs.cpSync(
      folder,
      path.join('dist', folder),
      {
        recursive: true
      }
    );
  }
}

/* 루트 파일 */
const rootFiles = [
  '404.html',
  '_headers',
  'robots.txt',
  'sitemap.xml',
  'rss.xml',
  'naver5c085a3f735f8be533dfc3c0842e5ba3.html'
];

for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(
      file,
      path.join('dist', file)
    );
  }
}

console.log('BUILD OK');
console.log(
  fs.readFileSync(
    'dist/index.html',
    'utf8'
  ).match(/<title>.*?<\/title>/)?.[0]
);
