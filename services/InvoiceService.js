import { invoiceDao } from "../dao/InvoiceDao.js";
import Orders from '../components/orders.js';

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

}

export const invoiceService = new InvoiceService();