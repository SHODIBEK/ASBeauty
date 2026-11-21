"use strict";
(self["webpackChunkasbeauty"] = self["webpackChunkasbeauty"] || []).push([["reveal"],{

/***/ "./src/js/modules/reveal.js":
/*!**********************************!*\
  !*** ./src/js/modules/reveal.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var motion_mini__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! motion/mini */ "./node_modules/framer-motion/dist/es/animation/animators/waapi/animate-style.mjs");
/* harmony import */ var motion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! motion */ "./node_modules/framer-motion/dist/es/render/dom/viewport/index.mjs");
/* harmony import */ var motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! motion */ "./node_modules/motion-dom/dist/es/utils/stagger.mjs");
/**
 * Появление блоков при скролле (motion: inView + animate + stagger).
 *
 * - Секции: main > section:not(:first-child) — мягкий подъём с проявлением.
 * - Списки .js-stagger — дети появляются каскадом.
 *
 * Без сдвигов вёрстки (CLS = 0): анимируются только opacity и transform.
 * Первый экран не трогаем: прячутся лишь элементы, которые на момент запуска ещё ниже экрана.
 * Модуль грузится отдельным чанком после load и не запускается при prefers-reduced-motion.
 */


const SECTION_SELECTOR = 'main > section:not(:first-child)';
const STAGGER_SELECTOR = '.js-stagger';
const EASE = [0.22, 1, 0.36, 1];
const HIDDEN = {
  opacity: 0,
  transform: 'translateY(64px)'
};
const HIDDEN_ITEM = {
  opacity: 0,
  transform: 'translateY(48px) scale(0.94)'
};
const VISIBLE = {
  opacity: 1,
  transform: 'translateY(0) scale(1)'
};
let stops = [];
let hidden = [];
function isBelowFold(el) {
  return el.getBoundingClientRect().top > window.innerHeight;
}
function hide(elements, state) {
  elements.forEach(el => {
    Object.assign(el.style, state);
  });
  hidden.push(...elements);
}
function clear(elements) {
  elements.forEach(el => {
    el.style.removeProperty('opacity');
    el.style.removeProperty('transform');
  });
}
function reveal(elements, options) {
  (0,motion_mini__WEBPACK_IMPORTED_MODULE_0__.animateMini)(elements, VISIBLE, {
    duration: 1.1,
    ease: EASE,
    ...options
  }).then(() => clear(elements));
}

// Части секции (заголовок, контент, кнопки) поднимаются по очереди
function getParts(section) {
  const container = [...section.children].find(child => child.classList.contains('container'));
  return [...(container || section).children];
}
function initSections() {
  [...document.querySelectorAll(SECTION_SELECTOR)].filter(isBelowFold).forEach(section => {
    const parts = getParts(section);
    if (!parts.length) {
      return;
    }
    hide(parts, HIDDEN);
    stops.push((0,motion__WEBPACK_IMPORTED_MODULE_1__.inView)(section, () => reveal(parts, {
      delay: (0,motion__WEBPACK_IMPORTED_MODULE_2__.stagger)(0.15)
    }), {
      amount: 0.15
    }));
  });
}
function initStagger() {
  document.querySelectorAll(STAGGER_SELECTOR).forEach(list => {
    const items = [...list.children];
    if (!items.length || !isBelowFold(list)) {
      return;
    }
    hide(items, HIDDEN_ITEM);
    stops.push((0,motion__WEBPACK_IMPORTED_MODULE_1__.inView)(list, () => {
      reveal(items, {
        duration: 0.9,
        delay: (0,motion__WEBPACK_IMPORTED_MODULE_2__.stagger)(0.1, {
          startDelay: 0.25
        })
      });
    }, {
      amount: 0.15
    }));
  });
}
function init() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  initSections();
  initStagger();
}
function destroy() {
  stops.forEach(stop => stop());
  stops = [];
  clear(hidden);
  hidden = [];
}
/* harmony default export */ __webpack_exports__["default"] = ({
  init,
  destroy
});

/***/ })

}]);
//# sourceMappingURL=reveal.05343078.js.map