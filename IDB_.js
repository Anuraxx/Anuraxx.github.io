import { monitorExecTime, getJsonFromFile, sheetToJson } from './utils/utility.js';
import { createSchema } from './schema.js';
import * as IDBExportImport from './modules/indexeddb-export-import/index.js';

// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// // DON'T use "var indexedDB = ..." if you're not in a function.
// // Moreover, you may need references to some window.IDB* objects:
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// var IDBrequest;
// let dbExist = true;
// var idb = null;
export const objectstorePermission = {
    RW: 'readwrite',
    R: 'readonly'
}
const DATABASE_NAME='ml_pwa_db';
const DATABASE_VERSION=1;
var dbAccessible = false;

var initIDB = function(){
    return new Promise((resolve)=>{
        let IDBrequest;
        let dbExist = true;
        let idb = null;

        IDBrequest = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        
        IDBrequest.onupgradeneeded = async function (e) {
            console.log("ibd upgrading");
            dbExist = false;
            console.log('creating db..');
            idb = e.target.result;
            try {
                //createSchema.products(idb);
                //createSchema.invoice(idb);
                createSchema.employee(idb);
            } catch (error) {
                //console.log(error);
                throw error;
            }
        }
        
        IDBrequest.onsuccess = function (e) {
            console.log("idb on success");
            if (dbExist) console.log('db existed');
        
            idb = e.target.result;
            
            try {
                dbAccessible = true;
                //exportIdbToJson(idb);
                if(!dbExist) {
                    loadIDBdata();
                }
                resolve(idb);
            } catch (error) {
                throw error;
            } finally {
                //idb.close();
            }
        };
        IDBrequest.onerror = function (e) {
            console.log("on Error");
            console.log(e.error);
        }
    });
}
var openIDB = function(){
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        alert('idb not supported')
        return;
    }
    dbAccessible=false;
    //if(idb!=null)idb=null;
    return monitorExecTime("idb initialization time - ", initIDB);
}

openIDB();




function isDbAccessible() {
    return new Promise((resolve, reject) => {
        var intv = setInterval(() => {
            if (dbAccessible) {
                resolve(true);
                clearInterval(intv);
                clearTimeout(tmo);
            }
        }, 1);
        var tmo = setTimeout(() => {
            reject("Timeout : Error opening database");
            clearInterval(intv);
            openIDB();
        }, 5000);
    });
}
export async function getObjectStore(storename, permission) {
    try{
        //openIDB();
        let dba = await isDbAccessible();
        var transaction = idb.transaction(storename, permission);
        return transaction.objectStore(storename);
    }catch(error){
        throw error;
    }finally{
        //idb.close();
    }
}


// function createIDBschema(){
//     var objectStore = null;
//     try{
//         objectStore = idb.createObjectStore("products", { keyPath: "id" });
//         objectStore.createIndex("name", "name", { unique: false });   // createIndex(column_name, ref_key_in_object)
//         objectStore.createIndex("size", "size", { unique: false });
//         objectStore.createIndex("total_units", "total_units", { unique: false });
//         objectStore.createIndex("avl_units", "avl_units", { unique: false });
//         objectStore.createIndex("price", "price", { unique: false });
//         objectStore.createIndex("color", "color", { unique: false });
//         objectStore.createIndex("material", "material", { unique: false });
//         // objectStore = idb.createObjectStore("products", { keyPath: "Serial Number" });
//         // objectStore.createIndex("Company Name", "Company Name", { unique: false });   // createIndex(column_name, ref_key_in_object)
//         // objectStore.createIndex("Employee Markme", "Employee Markme", { unique: false });
//         // objectStore.createIndex("Description", "Description", { unique: false });
//         // objectStore.createIndex("Leave", "Leave", { unique: false });
//     }catch(error){
//         throw error;
//     }
//     return objectStore;
// }

