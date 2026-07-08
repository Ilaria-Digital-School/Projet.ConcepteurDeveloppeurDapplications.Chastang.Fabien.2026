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
        if (CLASSPROD[0]) CLASSPROD.forEach(c => ARTICLE_PRODUCT.classList.add(c));

        // Button definition
        let btn = '<button type="button"';
        if (button.name) btn += ` name="${button.name}"`;
        if (button.id) btn += ` id="${button.id}"`;
        if (button.attribute) btn += ` ${button.attribute.name}="${button.attribute.value}"`;
        btn += `>${button.text}</button>`;

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
    iniCarousel(carouselInner, container, productId, index) {
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
        ["d-block", "w-100", "carousel-img"].forEach(c => IMG.classList.add(c));
        IMG.src = this.img;
        IMG.alt = this.description;

        DIV_PRODUCT.appendChild(IMG);
        carouselInner.appendChild(DIV_PRODUCT);

        // Display the product in the container
        if (container) {
            const ID = `btn-product-${this.id}`;
            const PRODUCT_DETAIL = this.display(container, "article-product inactive", { id: ID, text: "Acheter" }, false);
            PRODUCT_DETAIL.id = `product-${this.id}`;

            // Add an event to add the product to the user's cart
            document.getElementById(ID).addEventListener("click", () => {
                window.location.href = `shopping.html?id=${this.id}`;
            });
        }

        return activeProduct;
    }
}

// Add a new product to local storage
function addProduct(toConsole = false) {
    const displayMsg = (toConsole) ? console.log : alert;
    const PREFIX_MSG = (toConsole) ? "[add product] - " : "";

    // Get the parameters
    const NAME = document.getElementById("name-product").value.trim();
    const DESCRIPTION = document.getElementById("description-product").value.trim();
    const PRICE = parseFloat(document.getElementById("price-product").value.trim());
    const IMG = document.getElementById("img-product").value.trim();
    let info = document.getElementById("info-product").value.trim();
    if (info == "") info = undefined;

    if (NAME && PRICE > 0) {
        // Create a new product and save it to local storage
        const PRODUCT = new Product(NAME, DESCRIPTION, PRICE, IMG, info);
        lsGetItems("products").lsAddItem("products", PRODUCT);

        // Reset the form and display the validation message
        FORM_PRODUCT.reset();
        displayMsg(PREFIX_MSG + "Le produit a été ajouté.");
    } else
        displayMsg(PREFIX_MSG + "Le nom et/ou le prix sont incorrects !");
}

// Update a product in local storage
function updateProduct(productId, name, description, price, img, info, toConsole = false) {
    const displayMsg = (toConsole) ? console.log : alert;
    const PREFIX_MSG = (toConsole) ? "[update product] - " : "";

    const PRODUCTS = lsGetItems("products");
    if (PRODUCTS.length > 0) {
        const ID = parseInt(productId);
        let product;

        if (ID && (product = PRODUCTS.find(p => p.id == ID))) {
            // Retrieve the parameters and perform the update
            let isChanged = false;

            const NAME = (typeof name == "string" || name instanceof String) ? name.trim() : "";
            isChanged ||= product.updateProperty("name", NAME, NAME && product.name != NAME);

            const DESCRIPTION = (typeof description == "string" || description instanceof String) ? description.trim() : "";
            isChanged ||= product.updateProperty("description", DESCRIPTION, DESCRIPTION && product.description != DESCRIPTION);

            const PRICE = parseFloat(price);
            isChanged ||= product.updateProperty("price", PRICE, PRICE && product.price != PRICE);

            const IMG = (typeof img == "string" || img instanceof String) ? img.trim() : "";
            isChanged ||= product.updateProperty("img", IMG, IMG && product.img != IMG);

            const INFO = (typeof info == "string" || info instanceof String) ? info.trim() : undefined;
            isChanged ||= product.updateProperty("info", INFO, product.info != INFO);

            if (isChanged) {
                // Save the changes to local storage and display the confirmation message
                localStorage.setItem("products", JSON.stringify(PRODUCTS));
                displayMsg(PREFIX_MSG + "Votre produit a été mis à jour.", toConsole);
            } else
                // No changes have been done
                displayMsg(PREFIX_MSG + "Aucune modification n'a été apportée à votre produit !");
        } else
            displayMsg(PREFIX_MSG + "L'identifiant est incorrect !");
    } else
        displayMsg(PREFIX_MSG + "Mise à jour impossible : aucun produit n'est enregistré !");
}

// Remove a product from local storage
function removeProduct(productId) {
    lsGetItems("products").lsRemoveItem("products", productId);
}

//////////////////////////////////////////////////////////////////////////
// Display the products

// Fill the carousel and display the products
function fillCarousel(products, productId) {
    const CAROUSEL_INNER = document.querySelector(".carousel-inner");
    const CONTAINER = document.querySelector(".product-container");
    const PRODUCT_ID = parseInt(productId) || 0;
    let activeProduct;

    products.forEach((product, index) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, product);

        const ACTIVE_PRODUCT = PRODUCT.iniCarousel(CAROUSEL_INNER, CONTAINER, PRODUCT_ID, index);
        if (ACTIVE_PRODUCT) activeProduct = ACTIVE_PRODUCT;
    });

    activeProduct.classList.add("active");
}