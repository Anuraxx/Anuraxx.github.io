//import * as idb from './IDB.js';
//import * as utils from './utility.js';
import * as productService from './services/ProductService.js';
import { sheetToJson, Timer, jsonToSheet} from './utils/utility.js';

if('serviceWorker' in navigator){
    //console.log('service worker supported');
    window.onload = ()=>{
        navigator.serviceWorker.register('./sw.js')
        .then(reg=>console.log('service worker registered'))
        .catch(err=>{
            console.log('service worker registration failure');
            console.log(err);
        });
    }
}


var fd = null;
$('#file_upload_test_form').submit(async function (e) { 
    e.preventDefault();
    fd = new FormData(this);
    //console.log("form data:");
    var filedata = fd.get('inpfile');
    //console.log(filedata);
    // var jd = await utils.sheetToJson(filedata);
    // console.log(jd);
    //var data = new Uint8Array(filedata);
    //var v = await utils.promiseTest();
    //console.log(v);
    let jfs = await sheetToJson(filedata);
    let _jfs = {"sample":jfs};
    //_jfs.employee=jfs;
    //console.log(_jfs);
    //idb.importIDBFromJson(_jfs);
    productService.importIdbFromJsonServ(_jfs);
    //  let idbdata = await productService.exportIdbToJsonServ();
    //  console.log(idbdata);
    //  let file = new File([""], './resources/Sample1K.xlsx', {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    // console.log(file);
    //var emp = await idb.getObjectStore("employee",idb.objectstorePermission.R);
    //console.log(emp);
    //jsonToSheet(idbdata['employee']);
});

function clearDatabase(){
    productService.clearDatabaseServ();
}     
// $(document).ready(async () => {
//     try {
//         var prod = await productService.searchProduct('B', null);
//         console.log("result:");
//         console.log(prod);
//     } catch (error) {
//         console.log(error);
//     }
// });




// import * as mod from './utility.js';
// console.log(await mod.getJsonFromFile('./resources/items.json',()=>{console.log('import done');}));