//////////////////////////////////////////////////////////////////////////
// Manage shopping carts
//////////////////////////////////////////////////////////////////////////

// Main class
class Cart {
  constructor(userId, productId, quantity) {
    this.userId = userId;
    this.products = [{ id: productId, quantity: quantity }];
  }

  addProduct(productId, quantity) {
    const PRODUCT = this.products.find((product) => product.id == productId);
    if (PRODUCT) PRODUCT.quantity += quantity;
    else this.products.push({ id: productId, quantity: quantity });
  }

  removeProduct(productId) {
    const FOUND = this.products.findIndex((product) => product.id == productId);
    if (FOUND > -1) {
      this.products.splice(FOUND, 1);
      return true;
    } else return false;
  }

  updateQuantity(productId, quantity) {
    const PRODUCT = this.products.find((product) => product.id == productId);
    if (PRODUCT) {
      PRODUCT.quantity = quantity;
      return true;
    } else return false;
  }

  display(allProducts, tbody) {
    let totalPrice = 0;
    this.products.forEach((product, index) => {
      const PRODUCT = allProducts.find((item) => item.id == product.id);
      if (PRODUCT) {
        const FULL_PRICE = PRODUCT.price * product.quantity;
        totalPrice += FULL_PRICE;

        const TR = document.createElement("tr");
        TR.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td><label for="quantity-${index}">${PRODUCT.name}</label></td>
                    <td>${PRODUCT.price}€</td>
                    <td>
                        <input type="number" id="quantity-${index}" onchange="changeCartQuantity(this, ${product.id}, ${product.quantity})" 
                            aria-label="Modifier la quantité" value="${product.quantity}" size="2" 
                            oninput="this.checkPositiveNumber(true, 99, ${product.quantity})" required>
                    </td>
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

//////////////////////////////////////////////////////////////////////////
// Add, update and remove a shopping cart
//////////////////////////////////////////////////////////////////////////

// Add a product to a cart and save the change to local storage
function addCartProduct(
  productId,
  quantity = 1,
  userId = null,
  toConsole = false,
) {
  // Get session ID
  const USER_ID = parseInt(userId) || getLoggedIn();
  if (!USER_ID || USER_ID < 0)
    return displayLog(
      "Pour ajouter un produit à votre panier, veuillez vous connecter.",
      toConsole,
      toConsole ? "[cart: add product] - " : null,
    );

  // Retrieve the parameters
  const PRODUCT_ID = parseInt(productId);
  if (!PRODUCT_ID || PRODUCT_ID < 0)
    return displayLog(
      `Invalid productId (${productId}) parameter!`,
      true,
      "[cart: add product] - ",
    );

  const QUANTITY = parseInt(quantity);
  if (!QUANTITY || QUANTITY < 0)
    return displayLog(
      `Invalid quantity (${quantity}) parameter!`,
      true,
      "[cart: add product] - ",
    );

  // Retrieve the user's cart
  const [CARTS, FOUND] = lsFind("carts", (cart) => cart.userId == USER_ID);

  if (FOUND) {
    const CART = new Cart();
    Object.assign(CART, FOUND);

    // Add the product to the found cart
    CART.addProduct(PRODUCT_ID, QUANTITY);
  } else
    // Add a new cart
    CARTS.push(new Cart(USER_ID, PRODUCT_ID, QUANTITY));

  // Save the change to local storage
  CARTS.lsSetItems("carts");
  displayLog("Success!", true, "[cart: add product] - ");

  // Display the number of products in the cart
  displayCartNbProducts();

  return true;
}

// Update the quantity of a product in a cart and save the change to local storage
function updateCartProduct(productId, quantity, userId = null) {
  // Get session ID
  const USER_ID = parseInt(userId) || getLoggedIn();
  if (!USER_ID || USER_ID < 0)
    return displayLog(
      `Invalid userId (${userId}) parameter and session ID!`,
      true,
      "[cart: update product] - ",
    );

  // Retrieve the parameters
  const PRODUCT_ID = parseInt(productId);
  if (!PRODUCT_ID || PRODUCT_ID < 0)
    return displayLog(
      `Invalid productId (${productId}) parameter!`,
      true,
      "[cart: update product] - ",
    );

  const QUANTITY = parseInt(quantity);
  if (!QUANTITY || QUANTITY < 0)
    return displayLog(
      `Invalid quantity (${quantity}) parameter!`,
      true,
      "[cart: update product] - ",
    );

  // Retrieve the user's cart
  const [CARTS, FOUND] = lsFind("carts", (cart) => cart.userId == USER_ID);

  if (FOUND) {
    const CART = new Cart();
    Object.assign(CART, FOUND);

    // Remove the product from the cart
    if (CART.updateQuantity(PRODUCT_ID, QUANTITY)) {
      // Save the change to local storage
      CARTS.lsSetItems("carts");
      displayLog("Success!", true, "[cart: update product] - ");

      // Display the number of products in the cart
      displayCartNbProducts();

      return true;
    } else
      return displayLog(
        "The product is not in the cart!",
        true,
        "[cart: update product] - ",
      );
  } else
    return displayLog(
      "The user does not have a cart!",
      true,
      "[cart: update product] - ",
    );
}

// Remove a product from a cart and save the change to local storage
function removeCartProduct(productId, userId = null) {
  // Get session ID
  const USER_ID = parseInt(userId) || getLoggedIn();
  if (!USER_ID || USER_ID < 0)
    return displayLog(
      `Invalid userId (${userId}) parameter and session ID!`,
      true,
      "[cart: remove product] - ",
    );

  // Retrieve the parameter
  const PRODUCT_ID = parseInt(productId);
  if (!PRODUCT_ID || PRODUCT_ID < 0)
    return displayLog(
      `Invalid productId (${productId}) parameter!`,
      true,
      "[cart: remove product] - ",
    );

  // Retrieve the user's cart
  const [CARTS, FOUND] = lsFindIndex("carts", (cart) => cart.userId == USER_ID);

  if (FOUND > -1) {
    const CART = new Cart();
    Object.assign(CART, CARTS[FOUND]);

    // Remove the product from the cart
    if (CART.removeProduct(PRODUCT_ID)) {
      // Remove the cart if there is no product
      if (CART.products.length == 0) CARTS.splice(FOUND, 1);

      // Save the change to local storage
      if (CARTS.length == 0) localStorage.removeItem("carts");
      else CARTS.lsSetItems("carts");

      displayLog("Success!", true, "[cart: remove product] - ");

      // Display the number of products in the cart
      displayCartNbProducts();

      return true;
    } else
      return displayLog(
        "The product is not in the cart!",
        true,
        "[cart: remove product] - ",
      );
  } else
    return displayLog(
      "The user does not have a cart!",
      true,
      "[cart: remove product] - ",
    );
}

//////////////////////////////////////////////////////////////////////////
// View and edit the user's shopping cart
//////////////////////////////////////////////////////////////////////////

// Display the user's shopping cart
function displayCart(userId = null) {
  // Retrieve all products stored in local storage
  const PRODUCTS = lsGetItems("products");
  if (PRODUCTS.length == 0)
    return displayError(
      "Aucun article n'est référencé",
      "h2-info inactive",
      "h2-title",
    );

  // Retrieve the user
  const USERS = lsGetItems("users");
  if (USERS.length == 0)
    return displayError(
      "Veuillez créer un compte ou vous connecter",
      "h2-info inactive",
      "h2-title",
    );

  const USER_ID = parseInt(userId) || getLoggedIn();
  if (!USER_ID || USER_ID < 0)
    return displayError(
      "Veuillez créer un compte ou vous connecter",
      "h2-info inactive",
      "h2-title",
    );

  // Retrieve the user's cart
  const [CARTS, FOUND] = lsFind("carts", (cart) => cart.userId == USER_ID);
  if (!FOUND)
    return displayError(
      "Votre panier est vide",
      "h2-info inactive",
      "h2-title",
    );

  // Display the cart
  const [CART, TBODY] = [new Cart(), document.querySelector("tbody")];
  Object.assign(CART, FOUND);
  const TOTAL_PRICE = CART.display(PRODUCTS, TBODY);

  // Empty shopping cart (normally, that shouldn't happen)
  if (TOTAL_PRICE == 0)
    return displayError(
      "Votre panier est vide",
      "h2-info inactive",
      "h2-title",
    );

  // Display the title
  document.querySelector("main section div").classList.remove("inactive");
  const H2 = document.querySelector("main section h2");
  H2.classList.remove("inactive");
  H2.textContent = "Mon panier";
  H2.style.marginBottom = "30px";

  // Add the line corresponding to the total cart amount
  const TR = document.createElement("tr");
  TR.style.fontWeight = "600";
  TR.style.letterSpacing = "1px";
  TR.innerHTML = `
        <td colspan="4">Total</td>
        <td>${TOTAL_PRICE}€</td>
        <td>
            <button type="submit" id="btn-order" class="btn btn-success" title="Commander" aria-label="Commander">
                <i class="fa-solid fa-money-bill-transfer"></i>
            </button>
        </td>
    `;
  TBODY.appendChild(TR);
  return true;
}

// Change the quantity of a product
function changeCartQuantity(objInput, productId, quantity) {
  const QUANTITY = parseInt(objInput.value.replace(/\D/g, ""));
  if (!QUANTITY || QUANTITY < 0) {
    // Invalid quantity
    objInput.value = quantity;
    alert("La quantité doit être un nombre entier positif !");
  } else {
    // Update the quantity and reload the page
    updateCartProduct(productId, QUANTITY);
    window.location.reload();
  }
}

// Remove a product from the cart after a user click
function deleteCartProduct(productId) {
  // Remove the product from the shopping cart and reload the page
  removeCartProduct(productId);
  window.location.reload();
}
