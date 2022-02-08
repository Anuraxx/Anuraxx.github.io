//import * as IDBExportImport from './modules/indexeddb-export-import/index.js';
//import * as FileSaver from './modules/FileSaver.js';

export async function monitorExecTime(prefix, callback){
    let cbResult = null;
    var start= Date.now();
    cbResult = await callback();
    var runtime=Date.now()-start;
    console.log(prefix+runtime/1000+"s");
    return cbResult;
  }
//static second="second";
export class Timer{
  static SEC ="second";
  static MILLISEC = "millisec";
  #msg;
  #st;
  #unit;
  constructor(unit, msg){
    //console.log(unit);
    this.#msg=msg==null?"":msg;
    this.#unit=unit;
    this.#st=null;
  }
  start() {
    this.#st=Date.now();
  }
  setMessage(msg){
    this.#msg=msg;
  }
  #inSecond(time){
    let suffix = "s";
    let runtime = this.#msg+(time/1000)+suffix;
    console.log(runtime);
    return runtime;
  }
  #inMiliSecond(time){
    let suffix = "ms";
    let runtime = this.#msg+time+suffix;
    console.log(runtime);
    return runtime
  }
  stop() {
    let runtime=Date.now()-this.#st;
    switch (this.#unit) {
      case 'second':{
        return this.#inSecond(runtime);
      }
      case 'milisec':{
        return this.#inMiliSecond(runtime);
      }
      default:
        return this.#inMiliSecond(runtime);
    }
    
  }
}


export async function getJsonFromFile(filepath) {
    //var data=null;
    return new Promise((resolve)=>{
      fetch(filepath).then(response => response.json()).then(d => resolve(d));
    });
    //return data;
  }



export async function sheetToJson(fileData){
  var reader = new FileReader();
  var jsonData= null;
  if (reader.readAsBinaryString) {
    return new Promise((resolve)=>{
      reader.onload = function (e) {
          var data = e.target.result;
          var workbook = XLSX.read(data, {type:"binary"});
          //console.log(workbook);
          var sheet = workbook.Sheets["Sheet1"];
          jsonData = XLSX.utils.sheet_to_json(sheet);
          resolve(jsonData);
      };
      reader.readAsBinaryString(fileData);
    });
  }else{
    Promise.reject("Not a function - readAsBinaryString");
  }
}

export function jsonToSheet(jsonArray, filename){
  filename = (filename!=null && (filename=filename.trim())!='') ? filename : 'database_import';
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(jsonArray, {header:[], skipHeader:false});
  
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  var wbout = XLSX.write(wb, {bookType:'xlsx', type:'array'});
  saveAs(new Blob([wbout],{type:"application/octet-stream"}), `${filename}.xlsx`);
  //console.log(ws);
}


// export async function promiseTest () {
//   return new Promise((resolve)=>{
//     setInterval(()=>{
//       console.log("hello");
//       resolve(10);
//     },2000);
//   })
//   //return Promise.resolve(10);
// }

// export function impexp(){ 
//   console.log("impexp");
//   const db = new Dexie('pwa_db');
//   //  console.log(db);
//   db.version(1).stores({
//     items: 'id, name, size, total_units, avbl_units, price, color, material',
//   });
//   db.open().then(function() {
//     const idbDatabase = db.backendDB(); // get native IDBDatabase object from Dexie wrapper
  
//     // export to JSON, clear database, and import from JSON
//     IDBExportImport.exportToJsonString(idbDatabase, function(err, jsonString) {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log('Exported as JSON: ' + jsonString);
//         IDBExportImport.clearDatabase(idbDatabase, function(err) {
//           if (!err) { // cleared data successfully
//             IDBExportImport.importFromJsonString(idbDatabase, jsonString, function(err) {
//               if (!err) {
//                 console.log('Imported data successfully');
//               }
//             });
//           }
//         });
//       }
//     });
//   }).catch(function(e) {
//     console.error('Could not connect. ' + e);
//   });
// }