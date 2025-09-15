  document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".admin-sidebar a");

    links.forEach(link => {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === currentPage) {
        link.classList.add("active-a");
        link.classList.remove("opacity-50");
      } else {
        link.classList.remove("active-a");
        link.classList.add("opacity-50");
      }
    });
  });