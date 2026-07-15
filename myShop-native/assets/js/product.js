//////////////////////////////////////////////////////////////////////////
// Manage products
//////////////////////////////////////////////////////////////////////////


// Main class
class Product {
    constructor(name, description, price, img, info) {
        this.id = 0;
        this.name = name;
        this.description = description;
        this.price = price;
        this.img = img;
        this.info = info;
        this.isVisible = true;
    }

    // Update a property /////////////////////////////////////////////////
    updateProperty(property, value, toChange) {
        if (toChange) this[property] = value;
        return toChange;
    }

    // Display the product ///////////////////////////////////////////////
    display(container, classProd, button, info = true, sticker = true) {
        const ARTICLE = document.createElement("article");
        ARTICLE.setAttribute("tabindex", "0");

        // Add the classes if necessary
        const CLASSPROD = classProd.trim().split(/\s+/);
        if (CLASSPROD[0]) CLASSPROD.forEach(css => ARTICLE.classList.add(css));

        // Button definition
        const BTN_ID = `btn-product-${this.id}`;
        let btn = `<button type="button" id="${BTN_ID}"`;
        if (button.name) btn += ` name="${button.name}"`;
        if (button.attributes) button.attributes.forEach(attribute => btn += ` ${attribute.name}="${attribute.value}"`);
        btn += `>${button.text}</button>`;

        // Fill in the article
        if (info && this.info)
            // With information message
            ARTICLE.innerHTML = `
                <h3 class="product-title">${this.name}</h3>
                <p>${this.info}</p>
                <div><img src="${this.img}" alt="${this.description}"></div>
                <p>${this.description}</p>
                <p>Prix : ${this.price}€</p>
                ${btn}
            `;
        else
            // Without information message
            ARTICLE.innerHTML = `
                <h3 class="product-title">${this.name}</h3>
                <div><img src="${this.img}" alt="${this.description}"></div>
                <p>${this.description}</p>
                <p>Prix : ${this.price}€</p>
                ${btn}
            `;

        // Display stickers by price if necessary
        if (sticker) this.addSticker(ARTICLE);

        // Add the product to the container
        container.appendChild(ARTICLE);

        // Add an event to the button
        if (button.callbackfn) {
            document.getElementById(BTN_ID).addEventListener("click", () => {
                button.callbackfn(this.id);
            });
        }

        return ARTICLE;
    }

    // Display stickers by price /////////////////////////////////////////
    addSticker(article) {
        if (this.price < 25 || this.price > 50) {
            const STICKER = document.createElement("span");
            if (this.price < 25) {
                STICKER.classList.add("article-good");
                STICKER.innerHTML = "Bonne<br>Affaire";
            } else {
                STICKER.classList.add("article-top");
                STICKER.innerHTML = "Top<br>Produit";
            }
            article.appendChild(STICKER);
            return STICKER;
        }
        return null;
    }

    // Display the product in the carousel ///////////////////////////////
    iniCarousel(productId, index, carouselInner, container, button) {
        let activeProduct = null;

        // Fill the carousel
        const DIV = document.createElement("div");
        DIV.classList.add("carousel-item");
        if (this.id == productId)
            activeProduct = DIV;
        else if (index == 0)
            activeProduct = DIV;
        DIV.setAttribute("data-item-id", this.id);

        const IMG = document.createElement("img");
        ["d-block", "w-100", "carousel-img"].forEach(css => IMG.classList.add(css));
        IMG.src = this.img;
        IMG.alt = this.description;

        DIV.appendChild(IMG);
        carouselInner.appendChild(DIV);

        // Display the product in the container
        if (container) {
            const DETAIL = this.display(container, "article-product inactive", button, false);
            DETAIL.id = `product-${this.id}`;
        }

        return activeProduct;
    }
}


//////////////////////////////////////////////////////////////////////////
// Add, update and remove a product
//////////////////////////////////////////////////////////////////////////


// UTILITIES: functions to validate the 'name' and 'price'
function checkName(name) {
    const NAME = (name) ? name.toString().trim() : "";
    return (NAME.replace(/\s/g, "").length >= 3) ? NAME.replace(/\s{2,}/g, " ") : null;
}
function checkPrice(price) {
    const PRICE = parseFloat(price);
    return (PRICE > 0) ? PRICE : null;
}

