import { invoiceService } from "../services/InvoiceService.js";
import { getProductById, getProductsByIds } from "../services/ProductService.js";
//import {PendingInvoice} from "../components/PendingInvoice.js";

angular.module("App", []).controller('InvoiceController', async function($scope){
    //console.log("IC working");
    let inProcessInvoiceData = await invoiceService.getActiveInvoiceOrderDetail();
    const productIds = [];
    inProcessInvoiceData.productDesc.forEach(product => {
        productIds.push(product.id_product);
    });
    //console.log(inProcessInvoiceData);
    let billingProducts = await getProductsByIds(productIds);
    console.log(`Billing items:: ${billingProducts}`);
    console.log(billingProducts);
    // entry in pendingInvoice table
    // update products
    // email invoice
    // remove from pendinginvoice
    let grandTotal = 0;
    inProcessInvoiceData.productDesc.forEach(product => {
        product.total= billingProducts.get(product.id_product).price * product.qty;
        grandTotal += product.total;
    });
    inProcessInvoiceData.grandTotal = grandTotal;
    console.log(inProcessInvoiceData);

    invoiceService.generateInvoice(inProcessInvoiceData).then(console.log("invoice generated"));


    console.log();
});