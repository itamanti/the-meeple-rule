const C='meeple-rule-v11',F=['./','index.html','pdf.min.js','pdf.worker.min.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(new Request(u,{cache:'reload'}))))));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
function fresh(req){
  const n=fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r});
  const t=new Promise(res=>setTimeout(()=>res(null),3000));
  return Promise.race([n.catch(()=>null),t]).then(r=>r||caches.match(req)).then(r=>r||caches.match('index.html')).then(r=>r||n);
}
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url),page=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
  e.respondWith(page?fresh(e.request):caches.match(e.request).then(r=>r||fetch(e.request)));
});
