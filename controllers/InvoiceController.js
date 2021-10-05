import { invoiceService } from "../services/InvoiceService.js";
import { getProductById, getProductsByIds } from "../services/ProductService.js";

angular.module("App", []).controller('InvoiceController', async function($scope){
    //console.log("IC working");
    let inProcessInvoiceData = await invoiceService.getActiveInvoiceOrderDetail();
    const productIds = [];
    inProcessInvoiceData.productDesc.forEach(product => {
        productIds.push(product.id_product);
    });
    let billingProducts = await getProductsByIds(productIds);
    console.log(billingProducts);
    
    
});