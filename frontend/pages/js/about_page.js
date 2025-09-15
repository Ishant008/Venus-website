const openBtn = document.getElementById("openVideoBtn");
      const modal = document.getElementById("videoModal");
      const closeBtn = document.getElementById("closeModal");
      const bigVideo = document.getElementById("bigVideo");

      // Open modal only when poster is clicked
      openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden"); // show popup
        bigVideo.currentTime = 0; // always start from beginning
        bigVideo.play(); // play only after click
      });

      // Close modal
      closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        bigVideo.pause();
      });

      // Close when background is clicked
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          bigVideo.pause();
        }
      });




function animateCounter(counter) {
  const target = +counter.getAttribute("data-target");
  const duration = 2000; 
  const stepTime = Math.max(Math.floor(duration / target), 20);

  let current = 0;
  const increment = target / (duration / stepTime);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      counter.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      counter.textContent = formatNumber(Math.floor(current));
    }
  }, stepTime);
}

function formatNumber(num) {
  if (num >= 1000000) return Math.floor(num / 1000000) + "M";
  if (num >= 1000) return Math.floor(num / 1000) + "K";
  return num;
}

// IntersectionObserver setup
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // reset to 0 every time before animation
        entry.target.textContent = "0";
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 }); // 50% visible hone par trigger hoga

  counters.forEach(counter => observer.observe(counter));
});
