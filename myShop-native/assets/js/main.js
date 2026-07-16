//////////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////////


// Manage user, product and order lists saved in local storage ///////////

// Retrieve an array from local storage
function lsGetItems(nameArray) {
    const ITEMS = JSON.parse(localStorage.getItem(nameArray));
    return (Array.isArray(ITEMS)) ? ITEMS : [];
}
function lsGetItemsByFilter(nameArray, predicate) {
    return lsGetItems(nameArray).filter(predicate);
}
function lsGetItemsByVisibility(nameArray, isVisible = true) {
    return lsGetItemsByFilter(nameArray, item => item.isVisible == isVisible);
}

// Retrieve an element or its index from an array stored in local storage
function lsFind(nameArray, predicate) {
    const ITEMS = lsGetItems(nameArray);
    if (ITEMS.length > 0) {
        const ITEM = ITEMS.find(predicate);
        if (ITEM) return [ITEMS, ITEM];
    }
    return [ITEMS, null];
}
function lsFindIndex(nameArray, predicate) {
    const ITEMS = lsGetItems(nameArray);
    if (ITEMS.length > 0) {
        const INDEX = ITEMS.findIndex(predicate);
        if (INDEX > -1) return [ITEMS, INDEX];
    }
    return [ITEMS, null];
}

// Save an array to local storage
Array.prototype.lsSetItems = function (nameArray) {
    localStorage.setItem(nameArray, JSON.stringify(this));
}

// Array method to save an item to local storage and update the last item ID
Array.prototype.lsAddItem = function (nameArray, nameId, item) {
    if (item[nameId] === 0) {
        // Initialize the item's identifier and push the item to the array
        item[nameId] = (parseInt(localStorage.getItem(nameArray + "ID")) || 0) + 1;
        this.push(item);

        // Save the item to local storage and update the last item ID
        this.lsSetItems(nameArray);
        localStorage.setItem(nameArray + "ID", item[nameId]);
        console.log("The item has been added to local storage.")
    } else
        console.log(`The item ID is not 0 (ID is ${item[nameId]}): the item cannot be added to local storage.`);
};

// Array method to delete an item from an array in local storage
Array.prototype.lsRemoveItem = function (nameArray, nameId, id) {
    const INDEX = this.findIndex(item => item[nameId] == id);
    if (INDEX > -1) {
        this.splice(INDEX, 1);

        if (this.length == 0)
            localStorage.removeItem(nameArray);
        else
            this.lsSetItems(nameArray);

        console.log("The item has been removed from local storage.");
    } else
        console.log("The item to be removed does not exist in local storage.");
}

// Array method to enable or disable an item from an array in local storage
Array.prototype.lsSetItemVisibility = function (nameArray, nameId, id, isVisible) {
    const ITEM = this.find(item => item[nameId] == id);
    if (ITEM) {
        ITEM.isVisible = isVisible;

        // Save the item to local storage
        this.lsSetItems(nameArray);
        console.log("The item has been removed from local storage.");
    } else
        console.log("The item to be removed does not exist in local storage.");
}

// Manage the user session ///////////////////////////////////////////////

// Role class: static object
class Role {
    static user = 0;
    static admin = 1;
    static superAdmin = 2;

    static validate = role => {
        const ROLE = parseInt(role);
        return (ROLE == Role.user || ROLE == Role.admin || ROLE == Role.superAdmin) ? ROLE : null;
    };
}

// Retrieve the logged-in user stored in session storage or local storage
function getLoggedIn() {
    return parseInt(localStorage.getItem("sessionId")) || parseInt(sessionStorage.getItem("sessionId")) || 0;
}

// Remove the logged-in user from session storage or local storage
function logoutUser() {
    localStorage.removeItem("sessionId");
    sessionStorage.removeItem("sessionId");
}
function logout(toConsole = false) {
    // Logout
    if (getLoggedIn()) logoutUser();

    // Display the logout message
    const displayLog = (toConsole) ? console.log : alert;
    displayLog(((toConsole) ? "[logout] - " : "") + "Vous êtes déconnecté.");

    const ADD_PRODUCT = document.getElementById("navbar-add-product");
    if (ADD_PRODUCT && !ADD_PRODUCT.className.includes("inactive")) ADD_PRODUCT.classList.add("inactive");

    // Redirecting to the homepage
    const [HREF, PAGES] = [window.location.href, ["index.html", "contact.html", "about.html"]];
    if (PAGES.every(page => !HREF.includes(page))) window.location.href = "../index.html";
}

