  const searchInput = document.getElementById('jobSearch');
  const filterSelect = document.getElementById('jobFilter');
  const jobCards = document.querySelectorAll('.job-card');

  function filterJobs() {
    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    jobCards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const dept = card.getAttribute('data-dept');

      if ((text.includes(searchText)) && (filterValue === 'all' || filterValue === dept)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  searchInput.addEventListener('input', filterJobs);
  filterSelect.addEventListener('change', filterJobs);