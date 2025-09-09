// Get the header element
const header = document.querySelector("header");
const main = document.querySelector("main");




// Get the offset position of the header
const stickyOffset = header.offsetTop;

// Function to make the header sticky
function stickyHeader() {
  if (window.pageYOffset > stickyOffset+400) {
    header.classList.add("sticky");
    main.classList.add("margin-t");
  } else {
    header.classList.remove("sticky");
    main.classList.remove("margin-t")
  }
}

// When the user scrolls the page, run the stickyHeader function
window.onscroll = function () {
  stickyHeader();
};


// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Get all the navigation links
  const navLinks = document.querySelectorAll('nav a');
  

  // Loop through each link and check if it matches the current URL
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active'); // Add 'active' class to the current page link
    }
  });
});