// Check if the user is logged in as an administrator
function isLoggedInAdmin() {
    const USER_ID = getLoggedIn();
    if (USER_ID > 0) {
        const USERS = lsGetItems("users");
        const USER = USERS.find(user => user.id == USER_ID);
        if (USER) return USER.role == Role.admin || USER.role == Role.superAdmin;
    }
    return false;
}

// General functions /////////////////////////////////////////////////////

// Method of the HTML input object used to validate the input of a "number" or "text" type field
HTMLInputElement.prototype.checkPositiveNumber = function (isInt, maxValue, defaultValue) {
    let value = this.value.replace(",", ".").replace(/[^\d.]/g, "");
    if (isInt)
        value = parseInt(value);
    else {
        value = parseFloat(value);
        value = Math.round(100 * value) / 100;
    }
    this.value = (value > 0) ? ((value <= maxValue) ? value : maxValue) : ((defaultValue) ? defaultValue : "");
}

// Method of the HTML select object to retrieve and potentially select or deselect an option by its value
HTMLSelectElement.prototype.select = function (value) {
    const OPTION = Array.from(this.options).find(option => option.value == value);
    if (OPTION) OPTION.selected = true;
    return OPTION;
}

// Display log
function displayLog(message, toConsole = false, prefixMsg = null) {
    ((toConsole) ? console.log : alert)(((prefixMsg) ? prefixMsg : "") + message);
    return false;
}

// Display an error message in the title
function displayError(message, classRemove = null, classAdd = null, showContainer = null) {
    // Display the error mesaage
    const H2 = document.querySelector("main section h2");
    H2.textContent = message;

    // Manage the class
    if (classRemove) {
        const REMOVE = classRemove.split(" ");
        REMOVE.forEach(css => H2.classList.remove(css));
    }
    if (classAdd) {
        const ADD = classAdd.split(" ");
        ADD.forEach(css => H2.classList.add(css));
    }

    // Show/Hide the container if necessary
    if (typeof showContainer == "boolean") {
        const CONTAINER = document.querySelector("main section div");
        const INACTIVE = CONTAINER.className.includes("inactive");
        if (showContainer) {
            if (INACTIVE) CONTAINER.classList.remove("inactive");
        } else {
            if (!INACTIVE) CONTAINER.classList.add("inactive");
        }
    }

    return false;
}

// Display the number of products in the cart
function displayCartNbProducts() {
    const USER_ID = getLoggedIn();
    const STICKER = document.getElementById("cart-sticker");

    if (USER_ID > 0) {
        const [CARTS, FOUND] = lsFind("carts", cart => cart.userId == USER_ID);
        if (FOUND) {
            let counter = 0;
            FOUND.products.forEach(item => counter += item.quantity);
            STICKER.textContent = counter;
            return counter;
        }
    }
    STICKER.textContent = "";
    return 0;
}

// DOM management functions //////////////////////////////////////////////

// Data for displaying the navigation bar
const LOGOUT = '<a href="javascript:logout()"><i class="fa-solid fa-power-off"></i>Déconnexion</a>';
const NAVBAR = [
    {
        pages: "index.html",
        link: '<a href="../index.html" title="Accueil" aria-label="Accueil"><i class="fa-regular fa-house"></i></a>',
        selected: '<span class="selected-page" title="Accueil" aria-label="Accueil"><i class="fa-regular fa-house"></i></span>'
    },
    {
        pages: "products.html",
        link: '<a href="./pages/products.html">Nos Articles</a>',
        selected: '<span class="selected-page">Nos Articles</span>'
    },
    {
        pages: "addProduct.html",
        link: '<a href="./pages/addProduct.html">Nouvel Article</a>',
        selected: '<span class="selected-page">Nouvel Article</span>',
        id: "navbar-add-product",
        className: "inactive"
    },
    {
        pages: "cart.html,addOrder.html",
        link: '<a href="./pages/cart.html" title="Mon panier" aria-label="Mon panier"><i class="fa-solid fa-cart-arrow-down"></i></a><span id="cart-sticker"></span>',
        selected: '<span class="selected-page" title="Mon panier" aria-label="Mon panier"><i class="fa-solid fa-cart-arrow-down"></i></span><span id="cart-sticker"></span>'
    },
    {
        pages: "login.html",
        submenu: true,
        link: '<a href="./pages/login.html">Connexion</a>',
        selected: '<span class="selected-page">Connexion</span>'
    },
    {
        pages: "addUser.html",
        submenu: true,
        link: '<a href="./pages/addUser.html">Inscription</a>',
        selected: '<span class="selected-page">Inscription</span>'
    },
    {
        pages: "orders.html",
        submenu: true,
        link: '<a href="./pages/orders.html">Commandes</a>',
        selected: '<span class="selected-page">Commandes</span>',
        last: true
    },
    {
        pages: "contact.html",
        link: '<a href="./pages/contact.html" title="Contactez-nous" aria-label="Contactez-nous"><i class="fa-regular fa-envelope"></i></a>',
        selected: '<span class="selected-page" title="Contactez-nous" aria-label="Contactez-nous"><i class="fa-regular fa-envelope"></i></span>'
    },
    {
        pages: "about.html",
        link: '<a href="./pages/about.html" title="À propos de My Shop" aria-label="À propos de My Shop"><i class="fa-solid fa-circle-info"></i></a>',
        selected: '<span class="selected-page" title="À propos de My Shop" aria-label="À propos de My Shop"><i class="fa-solid fa-circle-info"></i></span>'
    }
];

