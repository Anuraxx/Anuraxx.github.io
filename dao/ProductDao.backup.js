import { productCache } from '../cache/ProductCache.js';
import {objectstorePermission, getObjectStore, exportIdbToJson, importIdbFromJson, clearDatabase} from '../IDB.js';
//import { reloadProductsCache } from '../services/ProductService.js';
import { monitorExecTime } from '../utils/utility.js';


// export async function getProducts() {
//     let productsOs = await getObjectStore('sample', objectstorePermission.R);
//     let products = new Array();
//     return new Promise((resolve)=>{
//         productsOs = productsOs.openCursor();
//         productsOs.onsuccess = function(e){
//             let res = e.target.result;
//             //console.log(res.value);
//             if(res ){//&& products.length<10
//                 res.continue();
//                 products.push(res.value);
//             }else{
//                 resolve(products);
//             }
//         }
//     });
    
//     //return products;
// }
// export async function reloadProductsCache(){
//     this.#products= await monitorExecTime(`products loaded in : `, pd.getProducts);
//     this.#products.sort(function(a, b){
//         try{
//             let x = a.name.toLowerCase();
//             let y = b.name.toLowerCase();
//             if (x < y) {return -1;}
//             if (x > y) {return 1;}
//         }catch(err){
//             return 0;
//         }
        
//     });
// }

export async function getProducts() {
    let productsOs = await getObjectStore('sample', objectstorePermission.R);
    let products = new Array();
    return new Promise((resolve)=>{
        productsOs.getAll().onsuccess = function(e){
            let res = e.target.result;
            //console.log(res.value);
            res.forEach(element => {
                products.push(element);
            });
            resolve(products);
        }
    });
    
    //return products;
}
export async function getProductsUsingCache() {
    if(productCache.getProducts()!=null){
        return productCache.getProducts();
    }
    await reloadProductCache();
    return productCache.getProducts();
}

async function reloadProductCache0() {
    try {
        return new Promise((resolve)=>{
            getProducts().then(products=>{
                products.sort(function(a, b){
                    try{
                        let x = a.name.toLowerCase();
                        let y = b.name.toLowerCase();
                        if (x < y) {return -1;}
                        if (x > y) {return 1;}
                    }catch(err){
                        return 0;
                    }
                    
                });
                productCache.setProduct(products);
                resolve();

            });
        });
    } catch (error) {
        console.log("product cache loading failure");
    }
}

export async function reloadProductCache() {
    monitorExecTime("product cache loaded in - ", reloadProductCache0);
}

export function importIdbFromJsonDao(jsonObject){
    importIdbFromJson(null,jsonObject).then(reloadProductCache);
    //loadIDBdata();
}

export function exportIdbToJsonDao(){
    return exportIdbToJson(null);
}

export function clearDatabaseDao(){
    clearDatabase();
}

export async function updateLeaveDao(id){
    return new Promise((resolve)=>{
        getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
            objectStore.openCursor(parseInt(id)).onsuccess = function(e){
                let cursor = e.target.result;
                let cursorObj = cursor.value;
                cursorObj.Leave += 1;
                cursor.update(cursorObj).onsuccess = function() {
                    console.log(`Leave update for id : ${id}`);
                    resolve();
                };
                
            }
        });
    });
    
}
// export async function _updateLeaveDao(id){
//     return new Promise((resolve)=>{
//         getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
//             objectStore.get(parseInt(id)).onsuccess = function(e){
//                 let productObj = e.target.result;
//                 productObj.Leave += 1;
//                 objectStore.put(productObj).onsuccess = ()=>{
//                     console.log(`Leave update for id : ${id}`);
//                     resolve();
//                 };
                
                
//             }
//         });
//     });
    
// }
export async function deleteProductDao(id){
    return new Promise((resolve)=>{
        getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
            objectStore.delete(parseInt(id)).onsuccess = function(e){
                console.log(`deleted id : ${id}`);
                resolve();
            }
        })
    })
}
export async function addProductDao(jsonObject){
    return new Promise((resolve)=>{
        getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
            objectStore.add(jsonObject).onsuccess = function(e){
                console.log(`added id : ${jsonObject.id}`);
                resolve();
            }
        })
    })
}

export async function getProductById(id){
    return new Promise((resolve)=>{
        getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
            objectStore.get(id).onsuccess = function(e){
                resolve(e.target.result);
            }
        })
    })
}