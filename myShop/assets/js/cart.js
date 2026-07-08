//////////////////////////////////////////////////////////////////////////
// Manage the cart

// Main class
class Cart {
    constructor(userId, productId, quantity) {
        this.userId = userId;
        this.products = [{ id: productId, quantity: quantity }];
    }

    add(productId, quantity) {
        const PRODUCT = this.products.find(p => p.id == productId);
        if (PRODUCT)
            PRODUCT.quantity += quantity;
        else
            this.products.push({ id: productId, quantity: quantity });
    }

    remove(productId, quantity) {
        const INDEX = this.products.findIndex(p => p.id == productId);
        if (INDEX > -1) {
            if (quantity == -1 || quantity >= this.products[INDEX].quantity)
                this.products.splice(INDEX, 1);
            else
                this.products[INDEX].quantity -= quantity;
            return true;
        } else
            return false;
    }
}

// UTILITIES: check the parameters and retrieve the user's cart
function checkParams(isAdded, userId, productId, quantity, prefixMsg) {
    // Check the parameters
    const USER_ID = parseInt(userId);
    if (!USER_ID || USER_ID < 0) {
        console.log(`[cart: ${prefixMsg}] - Invalid userId parameter !`);
        return false;
    }
    const PRODUCT_ID = parseInt(productId);
    if (!PRODUCT_ID || PRODUCT_ID < 0) {
        console.log(`[cart: ${prefixMsg}] - Invalid productId parameter !`);
        return false;
    }
    const QUANTITY = parseInt(quantity);
    if (!QUANTITY || (!isAdded || QUANTITY < 0) && QUANTITY < -1) {
        console.log(`[cart: ${prefixMsg}] - Invalid quantity parameter !`);
        return false;
    }

    // Retrieve the user's cart
    const CARTS = lsGetItems("carts");
    const CART = CARTS.find(c => c.userId == USER_ID);
    if (!isAdded && !CART) {
        console.log(`[cart: ${prefixMsg}] - The user does not have a cart !`);
        return false;
    }

    return [USER_ID, PRODUCT_ID, QUANTITY, CARTS, CART];
}

// Add a product to a cart and save the change to local storage
function addCartProduct(userId, productId, quantity = 1) {
    // Retrieve the parameters and the user's cart
    const PARAMS = checkParams(true, userId, productId, quantity, "add product");
    if (!PARAMS) return false;

    const [USER_ID, PRODUCT_ID, QUANTITY, CARTS, CART] = PARAMS;

    if (CART)
        // Add the product to the found cart
        CART.add(PRODUCT_ID, QUANTITY);
    else
        // Add a new cart
        CARTS.push(new Cart(USER_ID, PRODUCT_ID, QUANTITY));

    // Save the change to local storage
    localStorage.setItem("carts", JSON.stringify(CARTS));
    console.log("[cart: add product] - Success !");
    return true;
}

// Remove a product from a cart and save the change to local storage
function removeCartProduct(userId, productId, quantity = 1) {
    // Retrieve the parameters and the user's cart
    const PARAMS = checkParams(false, userId, productId, quantity, "remove product");
    if (!PARAMS) return false;

    const [USER_ID, PRODUCT_ID, QUANTITY, CARTS, CART] = PARAMS;

    // Remove the product from the cart
    if (CART.remove(PRODUCT_ID, QUANTITY)) {
        // Save the change to local storage
        localStorage.setItem("carts", JSON.stringify(CARTS));
        console.log("[cart: remove product] - Success !");
        return true;
    } else {
        console.log("[cart: remove product] - The product is not in the cart !");
        return false;
    }
}