export async function loadIDBdata() {
    try {
        // let objs = idb.transaction(["products"], "readwrite");
        // objs.oncomplete = async function (event) {
        //     //activeSchema++;
        //     // console.log(activeSchema);
        //     // if (activeSchema == totalSchema) {
        //     //     loadIDBdata();
        //     // }
            console.log("loding data");
            var items = await getJsonFromFile('./resources/idbToJson2.json');
            console.log(items);
            //var objectStore = await getObjectStore("products", objectstorePermission.RW); 
            importIdbFromJson(null, items);
        // }
        // var newItem = [
        //     { taskTitle: "Walk dog", hours: 19, minutes: 30, day: 24, month: 'December', year: 2013, notified: "no" },
        //     { taskTitle: "feed dog", hours: 9, minutes: 30, day: 13, month: 'May', year: 2011, notified: "no" }
        //   ];
        // console.log("loding data");
        // let jsonFromSheet = await sheetToJson();
        // var items = await getJsonFromFile('./resources/idbToJson.json');
        // //var objectStore = await getObjectStore("products", objectstorePermission.RW); 
        // importIdbFromJson(idb, items);
        // objectStore.add(newItem[0]);
        // objectStore.add(newItem[1]);
        // items.forEach(element => {
        //     objectStore.add(element);
        // });
    } catch (error) {
        throw error;
    }
}

// export async function getItem() {
//     var obst = await getObjectStore('items', R);
//     var obs = obst.openCursor();
//     var obs2 = obst.get('Walk dog');
//     var res;
//     obs.onsuccess = function (e) {
//         res = e.target.result;
//         //console.log(res.value);
//         if (res) {
//             res.continue();
//             console.log(res.value);
//         }
//     }
//     obs2.onsuccess = function (e) {
//         // res = e.target.result;
//         // console.log(res);
//     }
//     return res;
// }

// export var update = async (taskTitle, )=>{
//     var obst = await getObjectStore('items',R);
// }
//export objectstorePermission;

async function getIdbConnection(){
    return new Promise((resolve)=>{
        let idbConReq = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        idbConReq.onupgradeneeded= function(event){
            createSchema.employee(idb);
        }
        idbConReq.onsuccess = function(event){
            resolve(event.target.result);
        }
        idbConReq.onerror = function(event) {
            
        }
    })
}

// async function doOperation(js, cb){
//     return new Promise((resolve)=>{
//         let idbConReq = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
//         idbConReq.onupgradeneeded= function(event){

//         }
//         idbConReq.onsuccess = function(event){
//             cb(event.target.result, js);
//         }
//         idbConReq.onerror = function(event) {
            
//         }
//     })
// }

export async function exportIdbToJson(idbResult){
    //await isDbAccessible();
    let idbCon = await openIDB();
    return new Promise((resolve)=>{
        IDBExportImport.exportToJsonString(idbCon, function(err, jsonString) {
            if (err) {
                console.error(err);
            } else {
                console.log('Exported data successfully');
                //console.log('Exported as JSON: ' + jsonString);
                resolve(JSON.parse(jsonString));
                //alert(jsonString);
                //Promise.resolve();
            }
        });
    });
  }

export async function importIdbFromJson(idbResult, jsonString){
    //await isDbAccessible();
    let idbCon=idbResult;
    try {
        jsonString = JSON.stringify(jsonString);
        idbCon = await getIdbConnection();
        console.log(idbCon);
        IDBExportImport.clearDatabase(idbCon, function(err) {
            if (!err) { // cleared data successfully
                console.log(idbCon);
                IDBExportImport.importFromJsonString(idbCon, jsonString, function(err) {
                    if (!err) {
                        console.log('Imported data successfully');
                        alert('Imported data successfully');
                    }
                });
            }
        });
    } catch (error) {
        throw error;
    }finally{
        idbCon.close();
    }
    
  }
// export function importIdbFromJsonAsync(jsonString) {  
//     doOperation(jsonString, importIdbFromJson);
// }  

export async function clearDatabase(idbResult){
    try {
        //await isDbAccessible();
        IDBExportImport.clearDatabase(idbResult==null?idb:idbResult, function(err) {
            if(err){
                throw err;
            }
            console.log("Database cleared");
        });
    } catch (error) {
        throw error;
    }
}
// try {
//     console.log(await clearDatabase());
// } catch (error) {
//     console.log(error);
// }

// export async function importIDBFromJson(jsonString){
//     await isDbAccessible();
//     importIdbFromJson(idb, jsonString);
// }