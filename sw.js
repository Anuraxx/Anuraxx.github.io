const cacheName = 'cache.v1.pwa.smlx';
// const cacheStaticAssets=[
//     './index.html'
// ];
self.addEventListener('install', (e)=>{
    console.log('sw installed');

    // e.waitUntil(
    //     caches.open(cacheName).then(cache=>{
    //         cache.addAll(cacheStaticAssets);
    //     }).then(() => self.skipWaiting())
    // );
})

self.addEventListener('activate', (e)=>{
    console.log('sw activated');

    // e.waitUntil(
    //     caches.keys().then(cacheName=>{
    //         return Promise.all(cacheName.map(cache=>{
    //             if(cache!=cacheName){
    //                 return caches.delete(cache);
    //             }
    //         }))
    //     })
    // );
})

self.addEventListener('fetch', (e)=>{
    //console.log('sw fetching');

    e.respondWith(
        fetch(e.request).then(res=>{
            let cloneRes = res.clone();
            caches.open(cacheName).then(cache=>{
                cache.put(e.request, cloneRes);
            });
            return res;
        }).catch(err=>{
            caches.match(e.request).then(res=>res);
        })
        //caches.match(e.request).then(res=>res)
    );
})