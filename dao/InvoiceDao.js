import { getObjectStore, objectstorePermission } from "../IDB.js";

class InvoiceDao{
    constructor(){}

    async getActiveInvoiceOrderDetail(){
        return new Promise((resolve)=>{
            getObjectStore('orders', objectstorePermission.R).then(objectStore=>{
                objectStore.getAll().onsuccess = function(e) {
                    resolve(e.target.result.pop());
                }
            })
        })
    }

    async prepareNewInvoiceOrder(jsonData){
        return new Promise((resolve)=>{
            getObjectStore('orders', objectstorePermission.RW).then(objectStore=>{
                objectStore.clear().onsuccess = ()=>{
                    objectStore.add(jsonData).onsuccess = function(e) {
                        resolve();
                    }
                }
            })
        })
    }
}

export const invoiceDao = new InvoiceDao();