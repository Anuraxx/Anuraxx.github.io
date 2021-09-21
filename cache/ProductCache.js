class ProductCache{
    #products;

    getProducts(){
        return this.#products;
    }
    setProduct(products){
        this.#products=products;
    }
}

export let productCache = new ProductCache();