//import { updateLeaveDao } from '../dao/ProductDao.js';
import { searchProduct, reloadProductsCache, clearDatabaseServ, updateLeaveServ, deleteProductServ, addNewProductServ } from '../services/ProductService.js'; 
import { Timer, monitorExecTime } from '../utils/utility.js';
import QuantityInput from '../resources/js/quantity.js';
import { invoiceService } from "../services/InvoiceService.js";
//console.log('product controller loaded');
var app = angular.module("App", []);


app.controller('AppController', function($scope, $timeout){
    
    reloadProductsCache();
    let loadmorebotton = document.getElementById('load-more');
    //let queryResult = null;
    let query = '';
    let pendingQuery=false;
    let products = null;
    let from = 0;
    let upto = 0;
    let totalSearchCount =0;
    let isRequestCompleted = true;
    let prevSelectedListItem = null;
    let quantityInput = null;
    let selectedItems = new Map();
    let activeElement = null;
    (function(){
        let quantities = document.querySelectorAll('[data-quantity]');
      
        if (quantities instanceof Node) quantities = [quantities];
        if (quantities instanceof NodeList) quantities = [].slice.call(quantities);
        if (quantities instanceof Array) {
          quantities.forEach(div => {
            div.quantity = new QuantityInput(div, 'Down', 'Up');
            quantityInput = div.quantity;
            });
        }
      })();

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
                
                
                //$scope.$apply;
                //console.log($scope.searchResults);
                // prod.forEach(element => {
                //     opt.innerText += (element.name)+"\n";
                //     //$scope.output += (element.name)+"\n";
                // });
                timer.setMessage(`Found ${totalSearchCount} search results for '${query}' in : `);
                let runtime = timer.stop();
                $scope.searchTimeLog = runtime;
                $scope.$apply();
                //prvQuery=query;
                isRequestCompleted=true;
                //$("#_15443").show();
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

        // next50result.forEach(element => {
        //     $scope.searchResults.push(element);
        // });
        $scope.searchResults = $scope.searchResults.concat(next50result) ;
        
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
    $scope.add = async function(){
        let timer = new Timer(Timer.MILLISEC, "updated in : ");
        timer.start();
        addNewProductServ().then((res)=>{
            timer.stop();
            reloadProductsCache();
        });
        
    }
    $scope.update = async function(){
        let timer = new Timer(Timer.MILLISEC, "updated in : ");
        timer.start();
        updateLeaveServ($scope.id).then((res)=>{
            timer.stop();
            reloadProductsCache();
        });
        

    }
    $scope.delete = async function(){
        let timer = new Timer(Timer.MILLISEC, "updated in : ");
        timer.start();
        deleteProductServ($scope.id).then((res)=>{
            timer.stop()
            reloadProductsCache();
        });
        
    }
    $scope.proceedWithListItem= function (listElem) {
        activeElement = listElem;
        quantityInput.reset();
        let listElemId = "#_"+listElem.x.id;
        activeElement.id = listElemId;
        if(prevSelectedListItem!=null){
            $('#_'+prevSelectedListItem.x.id).removeClass("active");
        }

        // let elemId = id.toString();
        // console.log(elemId);
        $(listElemId).addClass("active");
        prevSelectedListItem = listElem;
        quantityInput.max = listElem.x.avbl_units;

        
    }
    $("#selectItemButton").on('click', () =>{
        if(activeElement!=null){
            $(activeElement.id).addClass("selectedItem");
            $(activeElement.id).removeClass("active");

            //selectedItems.push({'id_product':activeElement.x.id, 'qty':quantityInput.input.value});
            selectedItems.set(activeElement.x.id, {'id_product':activeElement.x.id, 'qty':quantityInput.input.value});
            
            console.log(selectedItems);
            updateCart();
        }
        
    });
    $("#cancelItemButton").on('click', () => {
        if(activeElement!=null){
            $(activeElement.id).removeClass("selectedItem");
            selectedItems.delete(activeElement.x.id);
            console.log(selectedItems);
            updateCart();
        }
        
    });

    function updateCart(discart) {
        console.log("update cart");
        if(discart){
            selectedItems.clear();
            $('.selectedItem').removeClass('selectedItem');
            $('.active').removeClass('active');
            activeElement = null;
            prevSelectedListItem = null;
            $("#cart").hide();
            return;
        }
        if(selectedItems.size>0){
            $("#cart").show();
        }else{
            //$("#cart").hide();
            updateCart(true);
        }
        $scope.selectedItemsCount = selectedItems.size;
        $scope.$apply();
    }
    $("#close").on('click', ()=>{
        updateCart(true);
    })

    $("#cart a").on('click', ()=>{
        const jsonData = [];
        for(const x of selectedItems.values()){
            jsonData.push(x);
        }
        console.log(jsonData);
        invoiceService.prepareNewInvoiceOrder(jsonData).then(()=>{
            console.log("order created");
            location.replace("/invoice.html");
        });
        
    })


})

