//////////////////////////////////////////////////////////////////////////
// Manage the cart

// Main class
class Cart {
    constructor(userId, productId, quantity) {
        this.userId = userId;
        this.products = [{ id: productId, quantity: quantity }];
    }

    addProduct(productId, quantity) {
        const PRODUCT = this.products.find(p => p.id == productId);
        if (PRODUCT)
            PRODUCT.quantity += quantity;
        else
            this.products.push({ id: productId, quantity: quantity });
    }

    removeProduct(productId) {
        const INDEX = this.products.findIndex(p => p.id == productId);
        if (INDEX > -1) {
            this.products.splice(INDEX, 1);
            return true;
        } else
            return false;
    }

    updateQuantity(productId, quantity) {
        const PRODUCT = this.products.find(p => p.id == productId);
        if (PRODUCT) {
            PRODUCT.quantity = quantity;
            return true;
        } else
            return false;
    }

    display(allProducts, tbody) {
        let totalPrice = 0;
        this.products.forEach((product, index) => {
            const PRODUCT = allProducts.find(p => p.id == product.id);
            if (PRODUCT) {
                const FULL_PRICE = PRODUCT.price * product.quantity;
                totalPrice += FULL_PRICE;

                const TR = document.createElement("tr");
                TR.id = "tr-${index}";
                TR.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${PRODUCT.name}</td>
                    <td>${PRODUCT.price}€</td>
                    <td><input type="number" onchange="changeCartQuantity(this, ${product.id}, ${product.quantity})" value="${product.quantity}" size="2" oninput="checkNumber(this, true, 99, ${product.quantity})" required></td>
                    <td>${FULL_PRICE}€</td>
                    <td>
                        <button type="button" onclick="deleteCartProduct(${product.id})" class="btn btn-danger" title="Supprimer" aria-label="Supprimer">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(TR);
            }
        });
        return totalPrice;
    }
}

// Add a product to a cart and save the change to local storage
function addCartProduct(productId, quantity = 1, userId = null, toConsole = false) {
    // Get session ID
    const USER_ID = parseInt(userId) || getLoggedIn() || 0;
    if (!USER_ID || USER_ID < 0) {
        const displayMsg = (toConsole) ? console.log : alert;
        const PREFIX_MSG = (toConsole) ? "[cart: add product] - " : "";

        displayMsg(PREFIX_MSG + "Pour ajouter un produit à votre panier, veuillez vous connecter.");
        return false;
    }

    // Retrieve the parameters
    const PRODUCT_ID = parseInt(productId);
    if (!PRODUCT_ID || PRODUCT_ID < 0) {
        console.log("[cart: add product] - Invalid productId parameter!");
        return false;
    }
    const QUANTITY = parseInt(quantity);
    if (!QUANTITY || QUANTITY < 0) {
        console.log("[cart: add product] - Invalid quantity parameter!");
        return false;
    }

    // Retrieve the user's cart
    const CARTS = lsGetItems("carts");
    const CART_FOUND = CARTS.find(c => c.userId == USER_ID);

    if (CART_FOUND) {
        const CART = new Cart();
        Object.assign(CART, CART_FOUND);

        // Add the product to the found cart
        CART.addProduct(PRODUCT_ID, QUANTITY);
    } else
        // Add a new cart
        CARTS.push(new Cart(USER_ID, PRODUCT_ID, QUANTITY));

    // Save the change to local storage
    localStorage.setItem("carts", JSON.stringify(CARTS));
    console.log("[cart: add product] - Success !");
    return true;
}

// Remove a product from a cart and save the change to local storage
function removeCartProduct(productId, userId = null) {
    // Get session ID
    const USER_ID = parseInt(userId) || getLoggedIn() || 0;
    if (!USER_ID || USER_ID < 0) {
        console.log("[cart: remove product] - Invalid userId parameter and session ID!");
        return false;
    }

    // Retrieve the parameter
    const PRODUCT_ID = parseInt(productId);
    if (!PRODUCT_ID || PRODUCT_ID < 0) {
        console.log("[cart: remove product] - Invalid productId parameter!");
        return false;
    }

    // Retrieve the user's cart
    const CARTS = lsGetItems("carts");
    const CART_FOUND = CARTS.find(c => c.userId == USER_ID);

    if (CART_FOUND) {
        const CART = new Cart();
        Object.assign(CART, CART_FOUND);

        // Remove the product from the cart
        if (CART.removeProduct(PRODUCT_ID)) {
            // Save the change to local storage
            localStorage.setItem("carts", JSON.stringify(CARTS));
            console.log("[cart: remove product] - Success !");
            return true;
        } else {
            console.log("[cart: remove product] - The product is not in the cart!");
            return false;
        }
    } else {
        console.log("[cart: remove product] - The user does not have a cart!");
        return false;
    }
}

