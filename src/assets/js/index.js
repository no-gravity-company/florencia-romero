const initializeForm = () => {
  const checkbox = document.getElementById('formAgree');
  const submitButton = document.getElementById('formSubmit');

  submitButton.setAttribute('disabled', 'disabled');
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      submitButton.removeAttribute('disabled');
    } else {
      submitButton.setAttribute('disabled', 'disabled');
    }
  });
};

const toggleButtons = (openButton, closeButton) => {
  if (openButton.classList.contains('visible')) {
    openButton.classList.remove('visible');
    closeButton.classList.add('visible');
  } else {
    openButton.classList.add('visible');
    closeButton.classList.remove('visible');
  }
};

const closeDropdown = (openButton, closeButton, dropdown) => {
  openButton.classList.add('visible');
  closeButton.classList.remove('visible');
  dropdown.classList.remove('open');
};

const closeDropdownOnLargeScreens = (openButton, closeButton, dropdown) => () => {
  if (window.innerWidth > 864) {
    closeDropdown(openButton, closeButton, dropdown);
  }
};

const initializeDropdown = () => {
  const openButton = document.getElementById('open-dropdown');
  const closeButton = document.getElementById('close-dropdown');
  const dropdown = document.getElementById('header-dropdown');

  openButton.addEventListener('click', () => {
    dropdown.classList.add('open');
    toggleButtons(openButton, closeButton);
  });
  closeButton.addEventListener('click', () => {
    dropdown.classList.remove('open');
    toggleButtons(openButton, closeButton);
  });
  window.addEventListener(
    'DOMContentLoaded',
    closeDropdownOnLargeScreens(openButton, closeButton, dropdown)
  );
  window.addEventListener('resize', closeDropdownOnLargeScreens(openButton, closeButton, dropdown));
  document.querySelectorAll('.dropdown-section').forEach((sectionLink) => {
    sectionLink.addEventListener('click', () => {
      closeDropdown(openButton, closeButton, dropdown);
    });
  });
};

const initializeIntersectionObserver = () => {
  document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section');

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('currentSection');
          document.getElementById(`${entry.target.id}-url`)?.classList.add('currentSection');
        } else {
          entry.target.classList.remove('currentSection');
          document.getElementById(`${entry.target.id}-url`)?.classList.remove('currentSection');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-420px',
    });

    sections.forEach((section) => observer.observe(section));
  });
};

initializeDropdown();
initializeForm();
initializeIntersectionObserver();
