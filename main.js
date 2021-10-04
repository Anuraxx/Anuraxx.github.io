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

$('button').on('click', function(){
  console.log('clicked');
  $(this).addClass('btn-click');
  setTimeout(()=>{
    $(this).removeClass('btn-click');
  },100)
  
})

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
    sheetToJson(filedata).then(jsonData => {
      productService.importIdbFromJsonServ({"sample":jsonData, "orders":{}, "pendingInvoice":{}});
    });
    //_jfs.employee=jfs;
    //console.log(_jfs);
    //idb.importIDBFromJson(_jfs);
    
    
    //  let idbdata = await productService.exportIdbToJsonServ();
    //  console.log(idbdata);
    //  let file = new File([""], './resources/Sample1K.xlsx', {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    // console.log(file);
    //var emp = await idb.getObjectStore("employee",idb.objectstorePermission.R);
    //console.log(emp);
    //jsonToSheet(idbdata['employee']);
});
async function postData(url, data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
  }
//console.log("requesting https://github.com/Anuraxx/anuraxx.github.io/pulls/");
//postData("https://github.com/Anuraxx/anuraxx.github.io/pulls/", {}).then(resp=>console.log("resp recv"));
// $(document).ready(async () => {
//     try {
//         var prod = await productService.searchProduct('B', null);
//         console.log("result:");
//         console.log(prod);
//     } catch (error) {
//         console.log(error);
//     }
// });


//console.log(new Sample("desc","emarkme","leav","id","name").get());
// $("#cart").click(function () {
//   $(this).hide();
// })


// Set up quantity forms





// import * as mod from './utility.js';
// console.log(await mod.getJsonFromFile('./resources/items.json',()=>{console.log('import done');}));