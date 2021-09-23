const cacheName = 'pwa.smlx.v1';
 const cacheStaticAssets=[
     './'
 ];
self.addEventListener('install', (e)=>{
    console.log('sw installed');

    //  e.waitUntil(
    //      caches.open(cacheName).then(cache=>{
    //          return cache.addAll(cacheStaticAssets);
    //      }).then(() => self.skipWaiting())
    //  );
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
    console.log(e.request.url);

    e.respondWith(
        fetch(e.request).then(res=>{
            console.log("using fetch");
            let cloneRes = res.clone();
            caches.open(cacheName).then(cache=>{
                cache.put(e.request, cloneRes);
            });
            return res;
        }).catch(err=>{
            console.log("using cache");
            caches.match(e.request).then(res=>{return res;});
        })
        // caches.match(e.request).then(res=>{
        //     return res || fetch (e.request);
        // })
    );
})
