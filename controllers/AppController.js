import { searchProduct, reloadProductsCache, clearDatabaseServ } from '../services/ProductService.js'; 
import { Timer, monitorExecTime } from '../utils/utility.js';
//console.log('product controller loaded');
var app = angular.module("App", []);

app.controller('AppController', function($scope){
    
    //let opt = $scope.output;
    //let productService = new ProductService();
    //let opt =document.getElementById('opt');
    monitorExecTime("product cache loaded in - ", reloadProductsCache);
    let loadmorebotton = document.getElementById('load-more');
    //let queryResult = null;
    let query = '';
    let pendingQuery=false;
    let products = null;
    let from = 0;
    let upto = 0;
    let totalSearchCount =0;
    let isRequestCompleted = true;
    
    $scope.refresh= async function(){
        //alert(query);
        //let prvQuery = query;
        try{
            if(isRequestCompleted){
                isRequestCompleted=false;
                $scope.searchResults=[];
                let timer = new Timer(Timer.SEC);
                timer.start();
                from = upto = 0;
                // let prvQuery = query;
                query = $scope.srcpd;
                //console.log("query text : "+query);
                //queryResult= await productService.searchProduct(query.trim().toLowerCase(), prvQuery.trim().toLowerCase(), queryResult);
                // console.log("query results : ");
                // console.log(queryResult);
                // products= queryResult.length>0?queryResult[queryResult.length-1] : queryResult;
                // console.log("search result : ");
                // console.log(products);
                // console.log("search result : ");
                // console.log(queryResult[]);
                //.innerText=prod;
                // opt.innerText='';
                // $scope.output='';
                try{
                    products= await searchProduct(query.trim());
                    totalSearchCount=products.length;
                    products.sort(function(a, b){return a.priority-b.priority;});
                    // if(total_products==null){
                    //     total_products=products;
                    // }
                    //console.log(products);
                    //$scope.searchResults = null;
            
                    this.next50result();
                }catch(error){
                    console.log(error);
                }
                $scope.$applyAsync();
                //$scope.$apply;
                //console.log($scope.searchResults);
                // prod.forEach(element => {
                //     opt.innerText += (element.name)+"\n";
                //     //$scope.output += (element.name)+"\n";
                // });
                timer.setMessage(`Found ${totalSearchCount} search results for '${query}' in : `);
                let runtime = timer.stop();
                $scope.searchTime = runtime;
                //prvQuery=query;
                isRequestCompleted=true;
                if(pendingQuery){
                    //query=pendingQuery;
                    pendingQuery=false;
                    this.refresh();
                }

            }else{
                pendingQuery = true;
            }
        }catch(error){
            console.log(error);
            isRequestCompleted=true;
        }
    };

    $scope.next50result = function(){
        //console.log("loading next 50 search");
        //alert(totalSearchCount)
        upto = from + 5;
        let next50result = new Array();
        for(let i=from;i<upto;i++){
            if(products[i]!=undefined)
                next50result.push(products[i]);
        }
        from = upto;
        this.setLoadMoreButtonVisibility();
        if(next50result.length==0) {
            $scope.searchResults = [];
            //return [];
        }
        console.log("Top 5 result : ");
        console.log(next50result);
        //alert(next50result[0].name);
        //alert(next50result[1].name);
        next50result.forEach(element => {
            $scope.searchResults.push(element);
        });
        // $scope.$applyAsync(function(){
        //     $scope.searchResults=next50result;
        // });
        //return next50result;
    }

    $scope.setLoadMoreButtonVisibility=function(){
        if(totalSearchCount<=upto){
            $(loadmorebotton).hide();
        }else{
            $(loadmorebotton).show();
        }
    }
    $scope.reset = function(){
        //$scope.$apply();
        //$scope.$applyAsync();
        $('#src-inp').val('');
        //$('#searchTime').html('');
        $scope.searchTime='';
        $scope.searchResults=[];
        query='';
        products=null;
        from=0;
        upto=0;
        totalSearchCount=0;
        this.setLoadMoreButtonVisibility();
    }
    $scope.clearDatabase= function(){
        clearDatabaseServ();
        reloadProductsCache();
    }
    $scope.add = function(){

    }
    $scope.update = function(){

    }
    $scope.delete = function(){

    }
    // $scope.add=function(){
    //     $scope.searchResults.push({"name":"xxxxxxxxxxxxxxx"});
    //     $scope.searchResults.push({"name":"yyyyyyyyyyyyyyy"});
    //     $scope.searchResults.push({"name":"zzzzzzzzzzzzzzz"});
    //     $scope.searchResults.push({"name":"xyzxyzxyzxyzxyz"});
    // }

    // $scope.highlight=function(){
    //     var x = document.getElementsByClassName("ser-bar");

    //     for(let j=0;j<x.length;j++){
    //         let txt = null, newText = ""
    //         let element = x[j];
    //         txt = element.textContent;
    //         for(var i=0, l=txt.length, st=0; i<l; i++){
    //             if(txt.charAt(i)==query.charAt(st)){
    //                 newText += txt.charAt(i).fontcolor('000000');
    //                 st++;
    //             }else{
    //                 newText += txt.charAt(i).fontcolor('f1afaf');//c9c3bc 000000
    //             }
                
    //         }
    //         element.innerHTML = newText;
    //     }

        
    // }


})
