import { monitorExecTime, getJsonFromFile, sheetToJson } from './utils/utility.js';
import { createSchema } from './schema.js';
import * as IDBExportImport from './modules/indexeddb-export-import/index.js';

var IDBrequest;
let dbExist = true;
var idb = null;
// export const RW = 'readwrite';
// export const R = 'readonly';
export const objectstorePermission = {
    RW: 'readwrite',
    R: 'readonly'
}
const DATABASE_NAME='pwa.invoiceapp.smlx';
const DATABASE_VERSION=1;
var dbAccessible = false;

var initIDB = () => {
    IDBrequest = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
}
var openIDB = () => {
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        alert('idb not supported')
        return;
    }
    dbAccessible=false;
    if(idb!=null)idb.close();
    monitorExecTime("idb initialization time - ", initIDB);
}


openIDB();


IDBrequest.onupgradeneeded = async function (e) {
    //console.log("on upgneed");
    alert("upgrading");
    dbExist = false;
    console.log('creating db..');
    idb = e.target.result;
    try {
        //createSchema.products(idb);
        //createSchema.invoice(idb);
        createSchema.sample(idb);
    } catch (error) {
        //console.log(error);
        throw error;
    }
}

IDBrequest.onsuccess = function (e) {
    //console.log("on success");
    if (dbExist) console.log('db existed');

    idb = e.target.result;
    try {
        dbAccessible = true;
        //exportIdbToJson(idb);
        if(!dbExist) {
            loadIDBdata();
        }
    } catch (error) {
        throw error;
    } finally {
        //idb.close();
    }
};
IDBrequest.onerror = function (e) {
    console.log("onError()");
    console.log(e.error);
}

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

async function loadIDBdata() {
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
        //    console.log(items);
            //var objectStore = await getObjectStore("products", objectstorePermission.RW); 
            importIdbFromJson(idb, items);
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

export async function exportIdbToJson(idbResult){
    await isDbAccessible();
    IDBExportImport.exportToJsonString(idbResult==null?idb:idbResult, function(err, jsonString) {
      if (err) {
        console.error(err);
      } else {
          console.log('Exported data successfully');
        //console.log('Exported as JSON: ' + jsonString);
        //alert(jsonString);
      }
    });
  }
  
export async function importIdbFromJson(idbResult, jsonString){
    await isDbAccessible();
    jsonString = JSON.stringify(jsonString);
    IDBExportImport.clearDatabase(idbResult==null?idb:idbResult, function(err) {
      if (!err) { // cleared data successfully
        IDBExportImport.importFromJsonString(idbResult==null?idb:idbResult, jsonString, function(err) {
          if (!err) {
            console.log('Imported data successfully');
            alert('Imported data successfully');
          }
        });
      }
    });
  }

// export async function importIDBFromJson(jsonString){
//     await isDbAccessible();
//     importIdbFromJson(idb, jsonString);
// }

export async function clearDatabase(idbResult){
    try {
        //await isDbAccessible();
        IDBExportImport.clearDatabase(idbResult==null?idb:idbResult, function(err) {
            if(err){
                throw err;
            }
            console.log("Database cleared");
            alert("Database cleared");
        });
    } catch (error) {
        throw error;
    }
}