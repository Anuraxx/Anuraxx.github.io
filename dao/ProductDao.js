import { productCache } from '../cache/ProductCache.js';
import {objectstorePermission, getObjectStore, exportIdbToJson, importIdbFromJson, clearDatabase} from '../IDB.js';


export async function _getProducts() {
    let productsOs = await getObjectStore('sample', objectstorePermission.R);
    let products = new Array();
    return new Promise((resolve)=>{
        productsOs = productsOs.openCursor();
        productsOs.onsuccess = function(e){
            let res = e.target.result;
            //console.log(res.value);
            if(res ){//&& products.length<10
                res.continue();
                products.push(res.value);
            }else{
                resolve(products);
            }
        }
    });
    
    //return products;
}
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
        productsOs = productsOs.getAll();
        productsOs.onsuccess = function(e){
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

export async function reloadProductCache() {
    try {
        let products = await getProducts();
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
    } catch (error) {
        console.log("product cache loading failure");
    }
}

export function importIdbFromJsonDao(jsonObject){
    importIdbFromJson(null,jsonObject);
    //loadIDBdata();
}

export function exportIdbToJsonDao(){
    return exportIdbToJson(null);
}

export function clearDatabaseDao(){
    clearDatabase();
}