//export const activeSchemas = ["products", "invoice"];

export const createSchema = {
    "product": function (idb) {
        let objectStore = null;
        try {
            objectStore = idb.createObjectStore("product", {
                keyPath: "id"
            });
            objectStore.createIndex("id", "id", {
                unique: false
            });
            objectStore.createIndex("name", "name", {
                unique: false
            }); // createIndex(column_name, ref_key_in_object)
            // objectStore.createIndex("size", "size", {
            //     unique: false
            // });
            // objectStore.createIndex("total_units", "total_units", {
            //     unique: false
            // });
            // objectStore.createIndex("avl_units", "avl_units", {
            //     unique: false
            // });
            // objectStore.createIndex("price", "price", {
            //     unique: false
            // });
            // objectStore.createIndex("color", "color", {
            //     unique: false
            // });
            // objectStore.createIndex("material", "material", {
            //     unique: false
            // });
        } catch (error) {
            throw error;
        }
        return objectStore;
    },
    "pendingInvoice": function (idb) {
        let objectStore = null;
        try {
            objectStore = idb.createObjectStore("pendingInvoice", {
                keyPath: "id"
            });
        } catch (error) {
            throw error;
        }
        return objectStore;
    },
    "sample": function (idb) {
        let objectStore = null;
        try {
            objectStore = idb.createObjectStore("sample", {
                keyPath: "id"
            });
            objectStore.createIndex("id", "id", {
                unique: false
            });
            objectStore.createIndex("name", "name", {
                unique: false
            });
        } catch (error) {
            throw error;
        }
        return objectStore;
    },
    "orders":function (idb) {
        try {
            return idb.createObjectStore("orders", {
                keyPath: "id"
            });
        } catch (error) {
            throw error;
        }
    },
    "stats":function (idb) {
        try {
            return idb.createObjectStore("stats", {
                keyPath: "id"
            });
        } catch (error) {
            throw error;
        }
    }

}