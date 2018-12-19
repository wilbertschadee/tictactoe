const cacheName = 'v1';
const cacheAssets = [
    'index.html',
    'style.css',
    'js/script.js',
    'js/swReg.js'
];


self.addEventListener('install', event => {
    console.log('Service Worker: Installed');

    event.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log('Service Worker: Caching Files');
            cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', event => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );  
});

self.addEventListener('fetch', event => {
        console.log('Service Worker: Fetching');
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    });