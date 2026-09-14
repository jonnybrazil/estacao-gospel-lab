const CACHE_NAME = 'gospel-lab-audio-v1';

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Interceptador de requisições (Proxy Local)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Se a requisição for para arquivos de áudio (.mp3), tratamos com o cache
    if (url.pathname.endsWith('.mp3')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Retorna o áudio instantaneamente do cache interno do celular
                    return cachedResponse;
                }
                // Se por acaso não estiver no cache, tenta buscar na rede
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }
});