// Display the page header
function setHeader() {
    // Retrieve the 'header' DOM object
    const HEADER = document.querySelector("header");

    // Display the title
    const H1 = document.createElement("h1");
    H1.textContent = "My Shop";
    HEADER.appendChild(H1);

    // Set up the navigation bar structure
    const NAV = document.createElement("nav");
    NAV.classList.add("navbar");
    NAV.classList.add("navbar-expand-lg");
    NAV.innerHTML = `
        <div class="container-fluid">
            <button class="navbar-toggler btn-burger" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 menu"></ul>
            </div>
        </div>
    `;
    HEADER.appendChild(NAV);

    // Constants and variables
    const [UL, HREF] = [NAV.querySelector("ul"), window.location.href];
    let li, submenuLi, anchor, submenu = null;

    // Local functions
    const isSelected = item => item.pages.split(",").some(page => HREF.includes(page));
    const getLink = item => (!isSelected(item)) ? (HREF.includes("index.html")) ? item.link : item.link.replace("./pages/", "") : item.selected;
    const setLi = (item, html) => {
        li = document.createElement("li");
        if (item.id) li.id = item.id;
        if (item.className) li.classList.add(item.className);
        li.innerHTML = html;
        UL.appendChild(li);
    };
    const setSubmenuLi = html => {
        submenuLi = document.createElement("li");
        submenuLi.innerHTML = html;
        submenu.appendChild(submenuLi);
    };

    // Display the navigation bar
    NAVBAR.forEach(item => {
        if (item.submenu) {
            if (!submenu) {
                // Set the submenu
                const HTML = `
                    <a href="#" aria-label="Mon profile"><i class="fa-regular fa-circle-user"></i></a>
                    <ul class="submenu"></ul>
                `;
                setLi(item, HTML);
                anchor = li.querySelector("a");
                submenu = li.querySelector("ul");
            }

            // Fill the submenu
            if (isSelected(item)) anchor.classList.add("selected-page");
            setSubmenuLi(getLink(item));
            if (item.last) setSubmenuLi(LOGOUT); // Add the logout link
        } else
            setLi(item, getLink(item)); // Fill the navigation bar
    });
}

// Display the button to return to the top of the page, and the page footer
function setFooter() {
    // Display the button to return to the top of the page
    const BTN_TOP = document.createElement("button");
    BTN_TOP.id = "scroll-top";
    BTN_TOP.ariaLabel = BTN_TOP.title = "Retour en haut de la page";
    BTN_TOP.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(BTN_TOP);

    // Display the page footer
    const FOOTER = document.createElement("footer");
    FOOTER.innerHTML = `
        <h2>Retrouvez-nous :</h2>
        <p>
            <a href="https://www.linkedin.com/in/fabien-chastang/" target="_blank"><i class="fa-brands fa-square-linkedin"></i>LinkedIn</a>
            <a href="https://github.com/fabien-chastang" target="_blank"><i class="fa-brands fa-github"></i>GitHub</a>
            <span class="copyright">Copyright © ${(new Date()).getFullYear()} My Shop</span>
        </p>
    `;
    document.body.appendChild(FOOTER);
}

// Window resizing management
function resizeWindow() {
    // Show the back-to-top button
    document.getElementById("scroll-top").style.display = (window.innerHeight >= document.body.scrollHeight) ? "none" : "block";
}


//////////////////////////////////////////////////////////////////////////
// Initialize the pages
//////////////////////////////////////////////////////////////////////////


// Flag for development
const DEVELOPMENT = true;

