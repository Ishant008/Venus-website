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