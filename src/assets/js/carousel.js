const storage = firebase.storage();
const storageRef = storage.ref();
const carrouselImagesPath = 'carousel-images/';
const carouselImagesFolderRef = storageRef.child(carrouselImagesPath);

const getImagesRefList = async () => {
  const list = await carouselImagesFolderRef.listAll();
  return list.items;
};

const getAllImageUrls = async () => {
  const imagesRefList = await getImagesRefList();
  const urls = await Promise.all(imagesRefList.map((imageRef) => imageRef.getDownloadURL()));
  return urls;
};

const preloadImage = (url) => {
  const img = new Image();
  img.src = url;
};

const initializeCarousel = async () => {
  const imageUrls = await getAllImageUrls();
  const carousel = $('.carousel');

  const options = {
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    draggable: true,
    infinite: true,
    autoplay: true,
    swipeToSlide: true,
    autoplaySpeed: 1500,
    speed: 150,
    pauseOnHover: true,
    focusOnSelect: false,
    arrows: true,
    prevArrow: '<button class="slick-prev">Prev</button>',
    nextArrow: '<button class="slick-next">Next</button>',
  };

  imageUrls.forEach((url, index) => {
    carousel.append(`<div><img data-lazy="${url}" alt="portfolio ${index + 1}"></div>`);
  });

  carousel.on('init', function (event, slick) {
    preloadCloneImages(imageUrls.length);
    preloadAdjacentImages(slick, 4);
  });

  carousel.on('afterChange', function (event, slick, currentSlide) {
    preloadAdjacentImages(slick, 4);
  });

  $(window).on('resize', function () {
    options.slidesToShow = getSlidesToShow();
    carousel.slick('slickSetOption', options, true);
  });

  carousel.slick(options);
};

const getSlidesToShow = () => {
  const windowWidth = $(window).width();
  if (windowWidth > 1400) return 4;
  if (windowWidth > 950) return 3;
  if (windowWidth > 625) return 2;
  return 1;
};

const preloadCloneImages = (totalSlides) => {
  const slidesToShow = getSlidesToShow();
  for (let i = 1; i <= slidesToShow; i++) {
    const nextSlide = $(`[data-slick-index="${totalSlides + i - 1}"]`);
    const prevSlide = $(`[data-slick-index="${-i}"]`);

    const nextImg = nextSlide.find('img[data-lazy]');
    const prevImg = prevSlide.find('img[data-lazy]');

    if (nextImg.length && !nextImg.attr('src')) {
      nextImg.attr('src', nextImg.data('lazy')).removeAttr('data-lazy');
    }

    if (prevImg.length && !prevImg.attr('src')) {
      prevImg.attr('src', prevImg.data('lazy')).removeAttr('data-lazy');
    }
  }
};

const preloadAdjacentImages = (slick, range) => {
  const currentSlide = slick.currentSlide;
  const totalSlides = slick.slideCount;

  for (let i = 0; i <= range; i++) {
    const nextIndex = (currentSlide + getSlidesToShow() + i) % totalSlides;
    const prevIndex = (currentSlide - i + totalSlides) % totalSlides;

    const nextSlide = slick.$slides.eq(nextIndex);
    const prevSlide = slick.$slides.eq(prevIndex);

    const nextImg = nextSlide.find('img[data-lazy]');
    const prevImg = prevSlide.find('img[data-lazy]');

    if (nextImg.length && !nextImg.attr('src')) {
      nextImg.attr('src', nextImg.data('lazy')).removeAttr('data-lazy');
    }

    if (prevImg.length && !prevImg.attr('src')) {
      prevImg.attr('src', prevImg.data('lazy')).removeAttr('data-lazy');
    }
  }
};

$(document).ready(initializeCarousel);