function init() {
    //////////////////////////////////////////////////////////////////////
    // 'Home' page >> index.html

    const MAIN_INDEX = document.getElementById("main-index");
    if (MAIN_INDEX) {
        // Display the promotion end date
        const PROMO = document.querySelector("#main-index section:last-of-type mark");
        if (PROMO) {
            // Display the end date of the current month
            const TODAY = new Date();
            let datePromo = new Date(TODAY.setMonth(TODAY.getMonth() + 1));
            datePromo = new Date(datePromo.getFullYear(), datePromo.getMonth(), 0);
            PROMO.textContent = "jusqu'au " + datePromo.toLocaleDateString();
        }

        // Array of products saved in local storage
        let products;

        // Add data for development
        if (DEVELOPMENT) {
            // Add an administrator
            const ADMIN_NAME = "Fabien";
            const ADMIN_EMAIL = "admin.fabien@myshop.com";
            const ADMIN_PSWD = `3kb!BWFe;dgXqV]`;

            addAdmin(ADMIN_NAME, ADMIN_EMAIL, ADMIN_PSWD, ADMIN_PSWD);

            products = lsGetItems("products");
            if (products.length == 0) {
                // Fill the product array
                let path = (self.location.href.includes(".github.io/")) ? "/Projet.ConcepteurDeveloppeurDapplications.Chastang.Fabien.2026" : "";
                path += "/myShop-native/assets/img/clothing/";

                let product = new Product(
                    "Chemise",
                    "Chemise homme en coton bleu clair",
                    20,
                    path + "men/shirts/cms1.png",
                    `Cet article est <span>fortement recommendé</span> par nos client`
                );
                products.lsAddItem("products", "id", product);

                product = new Product(
                    "Robe",
                    "Robe en jean denim indigo",
                    40,
                    path + "women/dresses/cwd1.png"
                );
                products.lsAddItem("products", "id", product);

                product = new Product(
                    "Robe",
                    "Robe en coton bleu nuit",
                    70,
                    path + "women/dresses/cwd2.png"
                );
                products.lsAddItem("products", "id", product);
            }
        }

        // Array of non-archived products saved in local storage
        products = lsGetItemsByVisibility("products");

        if (products.length > 0) {
            // Display the products
            const CONTAINER = document.querySelector(".product-container");

            products.forEach(product => {
                const PRODUCT = new Product();
                Object.assign(PRODUCT, product);

                // Display the product
                PRODUCT.display(
                    CONTAINER,
                    "article-product",
                    {
                        text: '<i class="fa-regular fa-eye"></i>',
                        attributes: [{ name: "title", value: "Voir" }, { name: "aria-label", value: "Voir" }],
                        callbackfn: id => window.location.href = `pages/products.html?id=${id}`
                    }
                );
            });
        } else
            // Display a message indicating that no products have been saved
            document.querySelector("main section:nth-of-type(3) h2").textContent = "Aucun article n'est référencé";
    }

    //////////////////////////////////////////////////////////////////////
    // 'Product presentation' page >> products.html 

    const MAIN_PRODUCTS = document.getElementById("main-products");
    if (MAIN_PRODUCTS) {
        const DELAY = 333; // Delay in milliseconds for displaying the carousel and the active product

        // Array of non-archived products saved in local storage
        const PRODUCTS = lsGetItemsByVisibility("products");
        if (PRODUCTS.length > 0) {
            // Get URL parameters
            const URL_PARAMS = new URLSearchParams(window.location.search);

            // Fill the carousel and display the products
            fillCarousel(
                PRODUCTS,
                URL_PARAMS.get("id"),
                {
                    text: '<i class="fa-solid fa-cart-arrow-down"></i>',
                    attributes: [{ name: "title", value: "Acheter" }, { name: "aria-label", value: "Acheter" }],
                    callbackfn: id => addCartProduct(id)
                }
            );

            // Delay in milliseconds for displaying the carousel and the active product
            const CAROUSEL = document.getElementById("carousel-product");
            let activeItemId = "product-" + this.querySelector(".carousel-item.active").getAttribute("data-item-id");

            setTimeout(() => {
                CAROUSEL.style.visibility = "visible";
                document.getElementById(activeItemId).style.display = "block";
            }, DELAY);

            // Add an event to handle the carousel
            CAROUSEL.addEventListener("slid.bs.carousel", () => {
                // The new active product
                const NEW_ITEM_ID = "product-" + this.querySelector(".carousel-item.active").getAttribute("data-item-id");

                // Manage visibility
                document.getElementById(activeItemId).style.display = "none";
                document.getElementById(NEW_ITEM_ID).style.display = "block";

                // Update the ID of the new active product
                activeItemId = NEW_ITEM_ID;
            });
        } else
            // Display a message indicating that no products have been saved
            displayError("Aucun article n'est référencé", "inactive");
    }

    //////////////////////////////////////////////////////////////////////
    // 'Product addition' form page >> addProduct.html

    const MAIN_ADD_PRODUCT = document.getElementById("main-add-product");
    if (MAIN_ADD_PRODUCT) {
        // Set focus on the first field
        document.getElementById("name-product").focus();

        // Validate the input for the 'price' field of type "text"
        const INPUT_PRICE = document.getElementById("price-product");
        INPUT_PRICE.addEventListener("change", () => {
            INPUT_PRICE.checkPositiveNumber(false, 9999.99);
        });

        // Add a new product when submitting the form
        document.querySelector("form").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();

            // Add a new product to local storage
            addProduct();
        });
    }

    //////////////////////////////////////////////////////////////////////
    // 'User's cart' page >> cart.html

    const MAIN_CART = document.getElementById("main-cart");
    if (MAIN_CART) {
        // Display the user's shopping cart
        displayCart();

        // Add a new product when submitting the form
        document.querySelector("form").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();

            // Add a new product to local storage
            window.location.href = "addOrder.html";
        });
    }

    //////////////////////////////////////////////////////////////////////
    // 'Order payment' form page >> addOrder.html

    const MAIN_ADD_ORDER = document.getElementById("main-add-order");
    if (MAIN_ADD_ORDER) {
        // Add a new product when submitting the form
        document.querySelector("form").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();

            // Add a new user's order to local storage
            addOrder();
        });
    }

    //////////////////////////////////////////////////////////////////////
    // 'Login' page >> login.html

    const MAIN_LOGIN = document.getElementById("main-login");
    if (MAIN_LOGIN) {
        // Set focus on the first field
        document.getElementById("email-user").focus();

        // Log the user in when the form is submitted
        document.querySelector("form").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();

            // Log in
            login();
        });
    }

    //////////////////////////////////////////////////////////////////////
    // 'User registration' form page >> addUser.html

    const MAIN_ADD_USER = document.getElementById("main-add-user");
    if (MAIN_ADD_USER) {
        // To initialize the default country
        const COUNTRY_ID = Country.getId("France");

        // Fill the 'gender', 'interests' and 'country' fields
        User.fill(null, null, COUNTRY_ID);

        // Set focus on the first field
        document.getElementById("name-user").focus();

        // Add a new user when submitting the form
        document.querySelector("form").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();

            // Add a new user
            addUser(COUNTRY_ID);
        });

        // Reset the form
        document.querySelector("form").addEventListener("reset", event => {
            // Prevents the browser's default behavior associated with an event
            event.preventDefault();

            // Reset the form
            User.reset(null, null, COUNTRY_ID)
        });
    }

    //////////////////////////////////////////////////////////////////////
    // 'User's orders' presentation page >> orders.html

    const MAIN_ORDERS = document.getElementById("main-orders");
    if (MAIN_ORDERS) {
        // Display the logged-in user's orders
        displayOrders();
    }

    //////////////////////////////////////////////////////////////////////
    // 'Contact us' page >> contact.html

    const MAIN_CONTACT = document.getElementById("main-contact");
    if (MAIN_CONTACT) {
        // Set focus on the first field
        document.getElementById("name-user").focus();

        // Log the user in when the form is submitted
        document.querySelector("form").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();
        });
    }

    //////////////////////////////////////////////////////////////////////
    // For all pages

    // Display the page header
    setHeader();

    // Display the button to return to the top of the page, and the page footer
    setFooter();

    // Show or hide the 'New product' tab depending on whether the user is an administrator or not
    const ADD_PRODUCT = document.getElementById("navbar-add-product");
    if (isLoggedInAdmin())
        ADD_PRODUCT.classList.remove("inactive");
    else if (!ADD_PRODUCT.className.includes("inactive"))
        ADD_PRODUCT.classList.add("inactive");

    // Show or hide the number of products in the cart
    displayCartNbProducts();

    // Window resizing management
    resizeWindow();
    window.addEventListener("resize", resizeWindow); // BAD WAY: uses the "resize" event to handle page resizing

    // Add an event to return to the top of the page
    document.getElementById("scroll-top").addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

document.addEventListener("DOMContentLoaded", init);