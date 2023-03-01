import { productCache } from '../cache/ProductCache.js';
import {objectstorePermission, getObjectStore, exportIdbToJson, importIdbFromJson, clearDatabase} from '../IDB.js';
import { Timer } from '../utils/utility.js';

class ProductDao{
    constructor(){
        //this.#pd=new ProductDao();
        // this.getProducts = this.getProducts.bind(this);
        // this.reloadProductCache=this.reloadProductCache.bind(this);
        // this.reloadProductCache0=this.reloadProductCache0.bind(this);
        // this.getProductById=this.getProductById.bind(this);
        // this.test=this.test.bind(this);
    }
    
    async getProducts() {
        let productsOs = await getObjectStore('sample', objectstorePermission.R);
        let products = new Array();
        return new Promise((resolve)=>{
            productsOs.getAll().onsuccess = function(e){
                let res = e.target.result;
                //console.log(res.value);

                let size= res==undefined ? 0 : res.length;

                if(size==0) resolve(products);

                for ( var product of res ) {
                    
                    if(product.avbl_units>0){
                        products.push(product);
                    }
                    if(--size==0) resolve(products);
                }
                
            }
        });
        
        //return products;
    }
    async getProductsUsingCache() {
        if(productCache.getProducts()!=null){
            return productCache.getProducts();
        }
        await this.reloadProductCache();
        return productCache.getProducts();
    }
    
    async reloadProductCache0() {
        return new Promise((resolve)=>{
            this.getProducts().then((products)=>{
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
                //console.log("cache loaded");
                resolve();

            });
        });

    }
    
    async reloadProductCache() {
        const timer = new Timer(Timer.SEC, "product cache loaded in - ");
        timer.start();
        return this.reloadProductCache0().then(()=>{
            timer.stop()
        });
    }
    
    importIdbFromJsonDao(jsonObject){
        importIdbFromJson(jsonObject).then(()=>{
            this.reloadProductCache();
        });
        //loadIDBdata();
    }
    
    exportIdbToJsonDao(){
        return exportIdbToJson(null);
    }
    
    clearDatabaseDao(objectStoreNamesList){
        clearDatabase(objectStoreNamesList);
    }
    
    async updateLeaveDao(id){
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
    async deleteProductDao(id){
        return new Promise((resolve)=>{
            getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
                objectStore.delete(parseInt(id)).onsuccess = function(e){
                    console.log(`deleted id : ${id}`);
                    resolve();
                }
            })
        })
    }
    async addProductDao(jsonObject){
        return new Promise((resolve)=>{
            getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
                objectStore.add(jsonObject).onsuccess = function(e){
                    console.log(`added id : ${jsonObject.id}`);
                    resolve();
                }
            })
        })
    }
    
    async getProductById(id){
        return new Promise((resolve)=>{
            getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
                objectStore.get(id).onsuccess = function(e){
                    resolve(e.target.result);
                }
            })
        })
    }

    async updateProductQty(productData){
        return new Promise((resolve)=>{
            getObjectStore('sample', objectstorePermission.RW).then(objectStore=>{
                objectStore.openCursor(parseInt(productData.id_product)).onsuccess = function(e){
                    let cursor = e.target.result;
                    let cursorObj = cursor.value;
                    cursorObj.avbl_units -= parseInt(productData.qty)>=parseInt(cursorObj.avbl_units)?parseInt(productData.qty):0;
                    cursor.update(cursorObj).onsuccess = function() {
                        //console.log(`Leave update for id : ${id}`);
                        resolve();
                    };
                    
                }
            });
        });
    }
    
}

export const productDao = new ProductDao();
