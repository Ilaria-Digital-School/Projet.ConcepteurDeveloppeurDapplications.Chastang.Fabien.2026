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

// Data for displaying the back-to-top button and the footer
const BTNTOP_HTML = {
  id: "scroll-top",
  label: "Back to top of page",
  html: '<i class="fa-solid fa-arrow-up"></i>',
};
const FOOTER_HTML = `
    <h2>Follow me:</h2>
    <p>
        <a href="https://www.linkedin.com/in/fabien-chastang/" target="_blank"><i class="fa-brands fa-square-linkedin"></i>LinkedIn</a>
        <a href="https://github.com/fabien-chastang" target="_blank"><i class="fa-brands fa-github"></i>GitHub</a>
        <span class="copyright">Copyright © ${new Date().getFullYear()} My Shop</span>
    </p>
`;

// Display the back-to-top button and the footer
function setFooter() {
  const CONTAINER = document.querySelector(".wrapper");

  // Display the back-to-top button
  const BTNTOP = document.createElement("button");
  BTNTOP.id = BTNTOP_HTML.id;
  BTNTOP.ariaLabel = BTNTOP.title = BTNTOP_HTML.label;
  BTNTOP.innerHTML = BTNTOP_HTML.html;
  BTNTOP.style.display = "none";
  CONTAINER.appendChild(BTNTOP);

  // Display the page footer
  const FOOTER = document.createElement("footer");
  FOOTER.innerHTML = FOOTER_HTML;
  CONTAINER.appendChild(FOOTER);
}

// Page initialization
function init() {
  // Display the back-to-top button and the footer
  setFooter();

  // Show/Hide the back-to-top button
  window.addEventListener("scroll", () => {
    document.getElementById("scroll-top").style.display =
      window.scrollY > 0 ? "block" : "none";
  });

  // Add an event to return to the top of the page
  document.getElementById("scroll-top").addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