// Add a new product to local storage
function addProduct(toConsole = false) {
    const PREFIX_LOG = (toConsole) ? "[add product] - " : null;

    // Check the parameters
    const NAME = checkName(document.getElementById("name-product").value);
    if (!NAME)
        return displayLog("Le nom doit contenir au moins trois caractères non blancs !", toConsole, PREFIX_LOG);

    const PRICE = checkPrice(document.getElementById("price-product").value);
    if (!PRICE)
        return displayLog("Prix doit être un nombre positif !", toConsole, PREFIX_LOG);

    // Retrieve the other parameters
    const DESCRIPTION = document.getElementById("description-product").value.trim();
    const IMG = document.getElementById("img-product").value.trim();
    let info = document.getElementById("info-product").value.trim();
    if (info == "") info = undefined;

    // Create a new product and save it to local storage
    const PRODUCT = new Product(NAME, DESCRIPTION, PRICE, IMG, info);
    lsGetItems("products").lsAddItem("products", "id", PRODUCT);

    // Reset the form and display the validation message
    document.querySelector("form").reset();
    displayLog("Le produit a été ajouté.", toConsole, PREFIX_LOG);
    return true;
}

// Update a product in local storage
function updateProduct(productId, name, description, price, img, info, toConsole = false) {
    const PREFIX_LOG = (toConsole) ? "[update product] - " : null;

    // Retrieve the products
    const PRODUCTS = lsGetItems("products");
    if (PRODUCTS.length == 0)
        return displayLog("Mise à jour impossible : aucun produit n'est enregistré !", toConsole, PREFIX_LOG);

    // Retrieve the product by its ID
    let product;
    const ID = parseInt(productId);
    if (!ID || !(product = PRODUCTS.find(item => item.id == ID)))
        return displayLog("L'identifiant est incorrect !", toConsole, PREFIX_LOG);

    // Check the parameters
    const NAME = checkName(name);
    if (!NAME)
        return displayLog("Le nom doit contenir au moins trois caractères non blancs !", toConsole, PREFIX_LOG);

    const PRICE = checkPrice(price);
    if (!PRICE)
        return displayLog("Prix doit être un nombre positif !", toConsole, PREFIX_LOG);

    // Perform the update
    let isChanged = false;
    isChanged ||= product.updateProperty("name", NAME, product.name != NAME);
    isChanged ||= product.updateProperty("price", PRICE, product.price != PRICE);

    const DESCRIPTION = (description) ? description.toString().trim() : "";
    isChanged ||= product.updateProperty("description", DESCRIPTION, DESCRIPTION && product.description != DESCRIPTION);

    const IMG = (img) ? img.toString().trim() : "";
    isChanged ||= product.updateProperty("img", IMG, IMG && product.img != IMG);

    const INFO = (info) ? info.toString().trim() : undefined;
    isChanged ||= product.updateProperty("info", INFO, product.info != INFO);

    if (isChanged) {
        // Save the changes to local storage and display the confirmation message
        PRODUCTS.saveToLS("products");
        displayLog("Votre produit a été mis à jour.", toConsole, PREFIX_LOG);
    } else
        // No changes have been done
        displayLog("Aucune modification n'a été apportée à votre produit !", toConsole, PREFIX_LOG);

    return true;
}

// Enable or disable a product from local storage
function setVisibilityProduct(productId, isVisible, toConsole = true) {
    lsGetItems("products").lsSetVisibilityItem("products", "id", productId, isVisible);
    ((toConsole) ? console.log : alert)(((toConsole) ? "[visibility product] - " : "") + `Le produit a été ${(isVisible) ? "réactivé" : "archivé"}.`);
}

// Remove a product from local storage
function removeProduct(productId, toConsole = true) {
    lsGetItems("products").lsRemoveItem("products", "id", productId);
    ((toConsole) ? console.log : alert)(((toConsole) ? "[remove product] - " : "") + "Le produit a été supprimé.");
}


//////////////////////////////////////////////////////////////////////////
// Manage the carousel
//////////////////////////////////////////////////////////////////////////


// Fill the carousel and display the products in the container
function fillCarousel(products, productId, button) {
    const PRODUCT_ID = parseInt(productId) || 0;
    const CONTAINERS = [document.querySelector(".carousel-inner"), document.querySelector(".product-container")];
    CONTAINERS[1].classList.remove("inactive");

    let activeProduct;
    products.forEach((product, index) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, product);

        const ACTIVE_PRODUCT = PRODUCT.iniCarousel(PRODUCT_ID, index, ...CONTAINERS, button);
        if (ACTIVE_PRODUCT) activeProduct = ACTIVE_PRODUCT;
    });
    activeProduct.classList.add("active");
}