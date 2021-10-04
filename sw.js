const cacheName = 'pwa.smlx.v1';
//const cacheStaticAssets= 

self.addEventListener('install', (e)=>{
    console.log('sw installed');

    //  e.waitUntil(
    //      caches.open(cacheName).then(cache=>{
    //         // return cache.addAll(cacheStaticAssets);
    //         fetch('./cacheStaticAssets.json').then((dataArray)=>{
    //             dataArray.text().then(async(assetArray)=>{
    //                 //console.log(d)
    //                 assetArray = JSON.parse(assetArray);
    //                 return cache.addAll(assetArray);
    //             })
    //         }).catch(err=>console.log('failed to load static cache assets'));
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
    //console.log(e.request.url);
    //fetch(e.request).then(response=>{return response})
    function handleByNetwork() { 
        e.respondWith(
            fetch(e.request).then(res=>{
                //console.log(res);
                if(res!=undefined){
                    console.log("handled by network");
                }
                //console.log("using fetch");
                let cloneRes = res.clone();
                caches.open(cacheName).then(cache=>{
                    cache.put(e.request, cloneRes);
                });
                return res;
            }).catch(err=>{
                console.log("request failed");
            })
        );
    }
    function handleByCache() {
        e.respondWith(
            caches.match(e.request).then(resp=>{
                //console.log(resp);
                if(resp!=undefined){
                    //console.log("handled by cache");
                }
                return  fetch(e.request).then(response=>{
                    // console.log("resolved by network");
                    // let cloneRes = response.clone();
                    // caches.open(cacheName).then(cache=>{
                    //     cache.put(e.request, cloneRes);
                    // });
                    return response;
                })
            })
        )
    }
    handleByCache();
})
