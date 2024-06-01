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
    const goTopButton = document.getElementById('go-top-button');

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('currentSection');
          document.getElementById(`${entry.target.id}-url`)?.classList.add('currentSection');
        } else {
          entry.target.classList.remove('currentSection');
          document.getElementById(`${entry.target.id}-url`)?.classList.remove('currentSection');
        }
        if (entry.target.id === 'title') {
          if (entry.isIntersecting) {
            goTopButton.classList.remove('visible');
          } else {
            goTopButton.classList.add('visible');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-420px',
    });

    sections.forEach((section) => observer.observe(section));
  });
};

function interpolateColor(startColor, endColor, percentage) {
  let hue = startColor.hue + (endColor.hue - startColor.hue) * percentage;
  let saturation =
    startColor.saturation + (endColor.saturation - startColor.saturation) * percentage;
  let lightness = startColor.lightness + (endColor.lightness - startColor.lightness) * percentage;

  return { hue, saturation, lightness };
}

document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('header');

  const startColor = { hue: 0, saturation: 0, lightness: 100 }; // Example start color (red)
  const endColor = { hue: 174, saturation: 40, lightness: 29 }; // Example end color (green)

  function updateHeaderStyleOnScroll(element) {
    let scrollPosition = window.scrollY;
    let windowHeight = window.innerHeight;

    // Calculate animation progress based on scroll position
    let animationProgress = 1 - Math.pow(windowHeight / (scrollPosition * 15), 2);

    animationProgress = Math.max(0, animationProgress); // Ensure opacity is not less than 0
    animationProgress = Math.min(1, animationProgress); // Ensure opacity is not more than 1

    let interpolatedColor = interpolateColor(startColor, endColor, animationProgress);

    document.documentElement.style.setProperty('--header-bg-opacity', animationProgress);
    document.documentElement.style.setProperty(
      '--header-text-color',
      `hsl(${interpolatedColor.hue}, ${interpolatedColor.saturation}%, ${interpolatedColor.lightness}%)`
    );
  }

  function handleScroll() {
    updateHeaderStyleOnScroll(header);
  }

  handleScroll();

  window.addEventListener('scroll', handleScroll);
});

initializeDropdown();
initializeForm();
initializeIntersectionObserver();
