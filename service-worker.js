/* =========================================================
   S&S CONTROL DE ASISTENCIA — SERVICE WORKER
   Archivo real (antes se generaba al vuelo con un Blob URL,
   lo cual es poco confiable para que el navegador reconozca
   la app como instalable). Con un archivo real y externo,
   la instalación como PWA queda garantizada.

   IMPORTANTE: cada vez que subas una versión nueva de
   index.html, cambiá CACHE_NAME acá también (por ejemplo
   'attendx-v1.1'), para forzar que el navegador descargue
   los archivos nuevos. Para probar cambios: modo incógnito,
   o desinstalar y reinstalar la app.
   ========================================================= */

const CACHE_NAME = 'attendx-v1.0';

const ARCHIVOS_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ARCHIVOS_CACHE).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(nombres){
      return Promise.all(
        nombres.filter(function(n){ return n !== CACHE_NAME; })
               .map(function(n){ return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(function(){
        return caches.match(e.request).then(function(r){
          return r || caches.match('./index.html');
        });
      })
    );
  }
});
