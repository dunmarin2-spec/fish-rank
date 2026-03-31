const CACHE_NAME = 'fishing-v2'; // 버전을 v2로 올림
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. 설치 단계: 새로운 파일들을 캐시에 저장
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // 새로운 서비스 워커가 즉시 활성화되도록 함
});

// 2. 활성화 단계: 옛날 버전(v1) 캐시를 삭제 (이게 핵심!)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. 네트워크 우선 전략 (아이콘 업데이트를 위해 변경)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
