"use strict";
(self["webpackChunkasbeauty"] = self["webpackChunkasbeauty"] || []).push([["clinic"],{

/***/ "./src/js/components/clinic.js":
/*!*************************************!*\
  !*** ./src/js/components/clinic.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/slider */ "./src/js/modules/slider.js");
/* harmony import */ var _modules_lightbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/lightbox */ "./src/js/modules/lightbox.js");



// Фото клиники: страницы bento-галереи листаются слайдером,
// фото без видео (.js-clinic-zoom) открываются в лайтбоксе — галерея по всем таким фото блока
let sliders = [];
let roots = [];
function openGallery(root, link) {
  // клоны бесконечного слайдера в галерею не попадают
  const links = [...root.querySelectorAll('.js-clinic-zoom')].filter(item => !item.closest('.is-clone'));
  const original = links.find(item => item.getAttribute('href') === link.getAttribute('href'));
  (0,_modules_lightbox__WEBPACK_IMPORTED_MODULE_1__.openImages)(links.map(item => ({
    href: item.href,
    alt: item.closest('.clinic__item').querySelector('img').alt
  })), links.indexOf(original), link);
}
function onClick(event) {
  const link = event.target.closest('.js-clinic-zoom');
  if (link) {
    event.preventDefault();
    openGallery(event.currentTarget, link);
  }
}
function init() {
  roots = [...document.querySelectorAll('.js-clinic')];
  sliders = roots.map(root => {
    root.addEventListener('click', onClick);
    return (0,_modules_slider__WEBPACK_IMPORTED_MODULE_0__["default"])(root, {
      slidesPerView: 1,
      spaceBetween: 24
    });
  });
}
function destroy() {
  sliders.forEach(slider => slider.destroy(true, true));
  roots.forEach(root => root.removeEventListener('click', onClick));
  sliders = [];
  roots = [];
}
/* harmony default export */ __webpack_exports__["default"] = ({
  init,
  destroy
});

/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createSlider; }
/* harmony export */ });
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper */ "./node_modules/swiper/swiper.mjs");
/* harmony import */ var swiper_modules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! swiper/modules */ "./node_modules/swiper/modules/index.mjs");



/**
 * Бесконечный слайдер Swiper с общей панелью .slider-nav внутри блока.
 *
 * Для loop-режима Swiper нужно слайдов больше, чем видно на экране плюс шаг прокрутки.
 * Если карточек мало (4 отзыва при 4 на экране), набор дублируется целиком (.is-clone),
 * а точки считаются по оригинальным карточкам.
 *
 * @param {Element} root корневой элемент блока (в нём .swiper и .slider-nav)
 * @param {object} options параметры Swiper
 * @returns {Swiper}
 */

function getMaxGroup(options) {
  const groups = Object.values(options.breakpoints || {}).map(item => item.slidesPerGroup || 1);
  return Math.max(options.slidesPerGroup || 1, ...groups);
}

// сколько карточек помещается в контейнер (ширина слайдов задана в CSS)
function getVisible(container, slide) {
  const slideWidth = slide.getBoundingClientRect().width;
  return slideWidth ? Math.ceil(container.clientWidth / slideWidth) : 1;
}

// дублируем набор карточек, пока их не станет достаточно для loop:
// видимые + шаг с каждой стороны (запас и для экранов шире текущего)
function cloneSlides(container, group) {
  const wrapper = container.querySelector('.swiper-wrapper');
  const originals = [...wrapper.children];
  const visible = Math.max(group, getVisible(container, originals[0]));
  const minSlides = Math.max(3, visible * 2 + group);
  originals.forEach((slide, index) => {
    slide.dataset.loopIndex = String(index);
  });
  while (wrapper.children.length < minSlides) {
    originals.forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.classList.add('is-clone');
      clone.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      wrapper.appendChild(clone);
    });
  }
  return originals.length;
}

// точки по оригинальным карточкам: страница = шаг текущего брейкпоинта
function createDots(swiper, holder, count) {
  if (!holder) {
    return;
  }
  const getGroup = () => swiper.params.slidesPerGroup || 1;
  const getPages = () => Math.ceil(count / getGroup());
  const getPage = () => Math.min(getPages() - 1, Math.floor(swiper.realIndex % count / getGroup()));
  const render = () => {
    const pages = getPages();
    if (holder.children.length !== pages) {
      holder.innerHTML = '';
      for (let page = 0; page < pages; page++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-nav__dot';
        dot.dataset.page = String(page);
        dot.setAttribute('aria-label', `Перейти к слайду ${page + 1}`);
        holder.appendChild(dot);
      }
    }
    const active = getPage();
    [...holder.children].forEach((dot, page) => {
      dot.classList.toggle('is-active', page === active);
      dot.setAttribute('aria-current', String(page === active));
    });
  };
  const onDotClick = event => {
    const dot = event.target.closest('.slider-nav__dot');
    if (dot) {
      swiper.slideToLoop(Number(dot.dataset.page) * getGroup());
    }
  };
  holder.addEventListener('click', onDotClick);
  swiper.on('realIndexChange', render);
  swiper.on('breakpoint', () => setTimeout(render));
  // слайдер пересоздают (фильтр «Наших работ») — точки и обработчик убираем
  swiper.on('destroy', () => {
    holder.removeEventListener('click', onDotClick);
    holder.innerHTML = '';
  });
  render();
}
function createSlider(root, options = {}) {
  const container = root.querySelector('.swiper');
  const count = cloneSlides(container, getMaxGroup(options));
  const swiper = new swiper__WEBPACK_IMPORTED_MODULE_0__["default"](container, {
    modules: [swiper_modules__WEBPACK_IMPORTED_MODULE_1__.Navigation, swiper_modules__WEBPACK_IMPORTED_MODULE_1__.A11y, swiper_modules__WEBPACK_IMPORTED_MODULE_1__.Keyboard],
    speed: 600,
    loop: true,
    watchOverflow: false,
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
    navigation: {
      prevEl: root.querySelector('.js-slider-prev'),
      nextEl: root.querySelector('.js-slider-next')
    },
    a11y: {
      prevSlideMessage: 'Предыдущий слайд',
      nextSlideMessage: 'Следующий слайд',
      slideLabelMessage: '{{index}} из {{slidesLength}}'
    },
    ...options
  });
  createDots(swiper, root.querySelector('.js-slider-dots'), count);

  // выключенный слайдер (например, список на мобилке) — без клонов
  const syncDisabled = () => container.classList.toggle('is-disabled', !swiper.enabled);
  swiper.on('enable disable', syncDisabled);
  syncDisabled();
  return swiper;
}

/***/ })

}]);
//# sourceMappingURL=clinic.a063245a.js.map