import * as pd from '../dao/ProductDao.js';
import { monitorExecTime } from '../utils/utility.js';


export class ProductService{
    #products;
    //#totalProducts;
    constructor(){
        //this.#products=null;
        this.reloadProducts();
    }
    async searchProduct(name){
        try{
            if(this.#products==null || this.#products.length==0){
                if(this.#products.length==0){
                    return [];
                }
            }
            //console.log("p size : "+products.length);
            let searchResult = new Array();
            this.#products.forEach(product => {
                try{
                    let matchResult = this.#compareProductByName(name.toLowerCase(), product.name.toLowerCase(), name.length, product.name.length);
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

    async reloadProducts(){
        this.#products= await monitorExecTime(`products loaded in : `, pd.getProducts);
        this.#products.sort(function(a, b){
            try{
                let x = a.name.toLowerCase();
                let y = b.name.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
            }catch(err){
                return 0;
            }
            
        });
        //console.log("products loaded");
    }

    #compareProductByName(str1, str2, m, n){
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



//    var prod = products.get(name);
//    return new Promise((resolve)=>{
//         prod.onsuccess=function(e){
//             var res = e.target.result;
//             resolve(res);
//         }
//    });

export function importIdbFromJsonServ(jsonObject) {
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
    return pd.exportIdbToJsonDao();
}

export function clearDatabaseServ(){
    pd.clearDatabaseDao();
}