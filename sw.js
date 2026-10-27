const V='go-schule-v7';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){ // App: erst Netz (Updates), sonst Cache (offline)
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put('index.html',c));return r}).catch(()=>caches.match('index.html')));return}
  if(u.hostname.endsWith('fonts.googleapis.com')||u.hostname.endsWith('fonts.gstatic.com')||u.origin===location.origin){ // Schriften und Dateien: Cache zuerst
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r})))}
});
