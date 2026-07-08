//////////////////////////////////////////////////////////////////////////
// Utilities

// Manage user and product lists saved in local storage //////////////////

// Retrieve an array from local storage
function lsGetItems(nameArray) {
    const DATA = JSON.parse(localStorage.getItem(nameArray));
    return (Array.isArray(DATA)) ? DATA : [];
}

// Array method to save an item to local storage and update the last item ID
Array.prototype.lsAddItem = function (nameArray, item) {
    if (item.id === 0) {
        // Initialize the item's identifier and push the item to the array
        item.id = (parseInt(localStorage.getItem(nameArray + "ID")) || 0) + 1;
        this.push(item);

        // Save the item to local storage and update the last item ID
        localStorage.setItem(nameArray, JSON.stringify(this));
        localStorage.setItem(nameArray + "ID", item.id);
        console.log("The item has been added to local storage.")
    } else
        console.log(`The item ID is not 0 (ID is ${item.id}): the item cannot be added to local storage.`);
};

// Remove an item from an array in local storage
function lsRemoveItem(nameArray, id) {
    const DATA = JSON.parse(localStorage.getItem(nameArray));
    if (Array.isArray(DATA)) {
        const INDEX = DATA.findIndex(item => item.id == id);
        if (INDEX > -1) {
            DATA.splice(INDEX, 1);
            localStorage.setItem(nameArray, JSON.stringify(DATA));
            console.log("The item has been removed from local storage.");
        } else
            console.log("The item to be removed does not exist in local storage.");
    } else
        console.log("No items to remove from local storage: no data.");
}

// Manage the user session ///////////////////////////////////////////////

// Retrieve the logged-in user stored in session storage
function ssGetUser() {
    return parseInt(sessionStorage.getItem("sessionId")) || 0;
}

// Save the logged-in user to session storage
function ssSetUser(userId) {
    sessionStorage.setItem("sessionId", userId);
}

// Remove the logged-in user from session storage
function ssRemoveUser() {
    sessionStorage.removeItem("sessionId");
}

// General functions /////////////////////////////////////////////////////

// When resizing the window
function resizeWindow() {
    // Show the back-to-top button
    document.getElementById("scroll-top").style.display = (window.innerHeight >= document.body.scrollHeight) ? "none" : "block";
}

//////////////////////////////////////////////////////////////////////////
// Initialize the page

function init() {
    // Handle the index.html page ////////////////////////////////////////

    const MAIN_INDEX = document.getElementById("main-index");
    if (MAIN_INDEX) {
        const PRODUCTS = lsGetItems("products");

        if (PRODUCTS.length > 0) {
            // Display the products
            const CONTAINER = document.querySelector(".product-container");
            PRODUCTS.forEach(product => {
                const PRODUCT = new Product();
                Object.assign(PRODUCT, product);

                // Display the product
                const ID = `btn-product-${PRODUCT.id}`;
                PRODUCT.display(CONTAINER, "article-product", { id: ID, text: "Voir" });

                // Add an event to navigate to the products.html page and target the product the user clicked on
                document.getElementById(ID).addEventListener("click", () => {
                    window.location.href = `pages/products.html?id=${PRODUCT.id}`;
                });
            });
        } else {
            const title = MAIN_INDEX.querySelector("section:nth-of-type(3) .h2-title");
            title.textContent = "Aucun produit";
        }
    }

    // Handle the addUser.html page //////////////////////////////////////

    const MAIN_ADD_USER = document.getElementById("main-add-user");
    if (MAIN_ADD_USER) {
        // Fill in the 'gender', 'interests' and 'country' fields
        Gender.fill();
        Interests.fill();
        Country.fill(5);

        // Add an administrator
        const pswd = `3kb!BWFe;dgXqV]`;
        addAdmin("Fabien", "chastangfabien0@gmail.com", pswd, pswd, 2, 5);

        document.getElementById("form-user").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();

            // Add a new user
            addUser();
        });
    }

    // Handle the login.html page ////////////////////////////////////////

    const MAIN_LOGIN = document.getElementById("main-login");
    if (MAIN_LOGIN) {
        document.getElementById("form-login").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();

            // Log in
            login();
        });
    }

    // Handle the products.html page /////////////////////////////////////

    const MAIN_PRODUCTS = document.getElementById("main-products");
    if (MAIN_PRODUCTS) {
        const PRODUCTS = lsGetItems("products");

        if (PRODUCTS.length > 0) {
            // Get URL parameters
            const URL_PARAMS = new URLSearchParams(window.location.search);
            const SELECTED_ID = URL_PARAMS.get("id");

            // Fill the carousel and display the products
            fillCarousel(PRODUCTS, (SELECTED_ID) ? SELECTED_ID : 0);

            // Set a delay for the display of the carousel and the active product
            const CAROUSEL_PRODUCT = document.getElementById("carousel-product");
            let activeItemId = "product-" + this.querySelector(".carousel-item.active").getAttribute("data-item-id");

            setTimeout(() => {
                CAROUSEL_PRODUCT.style.visibility = "visible";
                document.getElementById(activeItemId).style.display = "block";
            }, 200);

            // Add an event to handle the carousel
            CAROUSEL_PRODUCT.addEventListener("slid.bs.carousel", () => {
                // The new active product
                const NEW_ITEM_ID = "product-" + this.querySelector(".carousel-item.active").getAttribute("data-item-id");

                // Manage visibility
                document.getElementById(activeItemId).style.display = "none";
                document.getElementById(NEW_ITEM_ID).style.display = "block";

                // Update the ID of the new active product
                activeItemId = NEW_ITEM_ID;
            });
        } else {
            const title = MAIN_PRODUCTS.querySelector("section:first-of-type .h2-title");
            title.textContent = "Aucun produit";
            title.style.display = "block";
        }
    }

    // Handle the addProduct.html page ///////////////////////////////////

    const MAIN_ADD_PRODUCT = document.getElementById("main-add-product");
    if (MAIN_ADD_PRODUCT) {
        document.getElementById("form-product").addEventListener("submit", event => {
            // Prevents the browser's default behavior associated with an event; in this case, reloading the page
            event.preventDefault();

            // Add a new product to local storage
            addProduct();
        });
    }

    // For all pages /////////////////////////////////////////////////////

    // Set the copyright year
    const COPYRIGHT_YEAR = document.getElementById("copyright-year");
    if (COPYRIGHT_YEAR) COPYRIGHT_YEAR.innerHTML = (new Date()).getFullYear();

    // When resizing the window
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