/* =============================================================
   LAVANYA SHARED STORE DATA LAYER
   -------------------------------------------------------------
   This file is the single source of truth for products, orders
   and customers.

   CUSTOMER ACCOUNT SYSTEM
   -------------------------------------------------------------
   IMPORTANT:
   lavanyaCustomers is now the SINGLE SOURCE OF TRUTH for
   customer accounts.

   Every registered customer is stored in:

       lavanyaCustomers

   Signup reads/writes this list.
   Login reads this list.
   Admin reads/writes this list.

   The old lavanyaRegisteredUser key is supported only for
   backwards compatibility/migration with older versions.
   It is NOT used as the main account database anymore.

   ORDER OWNERSHIP
   -------------------------------------------------------------
   IMPORTANT:
   For new orders, userId is the authoritative account owner.

   customer.email is the checkout/contact email and MUST NOT be
   used to determine which account owns an order.

   This prevents an order placed by Account A from appearing
   under Account B just because the checkout contact email is
   different or autofilled.
   ============================================================= */

(function (global) {

    "use strict";


    /* =========================================================
       STORAGE KEYS
       ========================================================= */

    var PRODUCTS_KEY =
        "lavanyaAdminProducts";

    var ORDERS_KEY =
        "lavanyaOrders";

    var CUSTOMERS_KEY =
        "lavanyaCustomers";

    var LAST_ORDER_KEY =
        "lavanyaLastOrder";

    /*
     * Legacy key.
     *
     * Older signup/login versions used this key to store only
     * ONE account.
     *
     * It is retained only so old data can be migrated.
     */
    var REGISTERED_USER_KEY =
        "lavanyaRegisteredUser";


    var CATEGORY_LABELS = {

        cleanse: "CLEANSE",

        treat: "TREAT",

        hydrate: "HYDRATE",

        protect: "PROTECT"

    };


    var CATEGORY_ALIASES = {

        moisturize: "hydrate"

    };



    /* =========================================================
       DEFAULT PRODUCTS
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
            ingredients: [
                "Green tea extract",
                "Aloe vera",
                "Chamomile",
                "Glycerin"
            ],
            skinTypes: [
                "dry",
                "normal",
                "sensitive",
                "combination"
            ],
            concerns: [
                "dryness",
                "sensitivity",
                "dullness"
            ],
            benefits: [
                "Gently cleanses the skin",
                "Helps maintain a comfortable skin feel",
                "Suitable for everyday use",
                "Ideal for simple skincare routines"
            ],
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
            ingredients: [
                "Green tea",
                "Cucumber extract",
                "Aloe vera",
                "Glycerin"
            ],
            skinTypes: [
                "oily",
                "combination",
                "normal"
            ],
            concerns: [
                "acne",
                "texture",
                "dullness"
            ],
            benefits: [
                "Leaves skin feeling refreshed",
                "Helps remove daily buildup",
                "Suitable for oily and combination skin",
                "Easy to include in a daily routine"
            ],
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
            ingredients: [
                "Niacinamide",
                "Zinc",
                "Green tea extract",
                "Aloe vera"
            ],
            skinTypes: [
                "oily",
                "combination",
                "normal"
            ],
            concerns: [
                "acne",
                "texture",
                "dullness"
            ],
            benefits: [
                "Lightweight texture",
                "Supports a balanced-looking complexion",
                "Helps improve the appearance of texture",
                "Ideal for targeted routines"
            ],
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
            ingredients: [
                "Vitamin C",
                "Licorice extract",
                "Rosehip extract",
                "Hyaluronic acid"
            ],
            skinTypes: [
                "dry",
                "normal",
                "combination"
            ],
            concerns: [
                "dullness",
                "aging",
                "texture"
            ],
            benefits: [
                "Supports a brighter-looking complexion",
                "Helps skin feel hydrated",
                "Lightweight daily treatment",
                "Pairs well with simple routines"
            ],
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
            ingredients: [
                "Chamomile",
                "Centella asiatica",
                "Aloe vera",
                "Panthenol"
            ],
            skinTypes: [
                "dry",
                "sensitive",
                "normal"
            ],
            concerns: [
                "sensitivity",
                "dryness",
                "dullness"
            ],
            benefits: [
                "Comfortable lightweight texture",
                "Helps skin feel refreshed",
                "Supports a simple routine",
                "Suitable for sensitive-feeling skin"
            ],
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
            ingredients: [
                "Hyaluronic acid",
                "Aloe vera",
                "Squalane",
                "Green tea"
            ],
            skinTypes: [
                "dry",
                "normal",
                "combination",
                "sensitive"
            ],
            concerns: [
                "dryness",
                "dullness",
                "sensitivity"
            ],
            benefits: [
                "Lightweight moisturizing feel",
                "Helps maintain hydrated-looking skin",
                "Suitable for everyday use",
                "Works well in simple routines"
            ],
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
            ingredients: [
                "Shea butter",
                "Squalane",
                "Jojoba oil",
                "Chamomile"
            ],
            skinTypes: [
                "dry",
                "normal",
                "sensitive"
            ],
            concerns: [
                "dryness",
                "sensitivity",
                "aging"
            ],
            benefits: [
                "Rich moisturizing texture",
                "Supports a comfortable skin feel",
                "Ideal for dry skin routines",
                "Useful as an evening moisturizer"
            ],
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
            ingredients: [
                "Hyaluronic acid",
                "Cucumber extract",
                "Aloe vera",
                "Green tea"
            ],
            skinTypes: [
                "oily",
                "combination",
                "normal"
            ],
            concerns: [
                "dullness",
                "texture",
                "acne"
            ],
            benefits: [
                "Fresh gel texture",
                "Lightweight everyday hydration",
                "Comfortable for combination skin",
                "Easy to layer with serums"
            ],
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
            ingredients: [
                "Zinc oxide",
                "Green tea extract",
                "Aloe vera",
                "Vitamin E"
            ],
            skinTypes: [
                "dry",
                "oily",
                "combination",
                "normal",
                "sensitive"
            ],
            concerns: [
                "dullness",
                "aging",
                "acne"
            ],
            benefits: [
                "Easy daily protection step",
                "Comfortable everyday texture",
                "Suitable for different skin types",
                "Simple addition to a morning routine"
            ],
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
            ingredients: [
                "Zinc oxide",
                "Chamomile",
                "Aloe vera",
                "Vitamin E"
            ],
            skinTypes: [
                "dry",
                "normal",
                "sensitive"
            ],
            concerns: [
                "sensitivity",
                "aging",
                "dullness"
            ],
            benefits: [
                "Mineral-based protection",
                "Comfortable everyday routine step",
                "Suitable for sensitive-feeling skin",
                "Easy to pair with moisturizer"
            ],
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

            raw =
                localStorage.getItem(
                    key
                );

        } catch (e) {

            return fallback;

        }


        if (!raw) {

            return fallback;

        }


        try {

            return JSON.parse(
                raw
            );

        } catch (e) {

            return fallback;

        }

    }



    function writeJSON(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch (e) {

            /* Ignore localStorage errors */

        }

    }



    function uniqueSuffix() {

        return (
            Date.now().toString(36) +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 8)
        );

    }



    function toLowerList(list) {

        if (!Array.isArray(list)) {

            return [];

        }


        return list.map(
            function(item) {

                return String(
                    item
                ).toLowerCase();

            }
        );

    }



    function normalizeProduct(product) {

        var category =
            product.category ||
            "treat";


        category =
            CATEGORY_ALIASES[
                category
            ] ||
            category;


        return Object.assign(
            {},
            product,
            {

                category:
                    category,

                categoryLabel:
                    product.categoryLabel ||
                    CATEGORY_LABELS[
                        category
                    ] ||
                    category.toUpperCase(),

                skinTypes:
                    toLowerList(
                        product.skinTypes
                    ),

                concerns:
                    toLowerList(
                        product.concerns
                    )

            }
        );

    }



    /* =========================================================
       PRODUCTS
       ========================================================= */

    var REMOVED_PRODUCTS_KEY =
        "lavanyaRemovedDefaultProducts";



    function getRemovedProductIds() {

        var removed =
            readJSON(
                REMOVED_PRODUCTS_KEY,
                []
            );


        return Array.isArray(
            removed
        )
            ? removed
            : [];

    }



    function saveRemovedProductIds(
        ids
    ) {

        writeJSON(
            REMOVED_PRODUCTS_KEY,
            ids
        );

    }



    function getProducts() {

        var stored =
            readJSON(
                PRODUCTS_KEY,
                null
            );


        var removedDefaultIds =
            getRemovedProductIds();


        if (
            !stored ||
            !Array.isArray(stored)
        ) {

            var initialProducts =
                DEFAULT_PRODUCTS.filter(
                    function(product) {

                        return (
                            removedDefaultIds
                                .indexOf(
                                    product.id
                                ) === -1
                        );

                    }
                );


            writeJSON(
                PRODUCTS_KEY,
                initialProducts
            );


            return initialProducts.slice();

        }


        var byId = {};


        stored.forEach(
            function(product) {

                if (
                    product &&
                    product.id
                ) {

                    byId[
                        product.id
                    ] =
                        normalizeProduct(
                            product
                        );

                }

            }
        );


        DEFAULT_PRODUCTS.forEach(
            function(defaultProduct) {

                if (
                    removedDefaultIds
                        .indexOf(
                            defaultProduct.id
                        ) !== -1
                ) {

                    return;

                }


                if (
                    !byId[
                        defaultProduct.id
                    ]
                ) {

                    byId[
                        defaultProduct.id
                    ] =
                        normalizeProduct(
                            defaultProduct
                        );

                }

            }
        );


        var normalized =
            Object.keys(
                byId
            ).map(
                function(id) {

                    return byId[id];

                }
            );


        writeJSON(
            PRODUCTS_KEY,
            normalized
        );


        return normalized;

    }



    function saveProducts(
        products
    ) {

        writeJSON(
            PRODUCTS_KEY,
            products
        );

    }



    function getProductById(id) {

        var products =
            getProducts();


        for (
            var i = 0;
            i < products.length;
            i++
        ) {

            if (
                products[i].id === id
            ) {

                return products[i];

            }

        }


        return null;

    }



    function addProduct(
        product
    ) {

        var products =
            getProducts();


        var newProduct =
            normalizeProduct(
                Object.assign(
                    {
                        id:
                            product.category +
                            "-" +
                            uniqueSuffix()
                    },
                    product
                )
            );


        products.push(
            newProduct
        );


        saveProducts(
            products
        );


        return newProduct;

    }



    function updateProduct(
        id,
        changes
    ) {

        var products =
            getProducts();


        var index = -1;


        for (
            var i = 0;
            i < products.length;
            i++
        ) {

            if (
                products[i].id === id
            ) {

                index = i;

                break;

            }

        }


        if (index === -1) {

            return null;

        }


        products[index] =
            normalizeProduct(
                Object.assign(
                    {},
                    products[index],
                    changes
                )
            );


        saveProducts(
            products
        );


        return products[index];

    }



    function deleteProduct(
        id
    ) {

        var products =
            getProducts().filter(
                function(p) {

                    return p.id !== id;

                }
            );


        saveProducts(
            products
        );


        var isDefault =
            DEFAULT_PRODUCTS.some(
                function(product) {

                    return product.id === id;

                }
            );


        if (isDefault) {

            var removed =
                getRemovedProductIds();


            if (
                removed.indexOf(id) === -1
            ) {

                removed.push(id);

                saveRemovedProductIds(
                    removed
                );

            }

        }

    }



    /* =========================================================
       ORDERS
       ========================================================= */

    function getOrders() {

        return readJSON(
            ORDERS_KEY,
            []
        );

    }



    function saveOrders(
        orders
    ) {

        writeJSON(
            ORDERS_KEY,
            orders
        );

    }



    /*
     * Find a customer using their ID.
     *
     * ID is the authoritative way to identify an account.
     */

    function findCustomerById(
        id
    ) {

        if (
            id === null ||
            id === undefined ||
            String(id).trim() === ""
        ) {

            return null;

        }


        var customers =
            getCustomers();


        for (
            var i = 0;
            i < customers.length;
            i++
        ) {

            if (
                String(
                    customers[i].id
                ) ===
                String(id)
            ) {

                return customers[i];

            }

        }


        return null;

    }



    /*
     * Resolve the account that owns an order.
     *
     * Priority:
     *
     * 1. Explicit order.userId
     * 2. Logged-in lavanyaUser.id
     * 3. order.userEmail
     *
     * IMPORTANT:
     *
     * customer.email is intentionally NOT used here as the
     * primary account owner because it is the checkout/contact
     * email and may differ from the logged-in account email.
     */

    function resolveOrderOwner(
        order
    ) {

        order =
            order || {};


        var owner =
            null;


        /*
         * -----------------------------------------------------
         * 1. Explicit userId
         * -----------------------------------------------------
         */

        if (
            order.userId !== null &&
            order.userId !== undefined &&
            String(
                order.userId
            ).trim() !== ""
        ) {

            owner =
                findCustomerById(
                    order.userId
                );

        }


        /*
         * -----------------------------------------------------
         * 2. Active logged-in account
         * -----------------------------------------------------
         *
         * This protects against orders where userId was omitted
         * by an older checkout implementation.
         */

        if (!owner) {

            var activeUser =
                readJSON(
                    "lavanyaUser",
                    null
                );


            if (
                activeUser &&
                activeUser.id
            ) {

                owner =
                    findCustomerById(
                        activeUser.id
                    );

            }

        }


        /*
         * -----------------------------------------------------
         * 3. Account email fallback
         * -----------------------------------------------------
         *
         * This is primarily for older orders.
         */

        if (!owner) {

            var accountEmail =
                String(
                    order.userEmail ||
                    ""
                )
                .trim()
                .toLowerCase();


            if (accountEmail) {

                owner =
                    findCustomerByEmail(
                        accountEmail
                    );

            }

        }


        return owner;

    }



    /*
     * Normalize an order before saving it.
     *
     * The important part of this function is that userId and
     * userEmail always refer to the registered account that owns
     * the order.
     *
     * customer.email remains the checkout/contact email.
     */

    function normalizeOrderOwner(
        order
    ) {

        if (
            !order ||
            typeof order !==
            "object"
        ) {

            return order;

        }


        var normalizedOrder =
            Object.assign(
                {},
                order
            );


        var owner =
            resolveOrderOwner(
                normalizedOrder
            );


        if (owner) {

            /*
             * The customer account ID is the authoritative owner.
             */

            normalizedOrder.userId =
                owner.id;


            /*
             * Store the actual account email separately from the
             * checkout/contact email.
             */

            normalizedOrder.userEmail =
                owner.email;

        }


        /*
         * Make sure order.customer exists without replacing
         * checkout information.
         */

        if (
            !normalizedOrder.customer ||
            typeof normalizedOrder.customer !==
            "object"
        ) {

            normalizedOrder.customer = {};

        }


        /*
         * Do NOT overwrite customer.email here.
         *
         * customer.email may be the delivery/contact email
         * entered during checkout.
         */

        return normalizedOrder;

    }



    function addOrder(
        order
    ) {

        var orders =
            getOrders();


        /*
         * Resolve and lock the account owner before saving.
         */

        var normalizedOrder =
            normalizeOrderOwner(
                order
            );


        var newOrder =
            Object.assign(
                {
                    status:
                        "Processing"
                },
                normalizedOrder
            );


        /*
         * Every new order gets a unique ID if checkout did not
         * already provide one.
         */

        if (
            !newOrder.orderNumber
        ) {

            newOrder.orderNumber =
                "LV-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .slice(2, 7)
                    .toUpperCase();

        }


        orders.unshift(
            newOrder
        );


        saveOrders(
            orders
        );


        writeJSON(
            LAST_ORDER_KEY,
            newOrder
        );


        return newOrder;

    }



    function updateOrderStatus(
        orderNumber,
        status
    ) {

        var orders =
            getOrders();


        for (
            var i = 0;
            i < orders.length;
            i++
        ) {

            if (
                orders[i].orderNumber ===
                orderNumber
            ) {

                /*
                 * IMPORTANT:
                 *
                 * Once a customer has cancelled an order, the
                 * status becomes locked.
                 *
                 * Admin must not be able to change it back to
                 * Processing, Shipped, Delivered, etc.
                 *
                 * The customer cancellation is identified by
                 * the cancellation metadata when available.
                 */

                var customerCancelled =
                    orders[i].cancelledBy ===
                    "customer";


                if (
                    customerCancelled &&
                    orders[i].status ===
                    "Cancelled"
                ) {

                    /*
                     * Do not allow any status change after
                     * customer cancellation.
                     */

                    return orders[i];

                }


                orders[i].status =
                    status;


                if (i === 0) {

                    writeJSON(
                        LAST_ORDER_KEY,
                        orders[i]
                    );

                }


                break;

            }

        }


        saveOrders(
            orders
        );


        return null;

    }



    function deleteOrder(
        orderNumber
    ) {

        var orders =
            getOrders().filter(
                function(o) {

                    return (
                        o.orderNumber !==
                        orderNumber
                    );

                }
            );


        saveOrders(
            orders
        );

    }



    /* =========================================================
       CUSTOMERS
       =========================================================

       IMPORTANT:
       This is now the single source of truth for ALL accounts.
       ========================================================= */



    /*
     * Normalize a customer object.
     *
     * This keeps old customer records working even if they were
     * created before the new account system was installed.
     */

    function normalizeCustomer(
        customer
    ) {

        if (
            !customer ||
            typeof customer !==
            "object"
        ) {

            return null;

        }


        var email =
            String(
                customer.email || ""
            )
            .trim()
            .toLowerCase();


        if (!email) {

            return null;

        }


        return Object.assign(
            {},
            customer,
            {

                id:
                    customer.id ||
                    (
                        "cust-" +
                        uniqueSuffix()
                    ),

                name:
                    String(
                        customer.name ||
                        ""
                    ).trim(),

                email:
                    email

            }
        );

    }



    /*
     * Migrate old lavanyaRegisteredUser
     * into lavanyaCustomers.
     *
     * This is important because you already created an account
     * before applying this fix.
     */

    function migrateLegacyCustomer() {

        var customers =
            readJSON(
                CUSTOMERS_KEY,
                null
            );


        /*
         * If customers doesn't exist or is not an array,
         * create an empty customer list.
         */

        if (
            !Array.isArray(
                customers
            )
        ) {

            customers = [];

        }


        /*
         * Read old single-account storage.
         */

        var legacyUser =
            readJSON(
                REGISTERED_USER_KEY,
                null
            );


        /*
         * If there is an old account, migrate it.
         */

        if (
            legacyUser &&
            legacyUser.email
        ) {

            var legacyEmail =
                String(
                    legacyUser.email
                )
                .trim()
                .toLowerCase();


            var alreadyExists =
                customers.some(
                    function(customer) {

                        return (
                            String(
                                customer.email ||
                                ""
                            )
                            .trim()
                            .toLowerCase() ===
                            legacyEmail
                        );

                    }
                );


            if (!alreadyExists) {

                var migratedCustomer =
                    normalizeCustomer(
                        Object.assign(
                            {},
                            legacyUser,
                            {

                                id:
                                    legacyUser.id ||
                                    (
                                        "cust-" +
                                        uniqueSuffix()
                                    ),

                                email:
                                    legacyEmail,

                                migratedFromLegacy:
                                    true

                            }
                        )
                    );


                if (
                    migratedCustomer
                ) {

                    customers.push(
                        migratedCustomer
                    );

                }

            }

        }


        /*
         * Clean and remove duplicate emails.
         */

        var uniqueCustomers = [];

        var emailMap = {};


        customers.forEach(
            function(customer) {

                var normalized =
                    normalizeCustomer(
                        customer
                    );


                if (
                    !normalized
                ) {

                    return;

                }


                var email =
                    normalized.email;


                /*
                 * If duplicate email exists,
                 * keep the first valid customer.
                 */

                if (
                    emailMap[email]
                ) {

                    return;

                }


                emailMap[email] =
                    true;


                uniqueCustomers.push(
                    normalized
                );

            }
        );


        writeJSON(
            CUSTOMERS_KEY,
            uniqueCustomers
        );


        /*
         * IMPORTANT:
         *
         * We deliberately DO NOT delete
         * lavanyaRegisteredUser here.
         *
         * It may still be useful to older pages.
         *
         * New signup/login pages no longer depend on it.
         */

        return uniqueCustomers;

    }



    /*
     * getCustomers()
     *
     * Every page that needs customer/account data should call
     * this function.
     */

    function getCustomers() {

        return migrateLegacyCustomer();

    }



    /*
     * saveCustomers()
     *
     * Saves the complete customer list.
     *
     * Duplicate email addresses are prevented.
     */

    function saveCustomers(
        customers
    ) {

        if (
            !Array.isArray(
                customers
            )
        ) {

            customers = [];

        }


        var uniqueCustomers = [];

        var emailMap = {};


        customers.forEach(
            function(customer) {

                var normalized =
                    normalizeCustomer(
                        customer
                    );


                if (
                    !normalized
                ) {

                    return;

                }


                var email =
                    normalized.email;


                if (
                    emailMap[email]
                ) {

                    return;

                }


                emailMap[email] =
                    true;


                uniqueCustomers.push(
                    normalized
                );

            }
        );


        writeJSON(
            CUSTOMERS_KEY,
            uniqueCustomers
        );


        return uniqueCustomers;

    }



    /*
     * Find customer using email.
     */

    function findCustomerByEmail(
        email
    ) {

        var normalizedEmail =
            String(
                email || ""
            )
            .trim()
            .toLowerCase();


        if (!normalizedEmail) {

            return null;

        }


        var customers =
            getCustomers();


        for (
            var i = 0;
            i < customers.length;
            i++
        ) {

            if (
                String(
                    customers[i].email ||
                    ""
                )
                .trim()
                .toLowerCase() ===
                normalizedEmail
            ) {

                return customers[i];

            }

        }


        return null;

    }



    /*
     * addCustomer()
     *
     * Adds a new account.
     *
     * Duplicate emails are rejected.
     */

    function addCustomer(
        customer
    ) {

        var customers =
            getCustomers();


        var normalized =
            normalizeCustomer(
                Object.assign(
                    {
                        id:
                            "cust-" +
                            uniqueSuffix()
                    },
                    customer
                )
            );


        if (
            !normalized
        ) {

            return null;

        }


        /*
         * Check duplicate email.
         */

        var existing =
            customers.some(
                function(existingCustomer) {

                    return (
                        String(
                            existingCustomer.email ||
                            ""
                        )
                        .trim()
                        .toLowerCase() ===
                        normalized.email
                    );

                }
            );


        if (existing) {

            return null;

        }


        customers.push(
            normalized
        );


        saveCustomers(
            customers
        );


        /*
         * Do NOT make lavanyaRegisteredUser the source of truth.
         *
         * New accounts are stored in lavanyaCustomers.
         */

        return normalized;

    }



    /*
     * updateCustomer()
     *
     * Allows Admin to update a customer's information.
     *
     * IMPORTANT:
     * If the email is changed, the new email becomes the login email.
     */

    function updateCustomer(
        id,
        changes
    ) {

        var customers =
            getCustomers();


        var index = -1;


        for (
            var i = 0;
            i < customers.length;
            i++
        ) {

            if (
                String(
                    customers[i].id
                ) ===
                String(id)
            ) {

                index = i;

                break;

            }

        }


        if (
            index === -1
        ) {

            return null;

        }


        var oldCustomer =
            customers[index];


        var updatedCustomer =
            Object.assign(
                {},
                oldCustomer,
                changes
            );


        var normalized =
            normalizeCustomer(
                updatedCustomer
            );


        if (
            !normalized
        ) {

            return null;

        }


        /*
         * Prevent changing email to an email already
         * belonging to another customer.
         */

        var duplicateEmail =
            customers.some(
                function(customer, customerIndex) {

                    if (
                        customerIndex ===
                        index
                    ) {

                        return false;

                    }


                    return (
                        String(
                            customer.email ||
                            ""
                        )
                        .trim()
                        .toLowerCase() ===
                        normalized.email
                    );

                }
            );


        if (
            duplicateEmail
        ) {

            return null;

        }


        customers[index] =
            normalized;


        saveCustomers(
            customers
        );


        /*
         * If the edited customer is currently logged in,
         * update the active session too.
         */

        var activeUser =
            readJSON(
                "lavanyaUser",
                null
            );


        if (
            activeUser &&
            String(
                activeUser.id || ""
            ) ===
            String(id)
        ) {

            var updatedSession = {

                id:
                    normalized.id,

                name:
                    normalized.name,

                email:
                    normalized.email,

                loggedInAt:
                    activeUser.loggedInAt ||
                    new Date().toISOString()

            };


            writeJSON(
                "lavanyaUser",
                updatedSession
            );

        }


        /*
         * Update remembered email if this customer is
         * the customer whose email was changed.
         */

        var rememberedEmail = "";


        try {

            rememberedEmail =
                String(
                    localStorage.getItem(
                        "lavanyaRememberedEmail"
                    ) || ""
                )
                .trim()
                .toLowerCase();

        } catch (e) {

            rememberedEmail = "";

        }


        var oldEmail =
            String(
                oldCustomer.email ||
                ""
            )
            .trim()
            .toLowerCase();


        if (
            rememberedEmail &&
            rememberedEmail ===
            oldEmail
        ) {

            try {

                localStorage.setItem(
                    "lavanyaRememberedEmail",
                    normalized.email
                );

            } catch (e) {

                /* Ignore */

            }

        }


        return normalized;

    }



    /*
     * deleteCustomer()
     *
     * THIS FIXES YOUR ORIGINAL BUG.
     *
     * Admin deletion now removes the account from the SAME
     * customer list used by signup and login.
     */

    function deleteCustomer(
        id
    ) {

        var customers =
            getCustomers();


        var deletedCustomer =
            null;


        /*
         * Find customer before deleting.
         */

        for (
            var i = 0;
            i < customers.length;
            i++
        ) {

            if (
                String(
                    customers[i].id
                ) ===
                String(id)
            ) {

                deletedCustomer =
                    customers[i];

                break;

            }

        }


        /*
         * If no customer was found,
         * nothing to delete.
         */

        if (
            !deletedCustomer
        ) {

            return false;

        }


        /*
         * Remove customer from the main customer list.
         */

        customers =
            customers.filter(
                function(customer) {

                    return (
                        String(
                            customer.id
                        ) !==
                        String(id)
                    );

                }
            );


        saveCustomers(
            customers
        );


        /*
         * Normalize deleted email.
         */

        var deletedEmail =
            String(
                deletedCustomer.email ||
                ""
            )
            .trim()
            .toLowerCase();



        /* =====================================================
           REMOVE ACTIVE LOGIN SESSION
        ===================================================== */

        var activeUser =
            readJSON(
                "lavanyaUser",
                null
            );


        if (
            activeUser &&
            (
                String(
                    activeUser.id || ""
                ) ===
                String(id)
                ||
                String(
                    activeUser.email || ""
                )
                .trim()
                .toLowerCase() ===
                deletedEmail
            )
        ) {

            try {

                localStorage.removeItem(
                    "lavanyaUser"
                );

            } catch (e) {

                /* Ignore */

            }

        }



        /* =====================================================
           REMOVE REMEMBERED EMAIL
        ===================================================== */

        var rememberedEmail = "";


        try {

            rememberedEmail =
                String(
                    localStorage.getItem(
                        "lavanyaRememberedEmail"
                    ) || ""
                )
                .trim()
                .toLowerCase();

        } catch (e) {

            rememberedEmail = "";

        }


        if (
            rememberedEmail &&
            rememberedEmail ===
            deletedEmail
        ) {

            try {

                localStorage.removeItem(
                    "lavanyaRememberedEmail"
                );

            } catch (e) {

                /* Ignore */

            }

        }



        /* =====================================================
           REMOVE LEGACY ACCOUNT IF IT BELONGS TO THIS CUSTOMER
        ===================================================== */

        var legacyUser =
            readJSON(
                REGISTERED_USER_KEY,
                null
            );


        if (
            legacyUser &&
            String(
                legacyUser.email || ""
            )
            .trim()
            .toLowerCase() ===
            deletedEmail
        ) {

            try {

                localStorage.removeItem(
                    REGISTERED_USER_KEY
                );

            } catch (e) {

                /* Ignore */

            }

        }


        return true;

    }



    /* =========================================================
       PUBLIC API
       ========================================================= */

    global.LavanyaStore = {

        PRODUCTS_KEY:
            PRODUCTS_KEY,

        ORDERS_KEY:
            ORDERS_KEY,

        CUSTOMERS_KEY:
            CUSTOMERS_KEY,

        CATEGORY_LABELS:
            CATEGORY_LABELS,


        /* PRODUCTS */

        getProducts:
            getProducts,

        saveProducts:
            saveProducts,

        getProductById:
            getProductById,

        addProduct:
            addProduct,

        updateProduct:
            updateProduct,

        deleteProduct:
            deleteProduct,


        /* ORDERS */

        getOrders:
            getOrders,

        saveOrders:
            saveOrders,

        addOrder:
            addOrder,

        updateOrderStatus:
            updateOrderStatus,

        deleteOrder:
            deleteOrder,


        /* CUSTOMERS */

        getCustomers:
            getCustomers,

        saveCustomers:
            saveCustomers,

        findCustomerByEmail:
            findCustomerByEmail,

        findCustomerById:
            findCustomerById,

        addCustomer:
            addCustomer,

        updateCustomer:
            updateCustomer,

        deleteCustomer:
            deleteCustomer

    };



    /* =========================================================
       INITIALIZE CUSTOMER MIGRATION
       ========================================================= */

    migrateLegacyCustomer();


})(window);