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
    "invoice": function (idb) {
        let objectStore = null;
        try {
            objectStore = idb.createObjectStore("invoice", {
                keyPath: "id"
            });
            objectStore.createIndex("name", "name", {
                unique: false
            });
            objectStore.createIndex("total_units", "total_units", {
                unique: false
            });
            objectStore.createIndex("avl_units", "avl_units", {
                unique: false
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
    }
}