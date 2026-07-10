//////////////////////////////////////////////////////////////////////////
// Handle the product

// Main class
class Product {
    constructor(name, description, price, img, info) {
        this.id = 0;
        this.name = name;
        this.description = description;
        this.price = price;
        this.img = img;
        this.info = info;
    }

    // Update a property
    updateProperty(property, value, toChange) {
        if (toChange) this[property] = value;
        return toChange;
    }

    // Display the product
    display(container, classProd, button, info = true, sticker = true) {
        const ARTICLE_PRODUCT = document.createElement("article");
        ARTICLE_PRODUCT.setAttribute("tabindex", "0");

        // Add the classes if necessary
        const CLASSPROD = classProd.trim().split(/\s+/);
        if (CLASSPROD[0]) CLASSPROD.forEach(css => ARTICLE_PRODUCT.classList.add(css));

        // Button definition
        const BTN_ID = `btn-product-${this.id}`;
        let btn = `<button type="button" id="${BTN_ID}"`;
        if (button.name) btn += ` name="${button.name}"`;
        if (button.attributes) button.attributes.forEach(attribute => btn += ` ${attribute.name}="${attribute.value}"`);
        btn += `>${button.text}</button>`;

        // Fill in the article
        if (info && this.info)
            // With information message
            ARTICLE_PRODUCT.innerHTML = `
                <h3 class="product-title">${this.name}</h3>
                <p>${this.info}</p>
                <div><img src="${this.img}" alt="${this.description}"></div>
                <p>${this.description}</p>
                <p>Prix : ${this.price}€</p>
                ${btn}
            `;
        else
            // Without information message
            ARTICLE_PRODUCT.innerHTML = `
                <h3 class="product-title">${this.name}</h3>
                <div><img src="${this.img}" alt="${this.description}"></div>
                <p>${this.description}</p>
                <p>Prix : ${this.price}€</p>
                ${btn}
            `;

        // Display stickers by price if necessary
        if (sticker) this.addSticker(ARTICLE_PRODUCT);

        // Add the product to the container
        container.appendChild(ARTICLE_PRODUCT);

        // Add an event to the button
        if (button.callback) {
            document.getElementById(BTN_ID).addEventListener("click", () => {
                button.callback(this.id);
            });
        }

        return ARTICLE_PRODUCT;
    }

    // Display stickers by price
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

    // Display the product in the carousel
    iniCarousel(carouselInner, productId, index, container, button) {
        let activeProduct = null;

        // Fill the carousel
        const DIV_PRODUCT = document.createElement("div");
        DIV_PRODUCT.classList.add("carousel-item");
        if (this.id == productId)
            activeProduct = DIV_PRODUCT;
        else if (index == 0)
            activeProduct = DIV_PRODUCT;
        DIV_PRODUCT.setAttribute("data-item-id", this.id);

        const IMG = document.createElement("img");
        ["d-block", "w-100", "carousel-img"].forEach(css => IMG.classList.add(css));
        IMG.src = this.img;
        IMG.alt = this.description;

        DIV_PRODUCT.appendChild(IMG);
        carouselInner.appendChild(DIV_PRODUCT);

        // Display the product in the container
        if (container) {
            const PRODUCT_DETAIL = this.display(container, "article-product inactive", button, false);
            PRODUCT_DETAIL.id = `product-${this.id}`;
        }

        return activeProduct;
    }
}

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
    const displayLog = (toConsole) ? console.log : alert;
    const PREFIX_MSG = (toConsole) ? "[add product] - " : "";

    // Check the parameters
    const NAME = checkName(document.getElementById("name-product").value);
    if (!NAME) {
        displayLog(PREFIX_MSG + "Le nom doit contenir au moins trois caractères non blancs !");
        return false;
    }
    const PRICE = checkPrice(document.getElementById("price-product").value);
    if (!PRICE) {
        displayLog(PREFIX_MSG + "Prix doit être un nombre positif !");
        return false;
    }

    // Retrieve the other parameters
    const DESCRIPTION = document.getElementById("description-product").value.trim();
    const IMG = document.getElementById("img-product").value.trim();
    let info = document.getElementById("info-product").value.trim();
    if (info == "") info = undefined;

    // Create a new product and save it to local storage
    const PRODUCT = new Product(NAME, DESCRIPTION, PRICE, IMG, info);
    lsGetItems("products").lsAddItem("products", PRODUCT);

    // Reset the form and display the validation message
    document.getElementById("form-product").reset();
    displayLog(PREFIX_MSG + "Le produit a été ajouté.");
    return true;
}

// Update a product in local storage
function updateProduct(productId, name, description, price, img, info, toConsole = false) {
    const displayLog = (toConsole) ? console.log : alert;
    const PREFIX_MSG = (toConsole) ? "[update product] - " : "";

    // Retrieve the products
    const PRODUCTS = lsGetItems("products");
    if (PRODUCTS.length == 0) {
        displayLog(PREFIX_MSG + "Mise à jour impossible : aucun produit n'est enregistré !");
        return false;
    }

    // Retrieve the product by its ID
    let product;
    const ID = parseInt(productId);
    if (!ID || !(product = PRODUCTS.find(item => item.id == ID))) {
        displayLog(PREFIX_MSG + "L'identifiant est incorrect !");
        return false;
    }

    // Check the parameters
    const NAME = checkName(name);
    if (!NAME) {
        displayLog(PREFIX_MSG + "Le nom doit contenir au moins trois caractères non blancs !");
        return false;
    }
    const PRICE = checkPrice(price);
    if (!PRICE) {
        displayLog(PREFIX_MSG + "Prix doit être un nombre positif !");
        return false;
    }

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
        localStorage.setItem("products", JSON.stringify(PRODUCTS));
        displayLog(PREFIX_MSG + "Votre produit a été mis à jour.", toConsole);
    } else
        // No changes have been done
        displayLog(PREFIX_MSG + "Aucune modification n'a été apportée à votre produit !");

    return true;
}

// Remove a product from local storage
function removeProduct(productId) {
    lsGetItems("products").lsRemoveItem("products", productId);
}

// Fill the carousel and display the products
function fillCarousel(products, productId, button) {
    const CAROUSEL_INNER = document.querySelector(".carousel-inner");
    const CONTAINER = document.querySelector(".product-container");
    const PRODUCT_ID = parseInt(productId) || 0;

    let activeProduct;
    products.forEach((product, index) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, product);

        const ACTIVE_PRODUCT = PRODUCT.iniCarousel(CAROUSEL_INNER, PRODUCT_ID, index, CONTAINER, button);
        if (ACTIVE_PRODUCT) activeProduct = ACTIVE_PRODUCT;
    });
    activeProduct.classList.add("active");
}