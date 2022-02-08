import { invoiceDao } from "../dao/InvoiceDao.js";
import Orders from '../components/orders.js';
import { PendingInvoice } from "../components/PendingInvoice.js";
import {updateOrderProductData} from "../services/ProductService.js";

class InvoiceService{
    async getActiveInvoiceOrderDetail(){
        return invoiceDao.getActiveInvoiceOrderDetail();
        //return test.getMsg();
    }
    async prepareNewInvoiceOrder(jsonData){
        const order = new Orders();
        order.id=Date.now();
        order.productDesc=jsonData;
        return invoiceDao.prepareNewInvoiceOrder(order);
    }
    async placeInvoiceOrder(invoiceOrderData){
        const pendingInvoice = new PendingInvoice();
        pendingInvoice.id = Date.now();
        pendingInvoice.productDesc=invoiceOrderData.productDesc;
        pendingInvoice.grandTotal=invoiceOrderData.grandTotal;
        return invoiceDao.createNewPendingInvoice(pendingInvoice);
    }
    async generateInvoice(invoiceOrderData){
        this.placeInvoiceOrder(invoiceOrderData).then(()=>{
            updateOrderProductData(invoiceOrderData).then(()=>{
                //send email
                //delete pending invoice
            });
        })
    }

}

export const invoiceService = new InvoiceService();