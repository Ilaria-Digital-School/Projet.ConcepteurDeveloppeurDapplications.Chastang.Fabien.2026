//////////////////////////////////////////////////////////////////////////
// Manage orders
//////////////////////////////////////////////////////////////////////////


// Check if the user's cart is valid /////////////////////////////////////
function checkCart(userId = null) {
    const USER_ID = parseInt(userId) || getLoggedIn();
    if (!USER_ID || USER_ID < 0)
        return displayLog("User not logged in!", true, "[order: check cart] - ");

    const PRODUCTS = lsGetItems("products");
    if (PRODUCTS.length == 0)
        return displayLog("No products are listed!", true, "[order: check cart] - ");

    const [CARTS, INDEX] = lsFindIndex("carts", cart => cart.userId = USER_ID);

    if (INDEX == -1 || CARTS[INDEX].products.length == 0)
        return displayLog(`${(INDEX == -1) ? "Invalid cart" : "Empty cart"}!`, true, "[order: check cart] - ");

    return [USER_ID, PRODUCTS, CARTS, INDEX];
}

// Main class ////////////////////////////////////////////////////////////
class Order {
    id = 0;
    userId = 0;
    date = null;
    products = [];
    totalPrice = 0;
    isVisible = true;
    cartIndex = -1;

    constructor(userId = null) {
        if (userId !== -1) {
            this.date = Date.now();

            const PARAMS = checkCart(userId);
            if (!PARAMS) return;

            const [USER_ID, PRODUCTS, CARTS, INDEX] = PARAMS;

            CARTS[INDEX].products.forEach(cartProduct => {
                const PRODUCT = PRODUCTS.find(product => product.id == cartProduct.id);
                if (PRODUCT) {
                    const ORDER_PRODUCT = {
                        id: cartProduct.id,
                        name: PRODUCT.name,
                        description: PRODUCT.description,
                        price: PRODUCT.price,
                        quantity: cartProduct.quantity
                    };
                    this.products.push(ORDER_PRODUCT);
                    this.totalPrice += cartProduct.quantity * PRODUCT.price;
                }
            });

            if (this.totalPrice > 0) {
                this.userId = USER_ID;
                this.cartIndex = INDEX;
            }
        }
    }

    display(tbody) {
        this.products.forEach((product, index) => {
            const TR = document.createElement("tr");
            TR.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${product.name}</td>
                <td>${product.price}€</td>
                <td>${product.quantity}</td>
                <td>${product.quantity * product.price}€</td>
            `;
            tbody.appendChild(TR);
        });
    }
}

// Add a new user's cart to local storage ////////////////////////////////
function addOrder(userId = null, toConsole = false) {
    const PREFIX_LOG = (toConsole) ? "[add order] - " : null;

    // Create a new order
    const ORDER = new Order(userId);

    if (ORDER.userId > 0) {
        // Retrieve the cart index from the array of carts
        const INDEX = ORDER.cartIndex;

        // Save the order to local storage
        ORDER.cartIndex = undefined; // Remove the property
        lsGetItems("orders").lsAddItem("orders", "id", ORDER);

        // Remove the user's cart
        const CARTS = lsGetItems("carts");
        CARTS.splice(INDEX, 1);
        if (CARTS.length == 0)
            localStorage.removeItem("carts");
        else
            CARTS.lsSetItems("carts");

        displayLog("La commande a été passée avec succès.", toConsole, PREFIX_LOG);
        window.location.href = "orders.html";
    } else {
        // Error
        displayLog("Échec lors de la confirmation de la commande !", toConsole, PREFIX_LOG);
        window.location.href = "cart.html";
    }
}

// Display the user's orders /////////////////////////////////////////////
function displayOrders(userId = null) {
    // Retrieve all products stored in local storage
    const PRODUCTS = lsGetItems("products");
    if (PRODUCTS.length == 0)
        return displayError("Aucun article n'est référencé", "h2-title-order inactive", "h2-title");

    // Retrieve the user
    const USERS = lsGetItems("users");
    if (USERS.length == 0)
        return displayError("Veuillez créer un compte ou vous connecter", "h2-title-order inactive", "h2-title");

    const USER_ID = parseInt(userId) || getLoggedIn();
    if (!USER_ID || USER_ID < 0)
        return displayError("Veuillez créer un compte ou vous connecter", "h2-title-order inactive", "h2-title");

    // Retrieve the user's cart
    const ORDERS = lsGetItemsByFilter("orders", order => order.isVisible && order.userId == USER_ID).reverse();
    if (ORDERS.length == 0)
        return displayError("Vous n'avez effectué aucune commande", "h2-title-order inactive", "h2-title");

    // Initializing variables containing the DOM elements
    const MAIN = document.querySelector("main");
    let section = MAIN.querySelector("section");
    section.querySelector("h2").classList.remove("inactive");
    section.querySelector("div").classList.remove("inactive");
    const SECTION_HTML = section.innerHTML;

    const DATE_OPTIONS = {
        hour: '2-digit',
        minute: '2-digit'
    };

    // Display the orders
    ORDERS.forEach((order, index) => {
        if (index > 0) {
            section = document.createElement("section");
            section.innerHTML = SECTION_HTML;
            MAIN.appendChild(section);
        }
        const ORDER = new Order(-1);
        Object.assign(ORDER, order);

        // Display the order date in the title
        const H2 = section.querySelector("h2");
        const DATE = new Date(ORDER.date);
        H2.querySelector("span").textContent = DATE.toLocaleDateString() + " à " + DATE.toLocaleTimeString(undefined, DATE_OPTIONS);

        // Fill the table containing the order
        const TBODY = section.querySelector("tbody");
        ORDER.display(TBODY);

        // Add the line corresponding to the total order amount
        const TR = document.createElement("tr");
        TR.style.fontWeight = "900";
        TR.style.letterSpacing = "1px";
        TR.innerHTML = `
            <td colspan="4">Total</td>
            <td>${ORDER.totalPrice}€</td>
        `;
        TBODY.appendChild(TR);
    });

    return true;
}