// Vanilla JavaScript ///////////////////////////////////////////////

// When resizing the window
function resizeWindow() {
    // Show the back-to-top button
    document.getElementById("SCROLL_TOP").style.display = (window.innerHeight >= document.body.scrollHeight) ? "none" : "block";
}

// Initialize the page
function init() {
    // Handle the products.html page ////////////////////////////////

    const CAROUSEL_PRODUCT = document.getElementById("CAROUSEL_PRODUCT");
    if (CAROUSEL_PRODUCT) {
        // The active product
        let activeItemId = "PRODUCT_" + this.querySelector(".carousel-item.active").getAttribute("data-item-id");
        document.getElementById(activeItemId).style.display = "block";

        // Add an event to handle the carousel
        CAROUSEL_PRODUCT.addEventListener("slid.bs.carousel", () => {
            // The new active product
            const NEW_ITEM_ID = "PRODUCT_" + this.querySelector(".carousel-item.active").getAttribute("data-item-id");

            // Manage visibility
            document.getElementById(activeItemId).style.display = "none";
            document.getElementById(NEW_ITEM_ID).style.display = "block";

            // Update the ID of the new active product
            activeItemId = NEW_ITEM_ID;
        });
    }

    // For all pages ////////////////////////////////////////////////

    // Set the copyright year
    const COPYRIGHT_YEAR = document.getElementById("COPYRIGHT_YEAR");
    if (COPYRIGHT_YEAR) COPYRIGHT_YEAR.innerHTML = (new Date()).getFullYear();

    // When resizing the window
    resizeWindow();
	window.addEventListener("resize", resizeWindow); // BAD WAY: uses the "resize" event to handle page resizing

    // Add an event to return to the top of the page
    document.getElementById("SCROLL_TOP").addEventListener("click", () => {
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    });
}

document.addEventListener("DOMContentLoaded", init);