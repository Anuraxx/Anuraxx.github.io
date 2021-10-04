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
                res.forEach(element => {
                    products.push(element);
                });
                resolve(products);
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
        //try {
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
        // } catch (error) {
        //     console.log("product cache loading failure");
        // }
    }
    
    async reloadProductCache() {
        const timer = new Timer(Timer.SEC, "product cache loaded in - ");
        timer.start();
        return this.reloadProductCache0().then(()=>{
            timer.stop()
        });
    }
    
    importIdbFromJsonDao(jsonObject){
        importIdbFromJson(null,jsonObject).then(()=>{
            this.reloadProductCache();
        });
        //loadIDBdata();
    }
    
    exportIdbToJsonDao(){
        return exportIdbToJson(null);
    }
    
    clearDatabaseDao(){
        clearDatabase();
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

    
}

export const productDao = new ProductDao();
