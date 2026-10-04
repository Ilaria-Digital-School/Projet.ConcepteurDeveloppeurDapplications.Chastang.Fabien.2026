// Edit contact
function edit(id) {
  window.location.href = "/contacts/edit?id=" + id;
}

// Delete contact
function remove(id) {
  if (confirm("Are you sure you want to delete this contact?")) {
    document.getElementById("destroy_" + id).requestSubmit();
  }
}

// Manage the back-to-top button
const MIN_SCROLL_Y = 0;
function scrollTop() {
  // Show/Hide the back-to-top button
  document.getElementById("scroll-top").style.display = "none";
  window.addEventListener("scroll", () => {
    document.getElementById("scroll-top").style.display =
      window.scrollY > MIN_SCROLL_Y ? "block" : "none";
  });

  // Add an event to return to the top of the page
  document.getElementById("scroll-top").addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Page initialization
function init() {
  scrollTop();
}

document.addEventListener("DOMContentLoaded", init);
