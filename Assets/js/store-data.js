/* =============================================================
   LAVANYA SHARED STORE DATA LAYER
   -------------------------------------------------------------
   This file is the single source of truth for products, orders
   and customers. It is loaded by admin.html, shop.html,
   product-details.html, checkout.html, signup.html and
   login.html so that every page reads and writes the SAME
   localStorage data instead of each page keeping its own copy.

   This is what makes "Add Product" in the admin dashboard show
   up on the Shop page: both pages now call
   LavanyaStore.getProducts() instead of using a hardcoded list.

   Everything is still stored in the browser's localStorage
   (there is no real backend / database here). Once a Spring /
   Hibernate backend exists, the functions below are the place
   to swap localStorage calls for real REST API calls without
   having to touch every page again.
   ============================================================= */

(function (global) {
    "use strict";

    var PRODUCTS_KEY = "lavanyaAdminProducts";
    var ORDERS_KEY = "lavanyaOrders";
    var CUSTOMERS_KEY = "lavanyaCustomers";
    var LAST_ORDER_KEY = "lavanyaLastOrder";
    var REGISTERED_USER_KEY = "lavanyaRegisteredUser";

    var CATEGORY_LABELS = {
        cleanse: "CLEANSE",
        treat: "TREAT",
        hydrate: "HYDRATE",
        protect: "PROTECT"
    };

    /* Older versions of the admin page used a "moisturize"
       category. The shop, product details and quiz pages have
       always used "hydrate". This map lets old data keep working. */
    var CATEGORY_ALIASES = {
        moisturize: "hydrate"
    };


    /* =========================================================
       DEFAULT / SEED PRODUCTS
       This is the same catalog that used to be hardcoded
       separately inside shop.html, product-details.html and
       admin.html. It now lives in exactly one place.
       ========================================================= */

    var DEFAULT_PRODUCTS = [
        {
            id: "cleanse-01",
            name: "Gentle Botanical Cleanser",
            category: "cleanse",
            categoryLabel: "CLEANSE",
            price: 850,
            image: "Assets/Images/cleanser1.jpg",
            description: "A soft daily cleanser designed to leave skin feeling fresh and comfortable.",
            longDescription: "A gentle botanical cleanser created for everyday use. It helps remove daily impurities while keeping the skin feeling comfortable and balanced.",
            ingredients: ["Green tea extract", "Aloe vera", "Chamomile", "Glycerin"],
            skinTypes: ["dry", "normal", "sensitive", "combination"],
            concerns: ["dryness", "sensitivity", "dullness"],
            benefits: ["Gently cleanses the skin", "Helps maintain a comfortable skin feel", "Suitable for everyday use", "Ideal for simple skincare routines"],
            howToUse: "Apply a small amount to damp skin, massage gently, then rinse thoroughly with water.",
            routineStep: "Cleanse",
            suitableFor: "Dry, normal, sensitive and combination skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.7,
            reviewCount: 128,
            stock: 25,
            badge: "BESTSELLER"
        },
        {
            id: "cleanse-02",
            name: "Green Tea Purifying Cleanser",
            category: "cleanse",
            categoryLabel: "CLEANSE",
            price: 950,
            image: "Assets/Images/cleanser2.jpg",
            description: "A refreshing cleanser for a clean, balanced-looking complexion.",
            longDescription: "A refreshing botanical cleanser designed for daily routines that focus on keeping skin feeling clean and balanced.",
            ingredients: ["Green tea", "Cucumber extract", "Aloe vera", "Glycerin"],
            skinTypes: ["oily", "combination", "normal"],
            concerns: ["acne", "texture", "dullness"],
            benefits: ["Leaves skin feeling refreshed", "Helps remove daily buildup", "Suitable for oily and combination skin", "Easy to include in a daily routine"],
            howToUse: "Massage gently onto damp skin for 30 to 60 seconds, then rinse with water.",
            routineStep: "Cleanse",
            suitableFor: "Oily, combination and normal skin",
            beginnerFriendly: true,
            fragranceFree: false,
            rating: 4.6,
            reviewCount: 94,
            stock: 20,
            badge: "NEW"
        },
        {
            id: "treat-01",
            name: "Clarity Botanical Serum",
            category: "treat",
            categoryLabel: "TREAT",
            price: 1450,
            image: "Assets/Images/serum1.jpg",
            description: "A targeted serum for routines focused on clearer-looking, smoother skin.",
            longDescription: "A lightweight botanical serum designed for skincare routines focused on the appearance of clarity, smoother texture and balanced-looking skin.",
            ingredients: ["Niacinamide", "Zinc", "Green tea extract", "Aloe vera"],
            skinTypes: ["oily", "combination", "normal"],
            concerns: ["acne", "texture", "dullness"],
            benefits: ["Lightweight texture", "Supports a balanced-looking complexion", "Helps improve the appearance of texture", "Ideal for targeted routines"],
            howToUse: "Apply 2 to 3 drops to clean skin after cleansing and gently press into the face.",
            routineStep: "Treat",
            suitableFor: "Oily, combination and normal skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.8,
            reviewCount: 156,
            stock: 18,
            badge: "TARGETED"
        },
        {
            id: "treat-02",
            name: "Radiance Botanical Serum",
            category: "treat",
            categoryLabel: "TREAT",
            price: 1550,
            image: "Assets/Images/serum2.jpg",
            description: "A brightening-focused botanical serum for a fresh, radiant-looking complexion.",
            longDescription: "A botanical serum created for routines focused on a fresh, even and radiant-looking complexion.",
            ingredients: ["Vitamin C", "Licorice extract", "Rosehip extract", "Hyaluronic acid"],
            skinTypes: ["dry", "normal", "combination"],
            concerns: ["dullness", "aging", "texture"],
            benefits: ["Supports a brighter-looking complexion", "Helps skin feel hydrated", "Lightweight daily treatment", "Pairs well with simple routines"],
            howToUse: "Apply a few drops after cleansing and before moisturizer.",
            routineStep: "Treat",
            suitableFor: "Dry, normal and combination skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.7,
            reviewCount: 113,
            stock: 16,
            badge: "RADIANCE"
        },
        {
            id: "treat-03",
            name: "Calm Botanical Essence",
            category: "treat",
            categoryLabel: "TREAT",
            price: 1200,
            image: "Assets/Images/essence.jpg",
            description: "A soothing-feeling essence for simple, comfortable skincare routines.",
            longDescription: "A lightweight essence designed for routines that prioritize comfort and a fresh, hydrated skin feel.",
            ingredients: ["Chamomile", "Centella asiatica", "Aloe vera", "Panthenol"],
            skinTypes: ["dry", "sensitive", "normal"],
            concerns: ["sensitivity", "dryness", "dullness"],
            benefits: ["Comfortable lightweight texture", "Helps skin feel refreshed", "Supports a simple routine", "Suitable for sensitive-feeling skin"],
            howToUse: "Apply a small amount to clean skin using your hands or a cotton pad.",
            routineStep: "Treat",
            suitableFor: "Dry, sensitive and normal skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.7,
            reviewCount: 87,
            stock: 22,
            badge: "GENTLE"
        },
        {
            id: "hydrate-01",
            name: "Dew Botanical Moisturizer",
            category: "hydrate",
            categoryLabel: "HYDRATE",
            price: 1250,
            image: "Assets/Images/dew.jpg",
            description: "A lightweight botanical moisturizer for comfortable, hydrated-looking skin.",
            longDescription: "A lightweight moisturizer designed to provide a comfortable layer of hydration without making the routine feel heavy.",
            ingredients: ["Hyaluronic acid", "Aloe vera", "Squalane", "Green tea"],
            skinTypes: ["dry", "normal", "combination", "sensitive"],
            concerns: ["dryness", "dullness", "sensitivity"],
            benefits: ["Lightweight moisturizing feel", "Helps maintain hydrated-looking skin", "Suitable for everyday use", "Works well in simple routines"],
            howToUse: "Apply a small amount to clean skin after serum and gently massage until absorbed.",
            routineStep: "Hydrate",
            suitableFor: "Dry, normal, combination and sensitive skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.8,
            reviewCount: 174,
            stock: 25,
            badge: "BEST MATCH"
        },
        {
            id: "hydrate-02",
            name: "Nourish Face Cream",
            category: "hydrate",
            categoryLabel: "HYDRATE",
            price: 1350,
            image: "Assets/Images/facecream.jpg",
            description: "A richer cream created for routines that prioritize nourishment and comfort.",
            longDescription: "A richer botanical face cream designed for routines that prioritize a nourished, comfortable and moisturized skin feel.",
            ingredients: ["Shea butter", "Squalane", "Jojoba oil", "Chamomile"],
            skinTypes: ["dry", "normal", "sensitive"],
            concerns: ["dryness", "sensitivity", "aging"],
            benefits: ["Rich moisturizing texture", "Supports a comfortable skin feel", "Ideal for dry skin routines", "Useful as an evening moisturizer"],
            howToUse: "Apply a small amount as the final moisturizing step in your routine.",
            routineStep: "Hydrate",
            suitableFor: "Dry, normal and sensitive skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.6,
            reviewCount: 102,
            stock: 19,
            badge: "NOURISH"
        },
        {
            id: "hydrate-03",
            name: "Water Bloom Gel Cream",
            category: "hydrate",
            categoryLabel: "HYDRATE",
            price: 1150,
            image: "Assets/Images/gel.jpg",
            description: "A fresh gel moisturizer with a lightweight feel for everyday routines.",
            longDescription: "A fresh gel cream designed for customers who prefer lightweight hydration and a comfortable, non-heavy texture.",
            ingredients: ["Hyaluronic acid", "Cucumber extract", "Aloe vera", "Green tea"],
            skinTypes: ["oily", "combination", "normal"],
            concerns: ["dullness", "texture", "acne"],
            benefits: ["Fresh gel texture", "Lightweight everyday hydration", "Comfortable for combination skin", "Easy to layer with serums"],
            howToUse: "Apply evenly to clean skin after serum and allow it to absorb.",
            routineStep: "Hydrate",
            suitableFor: "Oily, combination and normal skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.6,
            reviewCount: 91,
            stock: 21,
            badge: "LIGHTWEIGHT"
        },
        {
            id: "protect-01",
            name: "Daily Botanical Shield SPF",
            category: "protect",
            categoryLabel: "PROTECT",
            price: 1100,
            image: "Assets/Images/spf1.jpg",
            description: "A comfortable daily sunscreen for a simple morning skincare ritual.",
            longDescription: "A comfortable everyday sunscreen designed to fit easily into a simple morning skincare routine.",
            ingredients: ["Zinc oxide", "Green tea extract", "Aloe vera", "Vitamin E"],
            skinTypes: ["dry", "oily", "combination", "normal", "sensitive"],
            concerns: ["dullness", "aging", "acne"],
            benefits: ["Easy daily protection step", "Comfortable everyday texture", "Suitable for different skin types", "Simple addition to a morning routine"],
            howToUse: "Apply generously as the final step of your morning skincare routine and reapply as needed.",
            routineStep: "Protect",
            suitableFor: "Dry, oily, combination, normal and sensitive skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.8,
            reviewCount: 210,
            stock: 25,
            badge: "DAILY ESSENTIAL"
        },
        {
            id: "protect-02",
            name: "Mineral Botanical SPF",
            category: "protect",
            categoryLabel: "PROTECT",
            price: 1350,
            image: "Assets/Images/spf2.jpg",
            description: "A mineral sunscreen option for a simple everyday protection step.",
            longDescription: "A mineral sunscreen designed for customers who prefer a simple daily protection step within a botanical-inspired routine.",
            ingredients: ["Zinc oxide", "Chamomile", "Aloe vera", "Vitamin E"],
            skinTypes: ["dry", "normal", "sensitive"],
            concerns: ["sensitivity", "aging", "dullness"],
            benefits: ["Mineral-based protection", "Comfortable everyday routine step", "Suitable for sensitive-feeling skin", "Easy to pair with moisturizer"],
            howToUse: "Apply generously as the last step of your morning skincare routine.",
            routineStep: "Protect",
            suitableFor: "Dry, normal and sensitive skin",
            beginnerFriendly: true,
            fragranceFree: true,
            rating: 4.7,
            reviewCount: 76,
            stock: 17,
            badge: "MINERAL"
        }
    ];


    /* =========================================================
       LOW LEVEL HELPERS
       ========================================================= */

    function readJSON(key, fallback) {
        var raw;

        try {
            raw = localStorage.getItem(key);
        } catch (e) {
            return fallback;
        }

        if (!raw) {
            return fallback;
        }

        try {
            return JSON.parse(raw);
        } catch (e) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            /* localStorage unavailable or full - fail silently */
        }
    }

    function uniqueSuffix() {
        return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    function toLowerList(list) {
        if (!Array.isArray(list)) {
            return [];
        }

        return list.map(function (item) {
            return String(item).toLowerCase();
        });
    }

    function normalizeProduct(product) {
        var category = product.category || "treat";
        category = CATEGORY_ALIASES[category] || category;

        return Object.assign({}, product, {
            category: category,
            categoryLabel: product.categoryLabel || CATEGORY_LABELS[category] || category.toUpperCase(),
            skinTypes: toLowerList(product.skinTypes),
            concerns: toLowerList(product.concerns)
        });
    }


    /* =========================================================
       PRODUCTS
       ========================================================= */

    var REMOVED_PRODUCTS_KEY = "lavanyaRemovedDefaultProducts";

    function getRemovedProductIds() {
        var removed = readJSON(REMOVED_PRODUCTS_KEY, []);
        return Array.isArray(removed) ? removed : [];
    }

    function saveRemovedProductIds(ids) {
        writeJSON(REMOVED_PRODUCTS_KEY, ids);
    }

    function getProducts() {
        var stored = readJSON(PRODUCTS_KEY, null);
        var removedDefaultIds = getRemovedProductIds();

        /* First run, broken/empty storage, or older versions that failed
           to create the shared catalog: restore the complete original
           Lavanya catalog. */
        if (!stored || !Array.isArray(stored)) {
            var initialProducts = DEFAULT_PRODUCTS.filter(function (product) {
                return removedDefaultIds.indexOf(product.id) === -1;
            });
            writeJSON(PRODUCTS_KEY, initialProducts);
            return initialProducts.slice();
        }

        /* IMPORTANT: older versions could overwrite lavanyaAdminProducts
           with only newly-added products. Merge any missing original
           catalog products back in so the existing 10 products never
           disappear accidentally. Deliberately deleted default products
           remain deleted because their IDs are recorded separately. */
        var byId = {};
        stored.forEach(function (product) {
            if (product && product.id) {
                byId[product.id] = normalizeProduct(product);
            }
        });

        DEFAULT_PRODUCTS.forEach(function (defaultProduct) {
            if (removedDefaultIds.indexOf(defaultProduct.id) !== -1) {
                return;
            }

            if (!byId[defaultProduct.id]) {
                byId[defaultProduct.id] = normalizeProduct(defaultProduct);
            }
        });

        var normalized = Object.keys(byId).map(function (id) {
            return byId[id];
        });

        writeJSON(PRODUCTS_KEY, normalized);
        return normalized;
    }

    function saveProducts(products) {
        writeJSON(PRODUCTS_KEY, products);
    }

    function getProductById(id) {
        var products = getProducts();

        for (var i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                return products[i];
            }
        }

        return null;
    }

    function addProduct(product) {
        var products = getProducts();

        var newProduct = normalizeProduct(Object.assign({
            id: product.category + "-" + uniqueSuffix()
        }, product));

        products.push(newProduct);
        saveProducts(products);

        return newProduct;
    }

    function updateProduct(id, changes) {
        var products = getProducts();
        var index = -1;

        for (var i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            return null;
        }

        products[index] = normalizeProduct(Object.assign({}, products[index], changes));
        saveProducts(products);

        return products[index];
    }

    function deleteProduct(id) {
        var products = getProducts().filter(function (p) {
            return p.id !== id;
        });

        saveProducts(products);

        /* Remember deletion of a seeded product so the catalog merge in
           getProducts() does not immediately recreate it on the next read. */
        var isDefault = DEFAULT_PRODUCTS.some(function (product) {
            return product.id === id;
        });

        if (isDefault) {
            var removed = getRemovedProductIds();
            if (removed.indexOf(id) === -1) {
                removed.push(id);
                saveRemovedProductIds(removed);
            }
        }
    }


    /* =========================================================
       ORDERS
       ========================================================= */

    function getOrders() {
        return readJSON(ORDERS_KEY, []);
    }

    function saveOrders(orders) {
        writeJSON(ORDERS_KEY, orders);
    }

    /* Called from checkout.html when a new order is placed. */
    function addOrder(order) {
        var orders = getOrders();

        var newOrder = Object.assign({
            status: "Processing"
        }, order);

        orders.unshift(newOrder);
        saveOrders(orders);

        /* Keep the legacy single-order key in sync so
           order-confirmation.html and account.html keep working. */
        writeJSON(LAST_ORDER_KEY, newOrder);

        return newOrder;
    }

    function updateOrderStatus(orderNumber, status) {
        var orders = getOrders();

        for (var i = 0; i < orders.length; i++) {
            if (orders[i].orderNumber === orderNumber) {
                orders[i].status = status;

                if (i === 0) {
                    writeJSON(LAST_ORDER_KEY, orders[i]);
                }

                break;
            }
        }

        saveOrders(orders);
    }

    function deleteOrder(orderNumber) {
        var orders = getOrders().filter(function (o) {
            return o.orderNumber !== orderNumber;
        });

        saveOrders(orders);
    }


    /* =========================================================
       CUSTOMERS
       ========================================================= */

    function getCustomers() {
        return readJSON(CUSTOMERS_KEY, []);
    }

    function saveCustomers(customers) {
        writeJSON(CUSTOMERS_KEY, customers);
    }

    function findCustomerByEmail(email) {
        var normalized = String(email || "").trim().toLowerCase();
        var customers = getCustomers();

        for (var i = 0; i < customers.length; i++) {
            if (String(customers[i].email || "").toLowerCase() === normalized) {
                return customers[i];
            }
        }

        return null;
    }

    /* Called from signup.html when a new account is created. */
    function addCustomer(customer) {
        var customers = getCustomers();

        var newCustomer = Object.assign({
            id: "cust-" + uniqueSuffix()
        }, customer);

        customers.push(newCustomer);
        saveCustomers(customers);

        /* Keep the legacy single-user key in sync so any older
           page that still reads it does not break. */
        writeJSON(REGISTERED_USER_KEY, newCustomer);

        return newCustomer;
    }

    function deleteCustomer(id) {
        var customers = getCustomers().filter(function (c) {
            return c.id !== id;
        });

        saveCustomers(customers);
    }


    /* =========================================================
       PUBLIC API
       ========================================================= */

    global.LavanyaStore = {
        PRODUCTS_KEY: PRODUCTS_KEY,
        ORDERS_KEY: ORDERS_KEY,
        CUSTOMERS_KEY: CUSTOMERS_KEY,
        CATEGORY_LABELS: CATEGORY_LABELS,

        getProducts: getProducts,
        saveProducts: saveProducts,
        getProductById: getProductById,
        addProduct: addProduct,
        updateProduct: updateProduct,
        deleteProduct: deleteProduct,

        getOrders: getOrders,
        saveOrders: saveOrders,
        addOrder: addOrder,
        updateOrderStatus: updateOrderStatus,
        deleteOrder: deleteOrder,

        getCustomers: getCustomers,
        saveCustomers: saveCustomers,
        findCustomerByEmail: findCustomerByEmail,
        addCustomer: addCustomer,
        deleteCustomer: deleteCustomer
    };

})(window);
