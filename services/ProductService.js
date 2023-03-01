import {productDao as pd} from '../dao/ProductDao.js';
import { test } from '../test/test1.js';
import { Timer } from '../utils/utility.js';

function compareProductByName(str1, str2, m, n){
    if(m==0 || n==0) return [false];
    let j = 0;
    let priority = 0;
    for (let i = 0; i < n && j < m; i++)
        if (str1[j] == str2[i]){
            j++;
            priority += i;
        }

    return [j==m, priority];
}

// export async function searchProduct(name, products){
  
//     if(products==null || products.length==0){
//         console.log("product : null");
//         products = await pd.getProducts();
//         return searchProduct(name, products);
//     }
//     //console.log("p size : "+products.length);
//     let searchResult = new Array();
//     products.forEach(product => {
//         try{
//             let matchResult = compareProductByName(name.toLowerCase(), product.name.toLowerCase(), name.length, product.name.length);
//             if(matchResult[0]){
//                 product.priority = matchResult[1];
//                 searchResult.push(product);
//             };
//         }catch(error){
//             console.log("error at : ");
//             console.log(product);
//         }
//     });
//     //console.log(searchResult);
//     return searchResult;

// }

// export async function searchProduct(name, products){
//     //console.log("''''''''''X''''''''");
//     if(products==null || products.length==0){
//         console.log("product : null");
//         products = await pd.getProducts();
//         if(products.length==0){
//             return products;
//         }
//         return searchProduct(name, products);
//     }
//     //console.log("p size : "+products.length);
//     let searchResult = new Array();
//     products.forEach(product => {
//         try{
//             let matchResult = compareProductByName(name.toLowerCase(), product.name.toLowerCase(), name.length, product.name.length);
//             if(matchResult[0]){
//                 product.priority = matchResult[1];
//                 searchResult.push(product);
//             };
//         }catch(error){
//             // console.log("error at : ");
//             // console.log(product);
//         }
//     });
//     //console.log(searchResult);
//     return searchResult;

// }

export async function searchProduct(name){
    try{
        let products = await pd.getProductsUsingCache();
        //console.log("p size : "+products.length);
        let searchResult = new Array();
        products.forEach(product => {
            try{
                let matchResult = compareProductByName(name.toLowerCase(), product.name.toLowerCase(), name.length, product.name.length);
                if(matchResult[0]){
                    product.priority = matchResult[1];
                    searchResult.push(product);
                };
            }catch(error){
                
                console.log("###error######error######error####");
                //console.log(error);
            }
        });
        //console.log(searchResult);
        return searchResult;
    }catch(error){
        console.log(error);
    }
    return [];

}

// async function reloadProductsCache(){
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
//     //console.log("products loaded");
// }
export async function reloadProductsCache() {
    return pd.reloadProductCache();
}

// function getOperationalIndex(query, prvQuery){
//     let maxLen = Math.max(query.length,prvQuery.length);
//     for(let i=0;i<maxLen;i++){
//         if(query[i]!=prvQuery[i]){
//             return i;
//         }
//     }
//     return -1;
// }


// export async function _searchProduct(query, prvQuery, queryResult){
//     let products = null;
//     if(queryResult==null || queryResult.length==0){
//         queryResult = new Array();
//         console.log("product : null");
//         products = await pd.getProducts();
//         queryResult.push(products);
//         return searchProduct(query, prvQuery, queryResult);
//     }else{
//         //products = queryResult[queryResult.length-1];
//     }
//     let searchResult = new Array();
//     let operationalIndx= null;
//     if(query!=''){
//         operationalIndx = getOperationalIndex(query, prvQuery);
//         let qlen = query.length;
//         let pqlen = prvQuery.length;
//         if(qlen<pqlen){
//             //pop all objects from operIndx
//             //search query in queryResult[last]
//             //pop
//             //push result in queryResult and return result
//             while(queryResult.length!=operationalIndx){
//                 queryResult.pop();
//             }
//             products = queryResult[queryResult.length-1];
//             queryResult.pop();
//         }else{
//             if(qlen>pqlen){
//                 //search query in queryResult[last]
//                 //pop all objects from operIndx
//                 //push result in queryResult and return result
//                 products = queryResult[queryResult.length-1];
//                 while(queryResult.length!=operationalIndx){
//                     queryResult.pop();
//                 }
//             }else{
//                 return queryResult;
//             }
//         }
//     }else{
//         return new Array();
//     }
//     //console.log("p size : "+products.length);
    
//     products.forEach(product => {
//         try{
//             let matchResult = compareProductByName(query.toLowerCase(), product.name.toLowerCase(), query.length, product.name.length);
//             if(matchResult[0]){
//                 product.priority = matchResult[1];
//                 searchResult.push(product);
//             };
//         }catch(error){
//             console.log("error at : ");
//             console.log(product);
//             throw error;
//         }
//     });
//     //console.log(searchResult);
//     queryResult.push(searchResult);
//     return queryResult;

// }



export function importIdbFromJsonServ(jsonObject) {
    //del
    try {
        let id =Date.now();
        let samp = jsonObject["sample"];
        for(let i=0;i<samp.length;i++){
            if(samp[i].id==undefined){
                samp[i].id=++id;
            }
        }
        pd.importIdbFromJsonDao(jsonObject);
    } catch (error) {
        throw error;
    }
}

export function exportIdbToJsonServ(){
    //del
    return pd.exportIdbToJsonDao();
}

export function clearDatabaseServ(objectStoreNamesList){
    //del
    pd.clearDatabaseDao(objectStoreNamesList);
}

export async function updateLeaveServ(id){
    //del
    return pd.updateLeaveDao(id);
}
export async function deleteProductServ(id){
    //del
    return pd.deleteProductDao(id);
}
export async function addNewProductServ() {
    //del
    class Sample{
        // #Description;
        // #Employee_Markme;
        // #Leave;
        // #id;
        // #name;
        constructor(a,b,c,d,e){
            this.Description=a;
            this.Employee_Markme=b;
            this.Leave=c;
            this.id=d;
            this.name=e;
        }
        get(){
            return this;
        }
    }
    return pd.addProductDao(new Sample("GBD BOOKS","Mark",0,Date.now(), "HEIDI").get());

}

export async function getProductById(id){
    return pd.getProductById(id);
    //return test.getMsg();
}

/** @return Map<productId:Number, product:Json> */
export async function getProductsByIds(idList){
    
    return new Promise(async (resolve)=>{
        if(idList instanceof Array){
            let productsMap = new Map();
            for(let c=0;c<idList.length;c++){
                await pd.getProductById(idList[c]).then((resp)=>{
                    productsMap.set(resp.id, resp);
                });
            }
            resolve(productsMap);
        }else{
            resolve(null);
        }

    });
}

export async function updateOrderProductData(invoiceOrderData){
    for(let c=0;c<invoiceOrderData.productDesc.length;c++){
        await pd.updateProductQty(invoiceOrderData.productDesc[c]);
    }
    return Promise.resolve();
}