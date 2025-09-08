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