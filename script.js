const texts = [
  "Scanning & Digitization",
  "Selling Quality Products",
  "Innovative IT Solutions"
];

let count = 0;       // which text
let index = 0;       // which letter
let currentText = '';
let letter = '';

function typeEffect() {
  if (count === texts.length) {
    count = 0; // loop back to first text
  }

  currentText = texts[count];
  letter = currentText.slice(0, ++index);

  document.getElementById("typing-text").textContent = letter;

  if (letter.length === currentText.length) {
    // wait before deleting
    setTimeout(() => {
      deleteEffect();
    }, 1500);
  } else {
    setTimeout(typeEffect, 200); // typing speed
  }
}

function deleteEffect() {
  letter = currentText.slice(0, --index);
  document.getElementById("typing-text").textContent = letter;

  if (letter.length === 0) {
    count++;
    setTimeout(typeEffect, 300); // move to next text
  } else {
    setTimeout(deleteEffect, 50); // deleting speed
  }
}

// Start effect
typeEffect();



// Get the header element
const header = document.querySelector("header");
const triangle = document.querySelector(".triangle-hidden");


// Get the offset position of the header
const stickyOffset = header.offsetTop;


// Function to make the header sticky
function stickyHeader() {
  if (window.pageYOffset > stickyOffset) {
    triangle.style.visibility = "hidden";
    header.classList.add("sticky");
  } else {
    triangle.style.visibility = "visible"
    header.classList.remove("sticky");
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


// Get the menu toggle button and the mobile menu
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuButton = document.getElementById('close-menu');

// Function to open the mobile menu
function openMenu() {
  mobileMenu.style.visibility = "visible";
  mobileMenu.style.transform = 'translateX(0)'; 
  document.body.style.overflow = "hidden";
}

// Function to close the mobile menu
function closeMenu() {
  mobileMenu.style.visibility = "hidden";
  mobileMenu.style.transform = 'translateX(100%)'; 
  document.body.style.overflow = ""; 
}

// Add event listeners
menuToggle.addEventListener('click', openMenu);
closeMenuButton.addEventListener('click', closeMenu);