// Update the quantity of a product in a cart and save the change to local storage
function updateCartProduct(productId, quantity, userId = null) {
    // Get session ID
    const USER_ID = parseInt(userId) || getLoggedIn() || 0;
    if (!USER_ID || USER_ID < 0) {
        console.log("[cart: update product] - Invalid userId parameter and session ID!");
        return false;
    }

    // Retrieve the parameters
    const PRODUCT_ID = parseInt(productId);
    if (!PRODUCT_ID || PRODUCT_ID < 0) {
        console.log("[cart: update product] - Invalid productId parameter!");
        return false;
    }
    const QUANTITY = parseInt(quantity);
    if (!QUANTITY || QUANTITY < 0) {
        console.log("[cart: update product] - Invalid quantity parameter!");
        return false;
    }

    // Retrieve the user's cart
    const CARTS = lsGetItems("carts");
    const CART_FOUND = CARTS.find(c => c.userId == USER_ID);

    if (CART_FOUND) {
        const CART = new Cart();
        Object.assign(CART, CART_FOUND);

        // Remove the product from the cart
        if (CART.updateQuantity(PRODUCT_ID, QUANTITY)) {
            // Save the change to local storage
            localStorage.setItem("carts", JSON.stringify(CARTS));
            console.log("[cart: update product] - Success !");
            return true;
        } else {
            console.log("[cart: update product] - The product is not in the cart!");
            return false;
        }
    } else {
        console.log("[cart: update product] - The user does not have a cart!");
        return false;
    }
}

//////////////////////////////////////////////////////////////////////////
// View and edit the user's shopping cart

// Display the "Empty cart" message
function emptyCartMsg(h2Info) {
    h2Info.textContent = "Votre panier est vide.";
    h2Info.classList.remove("inactive");
}

// Display the user's cart
function displayCart(toConsole = false) {
    const displayMsg = (toConsole) ? console.log : alert;
    const PREFIX_MSG = (toConsole) ? "[cart: display products] - " : "";

    // Retrieve the HTML container and its title
    const [H2_INFO, CONTAINER] = [document.getElementById("h2-cart"), document.getElementById("cart-container")];

    // Retrieve the user
    const USERS = lsGetItems("users");
    if (USERS.length == 0) {
        emptyCartMsg(H2_INFO);
        displayMsg(PREFIX_MSG + "Veuillez vous enregistrer !");
        window.location.href = "addUser.html";
    }
    const USER_ID = getLoggedIn() || 0;
    if (!USER_ID) {
        emptyCartMsg(H2_INFO);
        displayMsg(PREFIX_MSG + "Veuillez vous enregistrer ou vous connecter !");
        return false;
    }

    // Retrieve all products stored in local storage
    const PRODUCTS = lsGetItems("products");
    if (PRODUCTS.length == 0) {
        emptyCartMsg(H2_INFO);
        displayMsg(PREFIX_MSG + "Il n'y a pas de produit enregistré !");
        return false;
    }

    // Retrieve the user's cart
    const CARTS = lsGetItems("carts");
    const CART_FOUND = CARTS.find(c => c.userId == USER_ID);
    if (!CART_FOUND) {
        emptyCartMsg(H2_INFO);
        return false;
    }

    // Display the cart
    const [CART, TBODY] = [new Cart(), document.getElementById("tbody-cart")];
    Object.assign(CART, CART_FOUND);

    const TOTAL_PRICE = CART.display(PRODUCTS, TBODY);
    if (TOTAL_PRICE > 0) {
        CONTAINER.classList.remove("inactive");
        H2_INFO.classList.remove("inactive");
        H2_INFO.style.marginBottom = "30px";

        const TR = document.createElement("tr");
        TR.innerHTML = `
            <td colspan="4">Total</td>
            <td>${TOTAL_PRICE}€</td>
            <td>
                <button type="button" id="btn-order" class="btn btn-success" title="Commander" aria-label="Commander">
                    <i class="fa-brands fa-cc-visa"></i>
                </button>
            </td>
        `;
        TBODY.appendChild(TR);
        return true;
    } else {
        emptyCartMsg(H2_INFO);
        return false;
    }
}

// Remove a product from the cart after a user click
function deleteCartProduct(productId) {
    removeCartProduct(productId);
    window.location.reload();
}

// Change the quantity
function changeCartQuantity(objInput, productId, quantity) {
    const QUANTITY = parseInt(objInput.value.replace(/\D/g, ""));
    if (!QUANTITY || QUANTITY < 0) {
        objInput.value = quantity;
        alert("La quantité doit être un nombre entier positif !");
    } else {
        updateCartProduct(productId, QUANTITY);
        window.location.reload();
    }
}